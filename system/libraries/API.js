const fs = require("fs");
const Util = require("./Util");
const CONFIG = require("./../config");

module.exports = class API {
	static getArticle (id = 0) {
		return fs.readFileSync(`${CONFIG.PATH.ARTICLE}/${id}.json`, "UTF-8");
	}

	static getArticles () {
		return fs.readdirSync(CONFIG.PATH.ARTICLE);
	}

	static getNextArticleId () {
		let articles = this.getArticles();

		return parseInt(articles.length > 0 ? articles[articles.length - 1] : 0) + 1;
	}

	static createArticle (id = 0) {
		Util.writeFileWithDirSync(`${CONFIG.PATH.ARTICLE}/${id}.json`, JSON.stringify({
			title: "",
			createdAt: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
			content: ""
		}, null, "\t"));

		Util.mkdirsSync(`${CONFIG.PATH.MEDIA}/${id}`);
	}

	static saveArticle (id = 0, data = {}) {
		fs.writeFileSync(`${CONFIG.PATH.ARTICLE}/${id}.json`, JSON.stringify(data, null, "\t"));
	}

	static publishArticle (id = 0, content = "") {
		let publishPath = `${CONFIG.PATH.PUBLISH}/${id}`;

		if (fs.existsSync(publishPath)) Util.removedirSync(publishPath);
		Util.writeFileWithDirSync(`${publishPath}/index.html`, content);
	}

	static deleteArticle (id = 0) {
		fs.unlinkSync(`${CONFIG.PATH.ARTICLE}/${id}.json`);
		Util.removedirSync(`${CONFIG.PATH.MEDIA}/${id}`);
		if (fs.existsSync(`${CONFIG.PATH.PUBLISH}/${id}`)) Util.removedirSync(`${CONFIG.PATH.PUBLISH}/${id}`);
	}

	static getMedias (id = 0) {
		if (!fs.existsSync(`${CONFIG.PATH.MEDIA}/${id}`)) fs.mkdirSync(`${CONFIG.PATH.MEDIA}/${id}`);
		return fs.readdirSync(`${CONFIG.PATH.MEDIA}/${id}`);
	}

	static getCommonMedias () {
		return fs.readdirSync(CONFIG.PATH.COMMONMEDIA);
	}

	static uploadMedia (media) {
		let renamed = `${media.path.split("\\").slice(0, -1).join("/")}/${media.originalname}`;
		fs.rename(media.path, renamed, res => null);

		return renamed;
	}
}