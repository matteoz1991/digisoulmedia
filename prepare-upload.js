import fs from 'fs';
import path from 'path';

const TARGET_DIR = 'Gör-uppladdning-här';
const IGNORE_LIST = [
  'node_modules',
  '.git',
  'dist',
  'dist-ssr',
  TARGET_DIR,
  'upload_me',
  '.DS_Store',
  'Thumbs.db',
  'package-project.js',
  'prepare-upload.js'
];

function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
}

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      if (!IGNORE_LIST.includes(childItemName)) {
        copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
      }
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log(`\n🚀 Förbereder filer för GitHub-uppladdning...`);

// Rensa tidigare export
if (fs.existsSync(TARGET_DIR)) {
  console.log(`🧹 Rensar gammal export...`);
  deleteFolderRecursive(TARGET_DIR);
}

// Skapa målmappen
fs.mkdirSync(TARGET_DIR);

// Kopiera filer
console.log(`📂 Kopierar nödvändiga filer till mappen "${TARGET_DIR}"...`);
copyRecursive('.', TARGET_DIR);

console.log(`\n✅ KLART!`);
console.log(`---------------------------------------------------------`);
console.log(`Gör nu följande:`);
console.log(`1. Öppna mappen: ${path.resolve(TARGET_DIR)}`);
console.log(`2. Dra och släpp ALLT innehåll i den mappen till GitHub.`);
console.log(`3. Du har nu en ren och professionell uppladdning utan node_modules!`);
console.log(`---------------------------------------------------------`);
