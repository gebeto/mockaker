import React from 'react';


export type DebugValues = {
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius: number;
  debug: boolean;
}


export const initialDebugValues: DebugValues = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  cornerRadius: 0,
  debug: false,
}


export const useDebugValues = (defaults?: Partial<DebugValues>) => {
  const [debugValues, setDebugValues] = React.useState<DebugValues>({
    ...initialDebugValues,
    ...defaults
  });
  const setValue = (name: string, value: number) => {
    setDebugValues({ ...debugValues, [name]: value })
  };

  return [debugValues, setValue] as [typeof debugValues, typeof setValue];
}
