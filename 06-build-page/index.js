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
	find.forEach(async (file) => {
		if (file.isFile()) {
			await fsp.unlink(path.join(way, file.name))
		}
		else {
			const nextWay = path.join(way, file.name);
			return deletefiles(nextWay);
		}
	});
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
	const styleWay = path.join(__dirname, styleCatalog);
	const mass = await fsp.readdir(styleWay);
	let data = '';
	mass.forEach(file => {
		if (file.split('.')[1] === 'css') {
			const stream = fs.createReadStream(path.join(styleWay, file), 'utf-8');
			stream.on('data', chunk => data += chunk);
			stream.on('end', () => {
				fs.appendFile(path.join(pathProjectDist, styleFile), data, (err) => {
					if (err) throw error;
				});
			});
			stream.on('error', error => console.log('Error', error.message));
		}
	});
}

async function createHtmlFile() {
	const stream = fs.createReadStream(path.join(__dirname, templateFile), 'utf-8');
	let data = '';
	stream.on('data', chunk => data += chunk);
	stream.on('end', () => {
		fs.appendFile(path.join(pathProjectDist, indexFile), data, (err) => {
			if (err) throw error;
		});
	});
}

async function copyAssetsDirect() {
	const pushDir = path.join(pathProjectDist, assets);
	const readDir = path.join(__dirname, assets);
	const mass = await fsp.readdir(readDir);
	mass.forEach(async (file) => {
		const oldCatalog = path.join(readDir, file);
		const newCatalog = path.join(pushDir, file);
		const readOldCatalog = await fsp.readdir(oldCatalog, { recursive: true, force: true });
		const oldFile = path.join(oldCatalog, readOldCatalog[0]);
		const newFile = path.join(newCatalog, readOldCatalog[0]);
		await fsp.copyFile(oldFile, newFile);
	});
}

async function createProject() {
	await checkProject();
	await createStyleFile();
	await copyAssetsDirect();
	await createHtmlFile()
}

try {
	createProject();
} catch (err) {
	throw error
}
