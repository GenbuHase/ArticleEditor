const fs = require("fs");

module.exports = {
	mkdirsSync (path = "") {
		let folders = path.split("/");
			folders.forEach((dirName, index) => {
				let dirPath = folders.slice(0, index + 1).join("/");

				if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
			});
	},

	writeFileWithDirSync (path = "", content) {
		this.mkdirsSync(path.split("/").slice(0, -1).join("/"));
		fs.writeFileSync(path, content);
	},

	copydirSync (path = "", dest = "") {
		this.mkdirsSync(dest);
		fs.readdirSync(path).forEach(file => fs.copyFileSync(`${path}/${file}`, `${dest}/${file}`));
	},

	removedirSync (path) {
		fs.readdirSync(path).forEach(file => fs.unlinkSync(`${path}/${file}`));
		fs.rmdirSync(path);
	}
}