class CreateStyles {
  constructor () {

    this.error = require('console');
    this.fs = require('fs');
    this.fsp = require('fs/promises');
    this.path = require('path');

    this.direct = this.path.join(__dirname, 'styles');
    this.newDirect = this.path.join(__dirname, 'project-dist');

  }



  async checkFiles() {
    const find = await this.fsp.readdir(this.newDirect, { recursive: true, force: true });

    const result = find.includes('bundle.css');

    if (result) {
      await this.fsp.unlink(this.path.join(this.newDirect, 'bundle.css'));

      await this.fsp.appendFile(this.path.join(this.newDirect, 'bundle.css'), '', (err) => {

        if (err) throw this.error;

      });
    } else await this.fsp.appendFile(this.path.join(this.newDirect, 'bundle.css'), '', (err) => {

      if (err) throw this.error;
    });
  }



  async writeFiles() {
    await this.checkFiles();

    const writeStream = this.fs.createWriteStream(this.path.join(this.newDirect, 'bundle.css'), 'utf-8');

    const massOfStyles = await this.fsp.readdir(this.direct);

    for (let file of massOfStyles) {
      if (file.split('.')[1] === 'css') {
        const readStream = this.fs.createReadStream(this.path.join(this.direct, file), 'utf-8');

        readStream.on('data', chunk => writeStream.write(chunk));
      }
    }
  }
}



try {

  const createStyles = new CreateStyles();
  createStyles.writeFiles();

} catch (err) {

  throw this.error;
}
