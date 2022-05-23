const { error } = require('console');
const fs = require('fs/promises');
const path = require('path');
const direct = path.join(__dirname, 'secret-folder');

async function readding() {
  const resp = await fs.readdir(direct, { withFileTypes: true });
  resp.forEach(async (file) => {
    if (file.isFile()) {
      const fileBox = (file.name).split('.');
      const data = await fs.stat(path.join(direct, file.name));
      let vol = Math.round((data.size / 1024) * 100) / 100;
      console.log(`${fileBox[0]} - ${fileBox[1]} - ${vol}kb`);
    }
  });
}
try {
  readding();
} catch (err) {
  throw error;
}