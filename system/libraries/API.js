const fs = require("fs");
const Util = require("./Util");

module.exports = class API {
	static getArticles () {
		return fs.readdirSync("articles").filter(article => article != "images");
	}

	static getArticle (id = 0) {
		return fs.readFileSync(`articles/${id}/index.json`, "UTF-8");
	}

	static getNextArticleId () {
		let articles = this.getArticles();

		return parseInt(articles.length > 0 ? articles[articles.length - 1] : 0) + 1;
	}

	static deleteArticle (id = 0) {
		Util.removedirSync(`articles/${id}`);
		if (fs.existsSync(`publishes/${id}`)) Util.removedirSync(`publishes/${id}`);
	}

	static getCommonMedias () {
		return fs.readdirSync("articles/images");
	}

	static renameMedia (media) {
		fs.rename(media.path, `${media.path}.${media.originalname.split(".").splice(-1)}`, error => null);
	}
}