module.exports = {
	port: 8005,

	variables: [
		"title",
		"createdAt",
		"content"
	],

	onSave (self, id = 0, path = "", article = {}) {},
	onPublish (self, id = 0, path = "", content = "") {},
	onDelete (self, id = 0) {}
}