const { error } = require('console');
const fs = require('fs/promises');
const path = require('path');
const files = 'files';
const copyFiles = 'files-copy';
const direct = path.join(__dirname, files);
const copyDirect = path.join(__dirname, copyFiles);

async function createNewCatalog() {
  const find = await fs.readdir(__dirname, { recursive: true, force: true });
  const res = find.includes(copyFiles);
  if (res) {
    const newRes = await fs.readdir(copyDirect);
    newRes.forEach(async (file) => {
      await fs.unlink(path.join(copyDirect, file));
    });
  }
  else {
    fs.mkdir(copyDirect, err => {
      if (err) throw error;
    });
  }
}

async function createFiles() {
  await createNewCatalog();
  const mass = await fs.readdir(direct);
  mass.forEach(async (file) => {
    const oldFile = path.join(direct, file);
    const newFile = path.join(copyDirect, file);
    await fs.copyFile(oldFile, newFile);
  });
}
try {
  createFiles();
} catch (err) {
  throw error;
}