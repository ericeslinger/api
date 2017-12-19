import { readFileSync } from 'fs';
import { join } from 'path';

export function loadSchema(fn: string) {
  return readFileSync(join(__dirname, fn)).toString();
}
