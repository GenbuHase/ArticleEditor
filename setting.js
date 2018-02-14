module.exports = {
	port: 8005,
	publishPath: "",

	variables: [
		"title",
		"createdAt",
		"content"
	],

	onCreate(self, id = 0, article = {}) {},
	onSave (self, id = 0, path = "", article = {}) {},
	onPublish (self, id = 0, path = "", content = "") {},
	onDelete (self, id = 0) {}
}