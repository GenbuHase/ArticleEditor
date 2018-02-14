const fs = require("fs");

module.exports = {
	writeFileWithDirSync (path = "", content) {
		let folders = path.split("/").slice(0, -1);
			folders.forEach((dirName, index) => {
				let dirPath = folders.slice(0, index + 1).join("/");

				if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
			});

		fs.writeFileSync(path, content);
	},

	removedirSync (path) {
		fs.readdirSync(path).forEach(file => fs.unlinkSync(`${path}/${file}`));
		fs.rmdirSync(path);
	}
}