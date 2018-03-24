const CONFIG = require("./../config");

module.exports = class MagicFormatter {
	constructor (id = 0, content = "") {
		this.id = id,
		this.content = content;
	}

	get formatted () {
		this.commonImage(),
		this.articleImage(),
		this.anchor();

		return this.content;
	}

	commonImage () {
		this.content = this.content.replace(/!\^\[(.*)\]\((.+)\)/g, `<Img Src = "/${CONFIG.PATH.COMMONMEDIA}/$2" Alt = "$1" />`);
	}

	articleImage () {
		this.content = this.content.replace(/!\[(.*)\]\((.+)\)/g, `<Img Src = "/${CONFIG.PATH.MEDIA}/${this.id}/$2" Alt = "$1" />`);
	}

	anchor () {
		this.content = this.content.replace(/\[(.*)\]\((.+)\)/g, '<A Href = "$2">$1</A>');
	}
}