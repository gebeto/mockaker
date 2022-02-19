import React from 'react';


const _templates = import.meta.glob('./*/index.ts');


export const loadTemplates = async () => {
  const result = [];

  for (const key in _templates) {
    const template = await _templates[key]();
    result.push({
      id: key,
      label: template.default.title,
      ...template.default
    });
  }

  return result;
};

export const useTemplates = () => {
  const [templates, setTemplates] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadTemplates().then(setTemplates);
  }, []);

  return templates;
}