const { error } = require('console');
const fs = require('fs/promises');   //  'fs/promises'  //  node 04-copy-directory
const path = require('path');
const files = 'files';
const copyFiles = 'copyFiles';
const direct = path.join(__dirname, files);
const copyDirect = path.join(__dirname, copyFiles);

async function readding(catalog) {
	const res = await fs.readdir(__dirname, { recursive: true, force: true });
	return res.includes(catalog);
}

async function createNewCatalog() {
	const res = await readding(copyFiles);
	if (!res) {
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