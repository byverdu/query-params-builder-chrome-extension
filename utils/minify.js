import fs, { promises } from 'fs';
import { minify } from 'terser';
import { minify as htmlMinifier } from 'html-minifier-terser';
import path from 'path';

const BASE_PATH = 'dist';
const { readFile, writeFile } = promises;
/**
 *
 * @param {String} dirPath path to read files
 * @param {String[]} arrayOfFiles files inside dirPath
 * @returns String[]
 */
const getFilesToMinify = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  const extensionsToExclude = new RegExp(
    ['.png', '.min.js', '.map', '.json'].join('|')
  );
  let innerArray = arrayOfFiles || [];

  files.forEach(function (file) {
    const filePath = `${dirPath}/${file}`;

    if (fs.statSync(filePath).isDirectory()) {
      innerArray = getFilesToMinify(dirPath + '/' + file, innerArray);
    } else {
      if (!extensionsToExclude.test(filePath)) {
        innerArray.push(filePath);
      }
    }
  });

  return innerArray;
};

(async () => {
  const filesToMinify = getFilesToMinify(BASE_PATH);

  for (const file of filesToMinify) {
    try {
      let minifiedContent;
      const fileContent = await readFile(file, { encoding: 'utf-8' });
      const extensionName = path.extname(file);

      if (extensionName === '.html') {
        minifiedContent = await htmlMinifier(fileContent, {
          minifyCSS: true,
          collapseWhitespace: true,
        });
      } else {
        const jsMinified = await minify(fileContent);
        minifiedContent = jsMinified.code;
      }

      await writeFile(file, minifiedContent);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
})();
