const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const setting = require("./setting");



let app = express();
	app.use(bodyParser.json());

	app.get("/api/articles", (req, res) => {
		res.end(JSON.stringify({
			amount: fs.readdirSync("articles").length
		}));
	});

	app.post("/api/article", (req, res) => {
		let { title, createdAt, content } = req.body;

		let mixedContent = "";

		try {
			mixedContent = fs.readFileSync("template/index.html", "UTF-8").replace(/\${title}/g, title).replace(/\${createdAt}/g, createdAt).replace(/\${content}/g, content);
			console.log(mixedContent);
		} catch (err) {
			console.error("Error: テンプレートHTML(template/index.html)が存在しません");

			throw err;
		}

		res.end(mixedContent);
	});

	app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/${req.url.replace(/%20/g, " ")}`));

	app.listen(setting.PORT, () => {
		console.log(`[Article Editor] I'm running on port ${setting.PORT}!!`);
	});