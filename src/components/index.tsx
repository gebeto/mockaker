import { HeadingMedium } from 'baseui/typography';
import { Grid, Cell } from 'baseui/layout-grid';
import { Card } from 'baseui/card';

import { ImageCanvas } from './ImageCanvas/ImageCanvas'


export const App = () => (
  <Grid>
    <Cell span={12}>
      <HeadingMedium>Mockaker</HeadingMedium>
    </Cell>
    <Cell span={12}>
      <Card>
        <ImageCanvas />
      </Card>
    </Cell>
  </Grid>
)