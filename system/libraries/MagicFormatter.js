const CONFIG = require("./../config");

module.exports = class MagicFormatter {
	constructor (id = 0, content = "") {
		this.id = id,
		this.content = content;
	}

	get forPreview () {
		let formatted = this.commonImageForPreview.articleImageForPreview.anchor;

		return formatted.content;
	}

	get forPublish () {
		let formatted = this.commonImageForPublish.articleImageForPublish.anchor;
		
		return formatted.content;
	}


	//[:アンカー文字列](:リンク先URL)
	get anchor () {
		return new MagicFormatter(this.id, this.content.replace(/\[(.*)\]\((.+)\)/g, '<A Href = "$2">$1</A>'));
	}

	//![:Alt属性](:画像URL)
	get articleImageForPreview () {
		return new MagicFormatter(this.id, this.content.replace(/!\[(.*)\]\((.+)\)/g, `<Img Src = "/${CONFIG.PATH.MEDIA}/${this.id}/$2" Alt = "$1" />`));
	}

	get articleImageForPublish () {
		return new MagicFormatter(this.id, this.content.replace(/!\[(.*)\]\((.+)\)/g, `<Img Src = "$2" Alt = "$1" />`));
	}

	//!^[:Alt属性](:画像URL)
	get commonImageForPreview () {
		return new MagicFormatter(this.id, this.content.replace(/!\^\[(.*)\]\((.+)\)/g, `<Img Src = "/${CONFIG.PATH.COMMONMEDIA}/$2" Alt = "$1" />`));
	}

	get commonImageForPublish () {
		return new MagicFormatter(this.id, this.content.replace(/!\^\[(.*)\]\((.+)\)/g, `<Img Src = "../common/$2" Alt = "$1" />`));
	}
}