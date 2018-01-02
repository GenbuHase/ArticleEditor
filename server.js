"use strict";
const express = require("express");



let app = express();
	app.listen(process.env.PORT, () => {
		console.log(`[Article Editor] I'm running on port ${process.env.PORT}!!`);
	});

	app.get(/(.*)/, (req, res) => res.sendFile(`${__dirname}/${req.url.replace(/%20/g, " ")}`));