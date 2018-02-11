const express = require("express");
const bodyParser = require("body-parser");
const setting = require("./setting");



let app = express();
	app.use(bodyParser.json());
	
	app.listen(setting.PORT, () => {
		console.log(`[Article Editor] I'm running on port ${setting.PORT}!!`);
	});

	app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/${req.url.replace(/%20/g, " ")}`));

	app.post("/save", (req, res) => {
		console.log(req.body);

		res.end();
	});