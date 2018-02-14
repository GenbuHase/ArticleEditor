module.exports = {
	port: 8005,

	variables: [
		"title",
		"createdAt",
		"content"
	],

	onSave (id = 0, path = "", article = {}) {},
	onPublish (id = 0, path = "", content = "") {},
	onDelete (id = 0) {}
}