const fs = require("fs");
const extendedFs = require("./system/libraries/extendedFs");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const multer = require("multer");
const CONFIG = require("./system/config");
const API = require("./system/libraries/API");
const MagicFormatter = require("./system/libraries/MagicFormatter");

const self = { fs, express, bodyParser, methodOverride, extendedFs, CONFIG };

const CommonUpload = multer({ dest: `./${CONFIG.PATH.COMMONMEDIA}/` });



let app = express();
	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use("", express.static(`${__dirname}/system/views/Editor`));
	app.use("/config.js", express.static(`${__dirname}/system/config.js`));
	app.use("/libraries", express.static(`${__dirname}/system/views/libraries`));
	app.use(express.static(`${__dirname}/${CONFIG.PATH.TEMPLATE}`));

	/**
	 * Returns the article's infomation
	 * 
	 * <URL Params>
	 * :id ... An article's id
	 * 
	 * 
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   
	 *   id ... An article's id
	 *   content ... An article's content
	 * }
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
	 * Creates new files with a unused id
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   id ... A new article's id
	 * }
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
	 * Saves the article
	 * 
	 * <URL Params>
	 * :id ... An article's id
	 * 
	 * <Payload>
	 * {
	 *   title ... An article's title
	 *   createdAt ... A date of an article created
	 *   content ... An article's content
	 * }
	 * 
	 * 
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   
	 *   id ... An article's id
	 *   path ... An article's path
	 * }
	 */
	app.post("/api/article/:id", (req, res) => {
		let id = req.params.id,
			data = req.body;

		try {
			let path = API.saveArticle(id, req.body).path;

			CONFIG.onSave(self, id, path, data);

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
	 * 
	 * <URL Params>
	 * :id ... An article's id
	 * 
	 * 
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   id ... An article's id
	 * }
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
	 * Generates the article's page
	 * 
	 * <URL Params>
	 * :id ... An article's id
	 * 
	 * 
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   
	 *   id ... A generated page's id
	 *   path ... A generated page's path
	 *   content ... A generated page's content
	 * }
	 */
	app.post("/api/publish/:id", (req, res) => {
		let id = req.params.id;

		try {
			let { path, content } = API.publishArticle(id);

			CONFIG.onPublish(self, id, path, content);

			res.end(JSON.stringify({
				status: "success",

				id,
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
	 * Returns an article's preview
	 * 
	 * <URL Params>
	 * :id ... An article's id
	 * 
	 * 
	 * 
	 * [Result]
	 * An article's preview
	 */
	app.get("/api/preview/:id", (req, res) => {
		let id = req.params.id;

		try {
			let formatter = new MagicFormatter(id, API.getPreview(id));

			res.end(formatter.forPreview);
		} catch (error) {
			res.status(500).end(JSON.stringify({
				status: "failure",
				error
			}));
		}
	});

	/**
	 * Returns a list of articles
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   articles ... A collection of articles
	 * }
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
	 * Uploads selected medias to common directory
	 * 
	 * <Payload>
	 * A multipart data
	 * 
	 * 
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   mediaPath ... A collection of medias' path
	 * }
	 */
	app.post("/api/media", CommonUpload.array("medias"), (req, res) => {
		let medias = req.files,
			mediaPath = [];

		try {
			for (let i = 0; i < medias.length; i++) {
				let media = medias[i],
					path = API.uploadMedia(media);

				mediaPath.push(path);
				CONFIG.onCommonMediaUpload(self, path, media.originalname);
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
	 * 
	 * <URL Params>
	 * :id ... An article's id
	 * 
	 * <Payload>
	 * A multipart data
	 * 
	 * 
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   mediaPath ... A collection of medias' path
	 * }
	 */
	app.post("/api/media/:id", (req, res) => {
		let id = req.params.id;

		multer({ dest: `./${CONFIG.PATH.MEDIA}/${id}/` }).array("medias")(req, res, err => {
			if (err) {
				res.status(500).end(JSON.stringify({
					status: "failure",
					error: err
				}));
			} else {
				let medias = req.files,
					mediaPath = [];

				try {
					for (let i = 0; i < medias.length; i++) {
						let media = medias[i],
							path = API.uploadMedia(media);

						mediaPath.push(path);
						CONFIG.onMediaUpload(self, id, path, media.originalname);
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
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   medias ... A collection of common medias
	 * }
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
	 * 
	 * <URL Params>
	 * :id ... An article's id
	 * 
	 * 
	 * 
	 * [Result]
	 * {
	 *   status ... "success" or "failure"
	 *   medias ... A collection of article's medias
	 * }
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

	app.get(/.*/, (req, res) => {
		res.sendFile(`${__dirname}/${decodeURIComponent(req.url)}`);
	});

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
				'		<title>${title} at ${createdAt}</title>',
				'	</head>',
				'	',
				'	<body>',
				'		${content}',
				'	</body>',
				'</html>'
			].join("\r\n"), err => null);
		}

		console.log(`[Article Editor] I'm running on port ${CONFIG.PORT}!!`);
	});