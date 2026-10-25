import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getComponent } from './catalog';

/** Read only source files listed in the component catalog. */
export async function getComponentSources(slug: string): Promise<{ source: string; css: string }> {
  const component = getComponent(slug);
  if (!component) throw new Error(`Unknown component: ${slug}`);

  const directory = path.join(process.cwd(), 'src', 'components', 'anticraft');
  const [source, css] = await Promise.all([
    readFile(path.join(directory, component.file), 'utf8'),
    readFile(path.join(directory, component.cssFile), 'utf8'),
  ]);

  return { source, css };
}
