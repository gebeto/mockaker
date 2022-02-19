import React from 'react';
import { Grid, Card, Text, Input } from '@geist-ui/core';

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
  const template = templates[0];

  React.useEffect(() => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    (async () => {
      const _template = await loadImage(template.link);
      const image = file ? await loadImage(URL.createObjectURL(file)) : undefined;
      ctx.strokeStyle = 'red';
      ctx.fillStyle = 'red';
      withClip(ctx, 90, template.position[0], template.position[1], template.size[0], template.size[1], () => {
        ctx.fillRect(template.position[0], template.position[1], template.size[0], template.size[1]);
        if (image) {
          ctx.drawImage(image, 0, 0, image.width, image.height, template.position[0], template.position[1], template.size[0], template.size[1]);
        }
      });
      ctx.drawImage(_template, 0, 0, _template.width, _template.height, 0, 0, 2048, 2048);
    })();
  }, [canvas, file]);

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