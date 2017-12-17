import { readFileSync } from 'fs';
import { join } from 'path';

export function load(fn: string) {
  return readFileSync(join(__dirname, fn)).toString();
}
