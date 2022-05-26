const { error } = require('console');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const projectDist = 'project-dist';
const indexCatalog = 'components';
const templateFile = 'template.html';
const indexFile = 'index.html';
const styleCatalog = 'styles';
const styleFile = 'style.css';
const assets = 'assets';

const pathProjectDist = path.join(__dirname, projectDist);

async function deletefiles(way) {
  const find = await fsp.readdir(way, { recursive: true, force: true, withFileTypes: true });
  for (let file of find) {
    if (file.isFile()) {
      await fsp.unlink(path.join(way, file.name));
    }
    else {
      const nextWay = path.join(way, file.name);
      return deletefiles(nextWay);
    }
  }
}

async function checkProject() {
  const find = await fsp.readdir(__dirname, { recursive: true, force: true });
  if (find.includes(projectDist)) {
    await deletefiles(path.join(__dirname, projectDist));
  }
  else {
    await fsp.mkdir(path.join(pathProjectDist));
    await fsp.mkdir(path.join(pathProjectDist, assets));
    const assetsWay = path.join(pathProjectDist, assets);
    await fsp.mkdir(path.join(assetsWay, 'fonts'));
    await fsp.mkdir(path.join(assetsWay, 'img'));
    await fsp.mkdir(path.join(assetsWay, 'svg'));
  }
}

async function createStyleFile() {
  await fsp.appendFile(path.join(pathProjectDist, styleFile), '', (err) => {
    if (err) throw error;
  });
  const writeStream = fs.createWriteStream(path.join(pathProjectDist, styleFile), 'utf-8');
  const styleWay = path.join(__dirname, styleCatalog);
  const mass = await fsp.readdir(styleWay);
  for (let file of mass) {
    if (file.split('.')[1] === 'css') {
      const readStream = fs.createReadStream(path.join(styleWay, file), 'utf-8');
      readStream.on('data', chunk => writeStream.write(chunk));
    }
  }
}

async function createHtmlFile() {
  let readFile = await fsp.readFile(path.join(__dirname, templateFile), 'utf-8');
  const stream = fs.createWriteStream(path.join(pathProjectDist, indexFile), 'utf-8');
  const mass = await fsp.readdir(path.join(__dirname, indexCatalog), { withFileTypes: true });
  for (let file of mass) {
    const thisFile = file.name;
    if (file.isFile() && thisFile.split('.' === 'html')) {
      const readThisFile = await fsp.readFile(path.join(__dirname, indexCatalog, thisFile), 'utf-8');
      const nameSample = thisFile.split('.')[0];
      const sample = `{{${nameSample}}}`;
      readFile = (await readFile).replace(sample, readThisFile);
    }
  }
  await fsp.copyFile(path.join(__dirname, templateFile), path.join(pathProjectDist, indexFile));
  stream.write(readFile);
}

async function copyAssetsDirect() {
  const pushDir = path.join(pathProjectDist, assets);
  const readDir = path.join(__dirname, assets);
  const mass = await fsp.readdir(readDir);
  mass.forEach(async (cat) => {
    const oldCatalog = path.join(readDir, cat);
    const newCatalog = path.join(pushDir, cat);
    const readOldCatalog = await fsp.readdir(oldCatalog);
    readOldCatalog.forEach(async (file) => {
      const oldFile = path.join(oldCatalog, file);
      const newFile = path.join(newCatalog, file);
      await fsp.copyFile(oldFile, newFile);
    });
  });
}

async function createProject() {
  await checkProject();
  await createStyleFile();
  await copyAssetsDirect();
  await createHtmlFile();
}

try {
  createProject();
} catch (err) {
  throw error;
}
