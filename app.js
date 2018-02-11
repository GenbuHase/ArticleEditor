const express = require("express");
const setting = require("./setting");



let app = express();
	app.listen(setting.PORT, () => {
		console.log(`[Article Editor] I'm running on port ${setting.PORT}!!`);
	});

	app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/${req.url.replace(/%20/g, " ")}`));