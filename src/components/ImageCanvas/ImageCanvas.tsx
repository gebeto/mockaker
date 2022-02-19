import React from 'react';
import { Grid, Card, Text, Slider, Toggle, Label, Input } from '@geist-ui/core';

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


export const ImageCanvas: React.FC<ImageCanvasProps> = (props) => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>();
  const [file, setFile] = React.useState<File>();
  const [debug, setDebug] = React.useState(false);
  const template = templates[1];
  const [sliderX, setSliderX] = React.useState(template.position[0]);
  const [sliderY, setSliderY] = React.useState(template.position[1]);
  const [sliderWidth, setSliderWidth] = React.useState(template.size[0]);
  const [sliderHeight, setSliderHeight] = React.useState(template.size[1]);
  const [sliderCornerRadius, setSliderCornerRadius] = React.useState(template.cornerRadius);

  React.useEffect(() => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    (async () => {
      const templateImage = await loadImage(template.link);
      const image = file ? await loadImage(URL.createObjectURL(file)) : undefined;
      ctx.clearRect(0, 0, 2048, 2048);
      ctx.strokeStyle = 'red';
      ctx.fillStyle = 'red';

      const posX = debug ? sliderX : template.position[0];
      const posY = debug ? sliderY : template.position[1];
      const sizeWidth = debug ? sliderWidth : template.size[0];
      const sizeHeight = debug ? sliderHeight : template.size[1];
      const cornerRadius = debug ? sliderCornerRadius : template.cornerRadius;

      withClip(ctx, cornerRadius, posX, posY, sizeWidth, sizeHeight, () => {
        ctx.fillRect(posX, posY, sizeWidth, sizeHeight);
        if (image) {
          ctx.drawImage(image, 0, 0, image.width, image.height, template.position[0], template.position[1], sizeWidth, template.size[1]);
        }
      });
      ctx.drawImage(templateImage, 0, 0, templateImage.width, templateImage.height, 0, 0, 2048, 2048);
    })();
  }, [canvas, file, debug, sliderX, sliderY, sliderWidth, sliderHeight, sliderCornerRadius]);

  return (
    <Grid.Container gap={2}>
      <Grid xs>
        <Card width="100%">
          <canvas
            className="image-canvas"
            width="2048"
            height="2048"
            ref={setCanvas}
          />
        </Card>
      </Grid>
      <Grid xs>
        <Grid.Container gap={2} justify="center" alignContent="flex-start">
          <Grid xs={24}>
            <Text h3>Options</Text>
          </Grid>
          <Grid xs={24}>
            <Toggle checked={debug} scale={2} onChange={e => setDebug(e.target.checked)} />
          </Grid>
          <Grid xs={24}>
            <Grid.Container gap={2}>
              <Grid xs={12}>
                <Grid.Container gap={1}>
                  <Grid xs={24}>
                    <Slider min={0} max={2048} value={sliderX} onChange={setSliderX} />
                  </Grid>
                  <Grid xs={24}>
                    <Input label="X" value={sliderX.toString()} onChange={e => setSliderX(parseInt(e.target.value))} inputMode="numeric" width="100%" />
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid xs={12}>
                <Grid.Container gap={1}>
                  <Grid xs={24}>
                    <Slider min={0} max={2048} value={sliderY} onChange={setSliderY} />
                  </Grid>
                  <Grid xs={24}>
                    <Input label="Y" value={sliderY.toString()} onChange={e => setSliderY(parseInt(e.target.value))} inputMode="numeric" width="100%" />
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid xs={12}>
                <Grid.Container gap={1}>
                  <Grid xs={24}>
                    <Slider min={0} max={2048} value={sliderWidth} onChange={setSliderWidth} />
                  </Grid>
                  <Grid xs={24}>
                    <Input label="Width" value={sliderWidth.toString()} onChange={e => setSliderWidth(parseInt(e.target.value))} inputMode="numeric" width="100%" />
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid xs={12}>
                <Grid.Container gap={1}>
                  <Grid xs={24}>
                    <Slider min={0} max={2048} value={sliderHeight} onChange={setSliderHeight} />
                  </Grid>
                  <Grid xs={24}>
                    <Input label="Height" value={sliderHeight.toString()} onChange={e => setSliderHeight(parseInt(e.target.value))} inputMode="numeric" width="100%" />
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid xs={24}>
                <Grid.Container gap={1}>
                  <Grid xs={24}>
                    <Slider min={0} max={2048} value={sliderCornerRadius} onChange={setSliderCornerRadius} />
                  </Grid>
                  <Grid xs={24}>
                    <Input label="Corner Radius" value={sliderCornerRadius.toString()} onChange={e => setSliderCornerRadius(parseInt(e.target.value))} inputMode="numeric" width="100%" />
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid xs={24}>
                <pre style={{width: '100%'}}>
                  {JSON.stringify({
                    position: [sliderX, sliderY],
                    size: [sliderWidth, sliderHeight],
                    cornerRadius: sliderCornerRadius,
                  }, undefined, 4)}
                </pre>
              </Grid>
            </Grid.Container>
          </Grid>
          <Grid xs={24}>
            <input
              type="file"
              onChange={e => {
                setFile(e.target.files?.[0])
                e.target.value = '';
              }}
            />
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
}