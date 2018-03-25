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

	onCreate(self, id = 0) {},
	onDelete (self, id = 0) {},
	onSave (self, id = 0, path = "", article = {}) {},
	onPublish (self, id = 0, path = "", content = "") {},
	onCommonMediaUpload (self, path = "", filename = "") {},
	onMediaUpload (self, id = 0, path = "", filename = "") {}
}