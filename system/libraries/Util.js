const fs = require("fs");

module.exports = class Util {
	static mkdirsSync (path = "") {
		let folders = path.split("/");
			folders.forEach((dirName, index) => {
				let dirPath = folders.slice(0, index + 1).join("/");

				if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
			});
	}

	static writeFileWithDirSync (path = "", content) {
		this.mkdirsSync(path.split("/").slice(0, -1).join("/"));
		fs.writeFileSync(path, content);
	}

	static copydirSync (path = "", dest = "") {
		this.mkdirsSync(dest);
		fs.readdirSync(path).forEach(file => fs.copyFileSync(`${path}/${file}`, `${dest}/${file}`));
	}

	static removedirSync (path) {
		fs.readdirSync(path).forEach(file => fs.unlinkSync(`${path}/${file}`));
		fs.rmdirSync(path);
	}
}