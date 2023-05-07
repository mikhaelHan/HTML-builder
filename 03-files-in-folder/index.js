class FilesInfo {
  constructor () {

    this.fs = require('fs/promises');
    this.error = require('console');
    this.path = require('path');
    this.direct = this.path.join(__dirname, 'secret-folder');

  }

  async displayFiles() {
    const response = await this.fs.readdir(this.direct, { withFileTypes: true });

    for (let file of response) {
      if (file.isFile()) {

        const fileBox = (file.name).split('.');

        const data = await this.fs.stat(this.path.join(this.direct, file.name));

        const volume = Math.round((data.size / 1024) * 1000) / 1000;

        console.log(`${fileBox[0]} - ${fileBox[1]} - ${volume}kb`);
      }
    }
  }
}



try {

  const filesInfo = new FilesInfo();
  filesInfo.displayFiles();

} catch (err) {

  throw this.error;
}