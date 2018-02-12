const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const setting = require("./setting");



let app = express();
	app.use(bodyParser.json());

	app.get("/api/articles", (req, res) => {
		try {
			res.end(JSON.stringify({
				status: "success",
				amount: fs.readdirSync("articles").length
			}));
		} catch (error) {
			res.end(JSON.stringify({
				status: "fail",
				error
			}));
		}
	});

	app.post("/api/new", (req, res) => {
		let id = fs.readdirSync("articles").length + 1;

		try {
			fs.writeFileSync(
				`articles/${id}.json`,

				JSON.stringify({
					title: "",
					createdAt: "",
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
			path: `articles/${id}.json`
		}));
	});

	app.post("/api/publish", (req, res) => {
		let mixedContent = "";

		try {
			mixedContent = fs.readFileSync("template/index.html", "UTF-8");
			setting.VARIABLES.forEach(variable => mixedContent.replace(new RegExp(`\${${variable}}`, "g"), req.body[variable]));
		} catch (err) {
			res.end("Error: テンプレートHTML(template/index.html)が存在しません");
		}

		res.end(mixedContent);
	});

	app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/${req.url.replace(/%20/g, " ")}`));

	app.listen(setting.PORT, () => {
		console.log(`[Article Editor] I'm running on port ${setting.PORT}!!`);
	});