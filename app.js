const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const multer = require("multer");
const Util = require("./system/libraries/Util");
const API = require("./system/libraries/API");
const CONFIG = require("./system/config");

const self = { fs, express, bodyParser, methodOverride, Util, CONFIG };

const CommonUpload = multer({ dest: `./${CONFIG.PATH.COMMONMEDIA}/` });



let app = express();
	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use("", express.static(`${__dirname}/system/views/Editor`));
	app.use("/config.js", express.static(`${__dirname}/system/config.js`));
	app.use("/libraries", express.static(`${__dirname}/system/views/libraries`));

	/**
	 * Returns the article's infomation
	 */
	app.get("/api/article/:id", (req, res) => {
		let id = req.params.id;

		try {
			res.end(JSON.stringify({
				status: "success",

				id,
				content: API.getArticle(id)
			}));
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
				error
			}));
		}
	});

	/**
	 * Saves the article
	 */
	app.post("/api/article/:id", (req, res) => {
		let id = req.params.id;
		let { title, createdAt, content } = req.body;

		let path = `${CONFIG.PATH.ARTICLE}/${id}.json`;

		try {
			API.saveArticle(id, { title, createdAt, content });
			CONFIG.onSave(self, id, path, { title, createdAt, content });

			res.end(JSON.stringify({
				status: "success",

				id,
				path
			}));
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
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
			CONFIG.onDelete(self, id);
			
			res.end(JSON.stringify({
				status: "success",
				id
			}));
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
				error
			}));
		}
	});

	/**
	 * Returns a list of articles
	 */
	app.get("/api/articles", (req, res) => {
		try {
			res.end(JSON.stringify({
				status: "success",
				articles: API.getArticles()
			}));
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
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
			API.createArticle(id);
			CONFIG.onCreate(self, id);

			res.end(JSON.stringify({
				status: "success",
				id
			}));
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
				error
			}));
		}
	});

	/**
	 * Generates the article's page
	 */
	app.post("/api/publish/:id", (req, res) => {
		let id = req.params.id,
			path = `${CONFIG.PATH.PUBLISH}/${id}`;

		try {
			let article = JSON.parse(API.getArticle(req.body.id)),
				content = fs.readFileSync(`${CONFIG.PATH.TEMPLATE}/index.html`, "UTF-8");

			CONFIG.VARIABLES.forEach(variable => content = content.replace(new RegExp(`\\\${${variable}}`, "g"), article[variable]));

			API.publishArticle(id, content);
			CONFIG.onPublish(self, id, path, content);

			res.end(JSON.stringify({
				status: "success",

				id: req.body.id,
				path,
				content
			}));
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
				error
			}));
		}
	});

	/**
	 * Uploads selected medias to common directory
	 */
	app.post("/api/media", CommonUpload.array("medias"), (req, res) => {
		let medias = req.files,
			mediaPath = medias.length > 1 ? [] : "";

		try {
			for (let i = 0; i < medias.length; i++) {
				let fixedPath = API.uploadMedia(medias[i]);
				Array.isArray(mediaPath) ? mediaPath.push(fixedPath) : mediaPath = fixedPath;
			}

			res.end(JSON.stringify({
				status: "success",
				mediaPath
			}));
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
				error
			}));
		}
	});

	/**
	 * Uploads selected medias to article's directory
	 */
	app.post("/api/media/:id", (req, res) => {
		multer({ dest: `./${CONFIG.PATH.MEDIA}/${req.params.id}/` }).array("medias")(req, res, err => {
			if (err) {
				res.status(500).end(JSON.stringify({
					status: "failure",
					error: err
				}));
			} else {
				let medias = req.files,
					mediaPath = medias.length > 1 ? [] : "";

				try {
					for (let i = 0; i < medias.length; i++) {
						let fixedPath = API.uploadMedia(medias[i]);
						Array.isArray(mediaPath) ? mediaPath.push(fixedPath) : mediaPath = fixedPath;
					}

					res.end(JSON.stringify({
						status: "success",
						mediaPath
					}));
				} catch (error) {
					res.status(500).end(JSON.stringify({
						status: "failure",
						error
					}));
				}
			}
		});
	});

	/**
	 * Gets a list of common medias
	 */
	app.get("/api/medias", (req, res) => {
		try {
			res.end(JSON.stringify({
				status: "success",
				medias: API.getCommonMedias()
			}));
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
				error
			}));
		}
	});

	/**
	 * Gets a list of article's medias
	 */
	app.get("/api/medias/:id", (req, res) => {
		let id = req.params.id;

		try {
			res.end(JSON.stringify({
				status: "success",
				medias: API.getMedias(id)
			}));
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
				error
			}));
		}
	});

	app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/${decodeURIComponent(req.url)}`));

	app.listen(CONFIG.PORT, () => {
		if (!fs.existsSync(CONFIG.PATH.ARTICLE)) fs.mkdir(CONFIG.PATH.ARTICLE);
		if (!fs.existsSync(CONFIG.PATH.PUBLISH)) fs.mkdir(CONFIG.PATH.PUBLISH);
		if (!fs.existsSync(CONFIG.PATH.MEDIA)) fs.mkdir(CONFIG.PATH.MEDIA);
		if (!fs.existsSync(CONFIG.PATH.COMMONMEDIA)) fs.mkdir(CONFIG.PATH.COMMONMEDIA);
		if (!fs.existsSync(CONFIG.PATH.TEMPLATE)) fs.mkdir(CONFIG.PATH.TEMPLATE);

		if (!fs.existsSync(`${CONFIG.PATH.TEMPLATE}/index.html`)) {
			fs.writeFile(`${CONFIG.PATH.TEMPLATE}/index.html`, [
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