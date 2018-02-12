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
				content: fs.readFileSync(`articles/${req.query.id}.json`, "UTF-8")
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
			fs.unlinkSync(`articles/${id}.json`);

			if (fs.existsSync(`publishes/${id}.html`)) fs.unlinkSync(`publishes/${id}.html`);
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

	app.get("/api/articles", (req, res) => {
		try {
			let articles = fs.readdirSync("articles");
				articles.forEach((path, index) => articles[index] = path.replace(/.json$/, ""));

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
		let id = parseInt(articles[articles.length - 1].replace(/.json$/, "")) + 1;

		try {
			fs.writeFileSync(
				`articles/${id}.json`,

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

		try {
			fs.writeFileSync(
				`articles/${id}.json`,

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

		res.end(JSON.stringify({
			status: "success",

			id,
			path: `articles/${id}.json`
		}));
	});

	app.post("/api/publish", (req, res) => {
		let publishedPath = `publishes/${req.body.id}.html`;
		let article, content;

		try {
			article = JSON.parse(fs.readFileSync(`articles/${req.body.id}.json`, "UTF-8")),
			content = fs.readFileSync("template/index.html", "UTF-8");

			setting.VARIABLES.forEach(variable => content = content.replace(new RegExp(`\\\${${variable}}`, "g"), article[variable]));

			fs.writeFileSync(publishedPath, content);
		} catch (err) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}

		res.end(JSON.stringify({
			status: "success",

			id: req.body.id,
			path: publishedPath,
			content
		}));
	});

	app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/${req.url.replace(/%20/g, " ")}`));

	app.listen(setting.PORT, () => {
		if (!fs.existsSync("articles")) fs.mkdir("articles");
		if (!fs.existsSync("publishes")) fs.mkdir("publishes");
		if (!fs.existsSync("template")) fs.mkdir("template");

		console.log(`[Article Editor] I'm running on port ${setting.PORT}!!`);
	});