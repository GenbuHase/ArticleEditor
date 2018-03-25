class IO {
	/**
	 * @param {Number} id An article's id
	 * @param {Function} [callback=function () {}] A callback, called when the process will have finished
	 */
	static getArticle (id, callback = function () {}) {
		DOM.xhr({
			type: "GET",
			url: `/api/article/${id}`,
			resType: "json",
			doesSync: true,

			onLoad: event => callback(event.target.response)
		});
	}

	/**
	 * @param {Function} [callback=function () {}] A callback, called when the process will have finished
	 */
	static createArticle (callback = function () {}) {
		DOM.xhr({
			type: "POST",
			url: "/api/new",

			headers: {
				"Content-Type": "application/json"
			},

			onLoad: event => callback(JSON.parse(event.target.response))
		});
	}

	/**
	 * @param {Number} id An article's id
	 * @param {Object} [articleData={}] A collection of article's datas
	 * @param {Function} [callback=function () {}] A callback, called when the process will have finished
	 */
	static saveArticle (id, articleData = {}, callback = function () {}) {
		DOM.xhr({
			type: "POST",
			url: `/api/article/${id}`,
			resType: "json",
			doesSync: true,

			headers: { "Content-Type": "application/json" },
			data: JSON.stringify(articleData),

			onLoad: event => callback(event.target.response)
		});
	}

	/**
	 * @param {Number} id An article's id
	 * @param {Function} [callback=function () {}] A callback, called when the process will have finished
	 */
	static deleteArticle (id, callback = function () {}) {
		DOM.xhr({
			type: "DELETE",
			url: `/api/article/${id}`,
			resType: "json",
			doesSync: true,

			onLoad: event => callback(event.target.response)
		});
	}

	/**
	 * @param {Number} id An article's id
	 * @param {Function} [callback=function () {}] A callback, called when the process will have finished
	 */
	static publishArticle (id, callback = function () {}) {
		DOM.xhr({
			type: "POST",
			url: `/api/publish/${id}`,
			resType: "json",
			doesSync: true,

			onLoad: event => callback(event.target.response)
		});
	}

	/**
	 * @param {Number} id An article's id
	 * @param {Function} [callback=function () {}] A callback, called when the process will have finished
	 */
	static getPreview (id, callback = function () {}) {

	}

	/**
	 * @param {Function} [callback=function () {}] A callback, called when the process will have finished
	 */
	static getArticles (callback = function () {}) {
		DOM.xhr({
			type: "GET",
			url: "/api/articles",
			resType: "json",
			doesSync: true,
	
			onLoad: event => callback(event.target.response)
		});
	}

	/**
	 * @param {Number} id An article's id
	 * @param {Function} [callback=function () {}] A callback, called when the process will have finished
	 */
	static getMedias (id, callback = function () {}) {
		DOM.xhr({
			type: "GET",
			url: `/api/medias/${id}`,
			resType: "json",
			doesSync: true,

			onLoad: event => callback(event.target.response)
		});
	}

	/**
	 * @param {Function} [callback=function () {}] A callback, called when the process will have finished
	 */
	static getCommonMedias (callback = function () {}) {
		DOM.xhr({
			type: "GET",
			url: `/api/medias`,
			resType: "json",
			doesSync: true,
	
			onLoad: event => callback(event.target.response)
		});
	}
}