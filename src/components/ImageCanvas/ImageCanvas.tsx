import React from 'react';
import { styled } from 'baseui';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Card } from 'baseui/card';
import { FileUploader } from 'baseui/file-uploader';
import { Select } from 'baseui/select';
import { Spinner } from 'baseui/spinner';

import { useTemplates } from './templates';
import { DebugValues } from './debugValues';
import { ImageDebugControls } from './ImageDebugControls';
import { loadImage, withCanvasClip } from './tools';


const Canvas = styled("canvas", {
  width: '100%'
});


export const ImageCanvas: React.VFC = (props) => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>();
  const [file, setFile] = React.useState<File>();
  const templates = useTemplates();
  const [template, setTemplate] = React.useState(templates[0]);
  const [debugValues, setDebugValues] = React.useState<DebugValues>();

  React.useEffect(() => setTemplate(templates?.[0]), [templates]);

  React.useEffect(() => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    (async () => {
      const templateImage = await loadImage(template.link);
      const image = file ? await loadImage(URL.createObjectURL(file)) : undefined;
      ctx.clearRect(0, 0, 2048, 2048);
      ctx.fillStyle = debugValues?.debug ? 'red' : 'lightblue';

      const posX = debugValues?.debug ? debugValues?.x : template.position[0];
      const posY = debugValues?.debug ? debugValues?.y : template.position[1];
      const sizeWidth = debugValues?.debug ? debugValues?.width : template.size[0];
      const sizeHeight = debugValues?.debug ? debugValues?.height : template.size[1];
      const cornerRadius = debugValues?.debug ? debugValues?.cornerRadius : template.cornerRadius;

      withCanvasClip(ctx, cornerRadius, posX, posY, sizeWidth, sizeHeight, () => {
        ctx.fillRect(posX, posY, sizeWidth, sizeHeight);
        if (image) {
          ctx.drawImage(image, 0, 0, image.width, image.height, posX, posY, sizeWidth, sizeHeight);
        }
      });

      ctx.drawImage(templateImage, 0, 0, templateImage.width, templateImage.height, 0, 0, 2048, 2048);
    })();
  }, [canvas, file, debugValues, template]);

  return (
    <FlexGrid flexGridColumnCount={[1, 1, 1, 2, 2]} flexGridColumnGap="scale800" flexGridRowGap="scale800">
      <FlexGridItem>
        <Card>
          <Canvas width="2048" height="2048" ref={setCanvas} />
        </Card>
      </FlexGridItem>
      <FlexGridItem>
        <FlexGrid flexGridColumnCount={1} flexGridColumnGap="scale800" flexGridRowGap="scale800">
          <FlexGridItem>
            <Select
              options={templates}
              value={template}
              placeholder="Template"
              onChange={params => setTemplate(params.value?.[0])}
            />
          </FlexGridItem>
          <FlexGridItem>
            <FileUploader accept="image/*" onDropAccepted={files => setFile(files?.[0])} />
          </FlexGridItem>
          {template?.id && <ImageDebugControls key={template?.id} setDebugValues={setDebugValues} template={template} />}
        </FlexGrid>
      </FlexGridItem>
    </FlexGrid>
  );
}