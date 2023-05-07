class CreateCopy {
  constructor () {

    this.error = require('console');
    this.fs = require('fs/promises');
    this.path = require('path');

    this.direct = this.path.join(__dirname, 'files');
    this.copyDirect = this.path.join(__dirname, 'files-copy');

  }



  async createNewCatalog() {
    const find = await this.fs.readdir(__dirname, { recursive: true, force: true });

    const result = find.includes('files-copy');

    if (result) {
      const massOfFilesCopy = await this.fs.readdir('files-copy');

      for (let file of massOfFilesCopy) {
        this.fs.unlink(this.path.join(this.copyDirect, file));
      }

    } else {

      this.fs.mkdir(this.copyDirect, err => {
        if (err) throw this.error;

      });
    }
  }



  async createFiles() {
    await this.createNewCatalog();

    const massOfFiles = await this.fs.readdir(this.direct);

    for (let file of massOfFiles) {

      const oldFile = this.path.join(this.direct, file);

      const newFile = this.path.join(this.copyDirect, file);

      this.fs.copyFile(oldFile, newFile);

    }
  }
}



try {

  const createCopy = new CreateCopy();
  createCopy.createFiles();

} catch (err) {

  throw this.error;
}

