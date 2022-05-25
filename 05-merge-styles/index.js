const { error } = require('console');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const direct = path.join(__dirname, 'styles');
const bundleFile = 'bundle.css';
const bundlDirect = 'project-dist';
const newDirect = path.join(__dirname, bundlDirect);

async function fileСheck() {
	const find = await fsp.readdir(newDirect, { recursive: true, force: true });
	const res = find.includes(bundleFile);
	if (res) {
		await fsp.unlink(path.join(newDirect, bundleFile));
		await fsp.appendFile(path.join(newDirect, bundleFile), '', (err) => {
			if (err) throw error
		})
	}
	else await fsp.appendFile(path.join(newDirect, bundleFile), '', (err) => {
		if (err) throw error
	})
}



async function readFiles() {
	await fileСheck();
	const writeStream = fs.createWriteStream(path.join(newDirect, bundleFile), 'utf-8');
	const mass = await fsp.readdir(direct);
	mass.forEach(async file => {
		if (file.split('.')[1] === 'css') {
			const readStream = fs.createReadStream(path.join(direct, file), 'utf-8');
			readStream.on('data', chunk => writeStream.write(chunk));
		}
	});
}

try {
	readFiles();
} catch (err) {
	throw error;
}
