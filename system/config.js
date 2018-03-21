if (!this.module && this.window) {
	module = {};
	window.addEventListener("DOMContentLoaded", () => CONFIG = module.exports);
}

module.exports = {
	PORT: 8005,

	PATH: {
		ARTICLE: "articles",
		PUBLISH: "publishes",
		MEDIA: "medias",
		COMMONMEDIA: "medias/common",
		TEMPLATE: "template"
	},

	VARIABLES: [
		"title",
		"createdAt",
		"content"
	],

	onCreate(self, id = 0) {},
	onDelete (self, id = 0) {},
	onSave (self, id = 0, path = "", article = {}) {},
	onPublish (self, id = 0, path = "", content = "") {},
	onUpload (self, id = 0, path = "") {}
}