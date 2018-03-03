const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const multer = require("multer");
const Util = require("./system/libraries/Util");
const API = require("./system/libraries/API");
const CONFIG = require("./system/config");

const self = { fs, express, bodyParser, methodOverride, Util, CONFIG };
const CommonUpload = multer({ dest: "./articles/images/" });



let app = express();
	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use("", express.static(`${__dirname}/system/views/Editor`));
	app.use("/libraries", express.static(`${__dirname}/system/views/libraries`));

	/**
	 * Returns the article's infomation
	 */
	app.get("/api/article", (req, res) => {
		try {
			res.end(JSON.stringify({
				status: "success",

				id: req.query.id,
				content: API.getArticle(req.query.id)
			}));
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}
	});

	/**
	 * Deletes the article
	 */
	app.delete("/api/article/:id", (req, res) => {
		let id = req.params.id;

		try {
			API.deleteArticle(id);
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}

		CONFIG.onDelete(self, id);

		res.end(JSON.stringify({
			status: "success",
			id
		}));
	});

	/**
	 * Returns a list of articles
	 */
	app.get("/api/articles", (req, res) => {
		try {
			let articles = API.getArticles();

			res.end(JSON.stringify({
				status: "success",
				articles
			}));
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}
	});

	/**
	 * Creates new files with a unused id
	 */
	app.post("/api/new", (req, res) => {
		let id = API.getNextArticleId();

		try {
			Util.writeFileWithDirSync(`articles/${id}/index.json`, JSON.stringify({
				title: "",
				createdAt: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
				content: ""
			}, null, "\t"));
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}

		CONFIG.onCreate(self, id);

		res.end(JSON.stringify({
			status: "success",
			id
		}));
	});

	/**
	 * Saves the article's draft
	 */
	app.post("/api/draft", (req, res) => {
		let { id, title, createdAt, content } = req.body;
		let path = `articles/${id}`;

		try {
			fs.writeFileSync(`${path}/index.json`, JSON.stringify({
				title,
				createdAt,
				content
			}, null, "\t"));
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}

		CONFIG.onSave(self, id, path, { title, createdAt, content });

		res.end(JSON.stringify({
			status: "success",

			id,
			path
		}));
	});

	/**
	 * Generates the article's page
	 */
	app.post("/api/publish", (req, res) => {
		let path = `publishes/${req.body.id}`;
		let article, content;

		try {
			article = JSON.parse(API.getArticle(req.body.id)),
			content = fs.readFileSync("template/index.html", "UTF-8");

			CONFIG.VARIABLES.forEach(variable => content = content.replace(new RegExp(`\\\${${variable}}`, "g"), article[variable]));

			if (fs.existsSync(path)) Util.removedirSync(path);
			
			Util.writeFileWithDirSync(`${path}/index.html`, content);
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}

		CONFIG.onPublish(self, req.body.id, path, content);

		res.end(JSON.stringify({
			status: "success",

			id: req.body.id,
			path,
			content
		}));
	});

	/**
	 * Copys the photo to the common directory
	 */
	app.post("/api/media", CommonUpload.array("photos"), (req, res, err) => {
		let commonMedias = API.getCommonMedias(),
			uploadedMedias = req.files;

		for (let i = 0; i < uploadedMedias.length; i++) {
			API.renameMedia(uploadedMedias[i]);
		}

		res.end();
	});

	/**
	 * Deletes the photo from the common directory
	 */
	app.delete("/api/media/:mediaId", (req, res) => {

	});

	app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/${req.url.replace(/%20/g, " ")}`));

	app.listen(CONFIG.PORT, () => {
		if (!fs.existsSync("articles")) fs.mkdir("articles");
		if (!fs.existsSync("publishes")) fs.mkdir("publishes");
		if (!fs.existsSync("template")) fs.mkdir("template");

		if (!fs.existsSync("template/index.html")) {
			fs.writeFile("template/index.html", [
				'<!DOCTYPE html>',
				'',
				'<html>',
				'	<head>',
				'		<meta charset="utf-8" />',
				'		<title>${title} in ${createdAt}</title>',
				'	</head>',
				'	',
				'	<body>',
				'		${content}',
				'	</body>',
				'</html>'
			].join("\r\n"));
		}

		console.log(`[Article Editor] I'm running on port ${CONFIG.PORT}!!`);
	});