const _templates = import.meta.glob('./*/index.ts');


const loadTemplates = async () => {
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


export const templates = await loadTemplates();
