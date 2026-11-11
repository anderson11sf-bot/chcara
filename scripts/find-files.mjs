import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(walk(fullPath));
      } else {
        results.push(fullPath);
      }
    }
  } catch (e) {}
  return results;
}

const all = walk('C:\\Users\\ander\\OneDrive\\Desktop\\lago drone');
console.log('Total files found:', all.length);

for (const f of all) {
  console.log(f.replace('C:\\Users\\ander\\OneDrive\\Desktop\\lago drone\\', ''));
}
