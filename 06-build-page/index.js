class Builder {
  constructor () {

    this.error = require('console');
    this.fs = require('fs');
    this.fsp = require('fs/promises');
    this.path = require('path');

  }


  async deleteFiles(way) {
    const find = await this.fsp.readdir(way, { recursive: true, force: true, withFileTypes: true });

    for (let file of find) {
      if (file.isFile()) {
        await this.fsp.unlink(this.path.join(way, file.name));
      }
      else {
        const nextWay = this.path.join(way, file.name);

        return this.deleteFiles(nextWay);
      }
    }
  }


  async checkProject() {
    const find = await this.fsp.readdir(__dirname, { recursive: true, force: true });
    if (find.includes('project-dist')) {
      await this.deleteFiles(this.path.join(__dirname, 'project-dist'));
    }
    else {
      await this.fsp.mkdir(this.path.join(__dirname, 'project-dist'));
      await this.fsp.mkdir(this.path.join(__dirname, 'project-dist', 'assets'));
      const assetsWay = this.path.join(__dirname, 'project-dist', 'assets');
      await this.fsp.mkdir(this.path.join(assetsWay, 'fonts'));
      await this.fsp.mkdir(this.path.join(assetsWay, 'img'));
      await this.fsp.mkdir(this.path.join(assetsWay, 'svg'));
    }
  }


  async createStyleFile() {
    await this.fsp.appendFile(this.path.join(__dirname, 'project-dist', 'style.css'), '', (err) => {
      if (err) throw this.error;
    });

    const writeStream = this.fs.createWriteStream(this.path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');

    const styleWay = this.path.join(__dirname, 'styles');

    const massOfStyles = await this.fsp.readdir(styleWay);

    for (let file of massOfStyles) {

      if (file.split('.')[1] === 'css') {
        const readStream = this.fs.createReadStream(this.path.join(styleWay, file), 'utf-8');

        readStream.on('data', chunk => writeStream.write(chunk));
      }
    }
  }


  async createHtmlFile() {
    let readFile = await this.fsp.readFile(this.path.join(__dirname, 'template.html'), 'utf-8');

    const stream = this.fs.createWriteStream(this.path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');

    const mass = await this.fsp.readdir(this.path.join(__dirname, 'components'), { withFileTypes: true });

    for (let file of mass) {
      const thisFile = file.name;

      if (file.isFile() && thisFile.split('.' === 'html')) {
        const readThisFile = await this.fsp.readFile(this.path.join(__dirname, 'components', thisFile), 'utf-8');

        const nameSample = thisFile.split('.')[0];

        const sample = `{{${nameSample}}}`;

        readFile = readFile.replace(sample, readThisFile);
      }
    }
    await this.fsp.copyFile(this.path.join(__dirname, 'template.html'), this.path.join(__dirname, 'project-dist', 'index.html'));
    stream.write(readFile);
  }


  async copyAssetsDirect() {
    const pushDir = this.path.join(__dirname, 'project-dist', 'assets');

    const readDir = this.path.join(__dirname, 'assets');

    const mass = await this.fsp.readdir(readDir);

    for (let catalog of mass) {
      const oldCatalog = this.path.join(readDir, catalog);
      const newCatalog = this.path.join(pushDir, catalog);

      const readOldCatalog = await this.fsp.readdir(oldCatalog);

      for (let file of readOldCatalog) {
        const oldFile = this.path.join(oldCatalog, file);
        const newFile = this.path.join(newCatalog, file);

        await this.fsp.copyFile(oldFile, newFile);
      }
    }
  }


  async createProject() {
    await this.checkProject();
    await this.createStyleFile();
    await this.copyAssetsDirect();
    await this.createHtmlFile();
  }

}


try {

  const builder = new Builder();
  builder.createProject();
}
catch (err) {

  throw this.error;
}
