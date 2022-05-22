const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const file = path.dirname(__filename);
process.on('exit', () => stdout.write('Good bye!!!'));

fs.writeFile(`${file}/text.txt`, '', (err) => {
	if (err) console.log(err);
	else {
		stdout.write('Please enter text...\n');
		stdin.on('data', data => {
			const info = data.toString().trim();
			if (info === 'exit') {
				process.exit();
			}
			else {
				fs.appendFile(`${file}/text.txt`, `\n${info}`, (err) => {
					if (err) console.log(err);
				});
			}
		});
	}
});




/*
const stream = fs.createReadStream(`${file}/text.txt`, 'utf-8');
let data = '';
stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));
stream.on('error', error => console.log('Error', error.message));
*/