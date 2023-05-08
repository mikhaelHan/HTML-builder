class ConsoleInfo {
  constructor () {

    this.fs = require('fs');
    this.path = require('path');
    this.error = require('console');

    this.file = this.path.join(__dirname, 'text.txt');
    this.stream = this.fs.createReadStream(this.file, 'utf-8');

  }

  write() {

    let data = '';

    this.stream.on('data', chunk => data += chunk);
    this.stream.on('end', () => console.log(data));
    this.stream.on('error', error => console.log('Error', error.message));
  }
}


try {

  const consoleInfo = new ConsoleInfo();
  consoleInfo.write();

} catch (err) {

  throw this.error;
}

