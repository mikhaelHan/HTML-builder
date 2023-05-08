const { stdin, stdout, } = process;

class ConsoleWrite {
  constructor () {

    this.error = require('console');
    this.fs = require('fs');
    this.path = require('path');

  }


  writeInfo() {
    this.fs.writeFile(
      this.path.join(__dirname, 'text.txt'),
      '',
      (err) => {
        if (err) throw this.error;

        stdout.write('Please enter text... \n');

        stdin.on('data', data => {
          const info = data.toString().trim();

          if (info !== 'exit') {
            this.fs.appendFile(
              this.path.join(__dirname, 'text.txt'),
              info + '\n',
              err => { if (err) throw this.error; }
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
  }
}


try {

  const consoleWrite = new ConsoleWrite();
  consoleWrite.writeInfo();

} catch (err) {

  throw this.error;
}
