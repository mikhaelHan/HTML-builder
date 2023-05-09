class CreateCopy {
  constructor () {

    this.error = require('console');
    this.fs = require('fs/promises');
    this.path = require('path');

  }



  async createNewCatalog() {
    const find = await this.fs.readdir(__dirname, { recursive: true, force: true });

    const result = find.includes('files-copy');

    if (result) {
      const massOfFilesCopy = await this.fs.readdir(this.path.join(__dirname, 'files-copy'));

      for (let file of massOfFilesCopy) {
        this.fs.unlink(this.path.join(__dirname, 'files-copy', file));
      }
    }

    else {
      this.fs.mkdir(this.path.join(__dirname, 'files-copy'), err => {
        if (err) throw this.error;

      });
    }
  }



  async createFiles() {
    await this.createNewCatalog();

    const massOfFiles = await this.fs.readdir(this.path.join(__dirname, 'files'));

    for (let file of massOfFiles) {

      const oldFile = this.path.join(__dirname, 'files', file);

      const newFile = this.path.join(__dirname, 'files-copy', file);

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

