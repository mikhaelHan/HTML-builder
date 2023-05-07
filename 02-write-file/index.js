const { error } = require('console');
const fs = require('fs');
const path = require('path');
const { stdin, stdout, } = process;

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  (err) => {
    if (err) throw error;

    stdout.write('Please enter text... \n');

    stdin.on('data', data => {
      const info = data.toString().trim();

      if (info !== 'exit') {
        fs.appendFile(
          path.join(__dirname, 'text.txt'),
          info + '\n',
          err => { if (err) throw error; }
        );
      } else {
        stdout.write('Good bye!!!');
        process.exit();
      }
    });

    process.on(('SIGINT'), () => {
      stdout.write('Good bye!!!');
      process.exit();
    });
  }
);