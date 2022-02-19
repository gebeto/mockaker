import { Button, Page, Text, Card, Grid } from '@geist-ui/core';
import { ImageCanvas } from './ImageCanvas/ImageCanvas'

export const App = () => (
  <Page>
    <Grid.Container gap={2}>
      <Grid xs={24}>
        <Text h1>Mockaker</Text>
      </Grid>
      <Grid xs={24}>
        <Card shadow width="100%">
          <ImageCanvas />
        </Card>
      </Grid>
    </Grid.Container>
  </Page>
)