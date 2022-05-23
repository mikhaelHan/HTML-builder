const { error } = require('console');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const direct = path.join(__dirname, 'styles');
const bundleFile = 'bundle.css';
const bundlDirect = 'project-dist';
const newDirect = path.join(__dirname, bundlDirect);

async function readFiles() {
	const mass = await fsp.readdir(direct);
	let data = '';
	mass.forEach(file => {
		if (file.split('.')[1] === 'css') {
			const stream = fs.createReadStream(path.join(direct, file), 'utf-8');
			stream.on('data', chunk => data += chunk);
			stream.on('end', () => {
				fs.appendFile(path.join(newDirect, bundleFile), data, (err) => {
					if (err) throw error;
				});
			});
			stream.on('error', error => console.log('Error', error.message));
		}
	});
}
try {
	readFiles();
} catch (err) {
	throw error;
}
