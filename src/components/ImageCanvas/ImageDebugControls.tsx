import React from 'react';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Accordion, Panel } from 'baseui/accordion';
import { useDebugValues } from './debugValues';


const SliderInput: React.FC<any> = ({ name, label, values, setValue, min, max }) => (
  <FormControl label={label}>
    <Input
      size="compact"
      value={values[name]}
      type="number"
      min={min}
      max={max}
      onChange={(e: any) => setValue(name, parseInt(e.target.value))}
    />
  </FormControl>
);


export const ImageDebugControls: React.FC<any> = ({ setDebugValues, template }) => {
  const [values, setValue] = useDebugValues({
    x: template.position[0],
    y: template.position[1],
    width: template.size[0],
    height: template.size[1],
    cornerRadius: template.cornerRadius,
    debug: false,
  });

  React.useEffect(() => setDebugValues(values), [values]);

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
      {values.debug && <>
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
          <Accordion>
            <Panel title="Config" overrides={{ PanelContainer: { style: { borderBottom: 'none' } } }}>
              <pre style={{width: '100%'}}>
                {JSON.stringify({
                  position: [values.x, values.y],
                  size: [values.width, values.height],
                  cornerRadius: values.cornerRadius,
                }, undefined, 4)}
              </pre>
            </Panel>
          </Accordion>
        </FlexGridItem>
      </>}
    </>
  );
}