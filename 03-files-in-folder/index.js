const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');
const direct = `${path.dirname(__filename)}/secret-folder`;

async function readding() {
	try {
		const resp = await fsp.readdir(`${direct}`, { withFileTypes: true })
		resp.forEach(file => {
			if (file.isFile()) {
				let fileBox = (file.name).split('.');
				const fileSize = fs.statSync(`${direct}/${file.name}`).size / 1024;
				console.log(`${fileBox[0]} - ${fileBox[1]} - ${Math.round(fileSize * 100) / 100}kb`);
			}
		})
	} catch (err) {
		console.log(err);
	}
}
readding();