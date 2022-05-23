const fs = require('fs/promises');   //  'fs/promises'  //  node 04-copy-directory
const path = require('path');
const direct = path.join(__dirname, 'files');
const copyDirect = path.join(__dirname, 'files-copy');

async function readding(nowPath) {
	const res = await fs.readdir(__dirname, { recursive: true, force: true })
	return res.includes('files-copy')
}
readding(direct).then(data => console.log(data));

