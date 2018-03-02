module.exports = {
	PORT: 8005,

	VARIABLES: [
		"title",
		"createdAt",
		"content"
	],

	onCreate(self, id = 0) {},
	onSave (self, id = 0, path = "", article = {}) {},
	onPublish (self, id = 0, path = "", content = "") {},
	onDelete (self, id = 0) {}
}