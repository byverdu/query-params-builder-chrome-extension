import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 *
 * @param {"options" | "popup"} fileName
 * @returns
 */
function readFileContent(fileName) {
  const fileNameMapper = {
    options: 'src/pages/options/index.html',
    popup: 'src/pages/popup/index.html',
  }[fileName];
  const filePath = resolve('.', fileNameMapper);

  return readFileSync(filePath, {
    encoding: 'utf-8',
  });
}

export { readFileContent };
