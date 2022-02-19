import React from 'react';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Card } from 'baseui/card';
import { Slider } from 'baseui/slider';
import { Input } from 'baseui/input';
import { FormControl } from 'baseui/form-control';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { FileUploader } from 'baseui/file-uploader';

import './styles.css';

import { templates } from './templates';


export type ImageCanvasProps = {};


const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const image = new Image();
  image.addEventListener('load', () => resolve(image));
  image.addEventListener('error', reject);
  image.src = src;
});


const withClip = (ctx: CanvasRenderingContext2D, radius: number, x: number, y: number, width: number, height: number, callback: () => any) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.save();
  ctx.clip();

  callback();

  ctx.restore();
}

const SliderInput: React.FC<any> = ({ name, label, values, setValue, min, max }) => (
  <FormControl label={label}>
    <>
      <Input size="compact" value={values[name]} type="number" min={min} max={max} onChange={(e: any) => setValue(name, parseInt(e.target.value))} />
      <Slider min={min} max={max} value={[values[name]]} onChange={e => setValue(name, e.value[0])} />
    </>
  </FormControl>
);

const ImageDebugControls: React.FC<any> = ({ values, setValue, setFile }) => {
  return (
    <>
      <FlexGridItem width="100%">
        <Checkbox
          checked={values.debug}
          labelPlacement={LABEL_PLACEMENT.right}
          onChange={(e: any) => setValue('debug', e.target.checked)}
        >
          Debug
        </Checkbox>
      </FlexGridItem>
      <FlexGrid flexGridColumnCount={5} flexGridColumnGap="scale800">
        <FlexGridItem>
          <SliderInput min={0} max={2048} label="X" name="x" values={values} setValue={setValue} />
        </FlexGridItem>
        <FlexGridItem>
          <SliderInput min={0} max={2048} label="Y" name="y" values={values} setValue={setValue} />
        </FlexGridItem>
        <FlexGridItem>
          <SliderInput min={0} max={2048} label="Width" name="width" values={values} setValue={setValue} />
        </FlexGridItem>
        <FlexGridItem>
          <SliderInput min={0} max={2048} label="Height" name="height" values={values} setValue={setValue} />
        </FlexGridItem>
        <FlexGridItem>
          <SliderInput min={0} max={300} label="Corner" name="cornerRadius" values={values} setValue={setValue} />
        </FlexGridItem>
      </FlexGrid>
      <FlexGridItem>
        <FileUploader onDropAccepted={files => setFile(files?.[0])} />
      </FlexGridItem>
    </>
  );
}

type DebugValues = {
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius: number;
  debug: boolean;
}

const initial: DebugValues = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  cornerRadius: 0,
  debug: false,
}

const useDebugValues = (defaults?: Partial<DebugValues>) => {
  const [debugValues, setDebugValues] = React.useState<DebugValues>({
    ...initial,
    ...defaults
  });
  const setValue = (name: string, value: number) => {
    setDebugValues({ ...debugValues, [name]: value })
  };

  return [debugValues, setValue] as [typeof debugValues, typeof setValue];
}


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
      ctx.fillStyle = 'black';

      const posX = debug ? debugValues.x : template.position[0];
      const posY = debug ? debugValues.y : template.position[1];
      const sizeWidth = debug ? debugValues.width : template.size[0];
      const sizeHeight = debug ? debugValues.height : template.size[1];
      const cornerRadius = debug ? debugValues.cornerRadius : template.cornerRadius;

      withClip(ctx, cornerRadius, posX, posY, sizeWidth, sizeHeight, () => {
        ctx.fillRect(posX, posY, sizeWidth, sizeHeight);
        if (image) {
          ctx.drawImage(image, 0, 0, image.width, image.height, template.position[0], template.position[1], sizeWidth, template.size[1]);
        }
      });
      ctx.drawImage(templateImage, 0, 0, templateImage.width, templateImage.height, 0, 0, 2048, 2048);
    })();
  }, [canvas, file, debug, debugValues]);

  return (
    <FlexGrid overflow="visible" flexGridColumnCount={2} flexGridColumnGap="scale800">
      <FlexGridItem>
        <Card>
          <canvas
            className="image-canvas"
            width="2048"
            height="2048"
            ref={setCanvas}
          />
        </Card>
      </FlexGridItem>
      <FlexGridItem>
        <ImageDebugControls
          values={debugValues}
          setValue={setDebugValue}
          setFile={setFile}
        />

        <FlexGridItem>
          <pre style={{width: '100%'}}>
            {JSON.stringify({
              position: [debugValues.x, debugValues.y],
              size: [debugValues.width, debugValues.height],
              cornerRadius: debugValues.cornerRadius,
            }, undefined, 4)}
          </pre>
        </FlexGridItem>
      </FlexGridItem>
    </FlexGrid>
  );
}