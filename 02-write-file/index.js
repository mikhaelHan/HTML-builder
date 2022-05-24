const { error } = require('console');
const fs = require('fs');
const path = require('path');
const { stdin, stdout, stderr } = process;
const file = path.dirname(__filename);


fs.writeFile(`${file}/text.txt`, '', (err) => {
  if (err) console.log(err);
  else {
    stdout.write('Please enter text...\n');
    stdin.on('data', data => {
      const info = data.toString().trim();
      if (info !== 'exit') {
        fs.appendFile(`${file}/text.txt`, `\n${info}`, (err) => {
          if (err) console.log(err);
        });
      }
      else {
        process.exit();
      }
    });
    process.on('exit', code => {
      if (code !== 0) stdout.write('Good bye!!!');
      else stderr.write('Good bye!!!')
    });
  }
});