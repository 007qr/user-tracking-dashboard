export function parseFilters(searchParams: [string, unknown][]) {
    const filters: Array<{ operator: string; property: string; value: string }> = [];
  
    for (const [key, value] of searchParams ) {
      const match = key.match(/^filters\[(\d+)\]\[(\w+)\]$/);
      if (match) {
        const index = Number(match[1]);
        const field = match[2];
  
        if (!filters[index]) {
          filters[index] = { operator: '', property: '', value: '' };
        }
        (filters[index] as any)[field] = value;
      }
    }
  
    return filters;
  }
  