const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const setting = require("./setting");



let app = express();
	app.use(bodyParser.json());
	app.use(methodOverride());

	app.get("/api/article", (req, res) => {
		try {
			res.end(JSON.stringify({
				status: "success",

				id: req.query.id,
				content: fs.readFileSync(`articles/${req.query.id}/index.json`, "UTF-8")
			}));
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}
	});

	app.delete("/api/article", (req, res) => {
		let id = req.query.id;

		try {
			fs.readdirSync(`articles/${id}`).forEach(file => fs.unlinkSync(`articles/${id}/${file}`));
			fs.rmdirSync(`articles/${id}`);

			if (fs.existsSync(`publishes/${id}`)) {
				fs.readdirSync(`publishes/${id}`).forEach(file => fs.unlinkSync(`publishes/${id}/${file}`));
				fs.rmdirSync(`publishes/${id}`);
			}
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}

		setting.onDelete(id);

		res.end(JSON.stringify({
			status: "success",
			id
		}));
	});

	app.get("/api/articles", (req, res) => {
		try {
			let articles = fs.readdirSync("articles");

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

	app.post("/api/new", (req, res) => {
		let articles = fs.readdirSync("articles");
		let id = parseInt(articles.length > 0 ? articles[articles.length - 1] : 0) + 1;

		try {
			fs.mkdirSync(`articles/${id}`);
			fs.writeFileSync(
				`articles/${id}/index.json`,

				JSON.stringify({
					title: "",
					createdAt: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
					content: ""
				}, null, "\t")
			);
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}

		res.end(JSON.stringify({
			status: "success",
			id
		}));
	});

	app.post("/api/draft", (req, res) => {
		let { id, title, createdAt, content } = req.body;
		let path = `articles/${id}/index.json`;

		try {
			fs.writeFileSync(
				path,
				
				JSON.stringify({
					title,
					createdAt,
					content
				}, null, "\t")
			);
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}

		setting.onSave(id, path, { title, createdAt, content });

		res.end(JSON.stringify({
			status: "success",

			id,
			path: `articles/${id}/index.json`
		}));
	});

	app.post("/api/publish", (req, res) => {
		let path = `publishes/${req.body.id}`;
		let article, content;

		try {
			article = JSON.parse(fs.readFileSync(`articles/${req.body.id}/index.json`, "UTF-8")),
			content = fs.readFileSync("template/index.html", "UTF-8");

			setting.variables.forEach(variable => content = content.replace(new RegExp(`\\\${${variable}}`, "g"), article[variable]));

			fs.mkdirSync(path);
			fs.writeFileSync(`${path}/index.html`, content);
		} catch (err) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}

		setting.onPublish(req.body.id, path, content);

		res.end(JSON.stringify({
			status: "success",

			id: req.body.id,
			path,
			content
		}));
	});

	app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/${req.url.replace(/%20/g, " ")}`));

	app.listen(setting.port, () => {
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

		console.log(`[Article Editor] I'm running on port ${setting.port}!!`);
	});