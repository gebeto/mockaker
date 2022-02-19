import React from 'react';
import { styled } from 'baseui';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Card } from 'baseui/card';

import { templates } from './templates';
import { useDebugValues } from './debugValues';
import { ImageDebugControls } from './ImageDebugControls';
import { loadImage, withCanvasClip } from './tools';
import { FileUploader } from 'baseui/file-uploader';

const Canvas = styled("canvas", {
  width: '100%'
});


export type ImageCanvasProps = {};


export const ImageCanvas: React.FC<ImageCanvasProps> = (props) => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>();
  const [file, setFile] = React.useState<File>();
  const template = templates[1];
  const [debugValues, setDebugValue] = useDebugValues({
    x: template.position[0],
    y: template.position[1],
    width: template.size[0],
    height: template.size[1],
    cornerRadius: template.cornerRadius,
  });
  const debug = debugValues.debug;

  React.useEffect(() => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    (async () => {
      const templateImage = await loadImage(template.link);
      const image = file ? await loadImage(URL.createObjectURL(file)) : undefined;
      ctx.clearRect(0, 0, 2048, 2048);
      ctx.fillStyle = debugValues.debug ? 'red' : 'lightblue';

      const posX = debug ? debugValues.x : template.position[0];
      const posY = debug ? debugValues.y : template.position[1];
      const sizeWidth = debug ? debugValues.width : template.size[0];
      const sizeHeight = debug ? debugValues.height : template.size[1];
      const cornerRadius = debug ? debugValues.cornerRadius : template.cornerRadius;

      withCanvasClip(ctx, cornerRadius, posX, posY, sizeWidth, sizeHeight, () => {
        ctx.fillRect(posX, posY, sizeWidth, sizeHeight);
        if (image) {
          ctx.drawImage(image, 0, 0, image.width, image.height, template.position[0], template.position[1], sizeWidth, template.size[1]);
        }
      });
      ctx.drawImage(templateImage, 0, 0, templateImage.width, templateImage.height, 0, 0, 2048, 2048);
    })();
  }, [canvas, file, debug, debugValues]);

  return (
    <FlexGrid overflow="visible" flexGridColumnCount={[1, 1, 1, 2, 2]} flexGridColumnGap="scale800" flexGridRowGap="scale800">
      <FlexGridItem>
        <Card>
          <Canvas width="2048" height="2048" ref={setCanvas} />
        </Card>
      </FlexGridItem>
      <FlexGridItem>
        <FlexGridItem>
          <FileUploader accept="image/*" onDropAccepted={files => setFile(files?.[0])} />
        </FlexGridItem>
        <ImageDebugControls
          values={debugValues}
          setValue={setDebugValue}
          setFile={setFile}
        />
      </FlexGridItem>
    </FlexGrid>
  );
}