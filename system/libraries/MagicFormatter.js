const CONFIG = require("./../config");

module.exports = class MagicFormatter {
	constructor (id = 0, content = "") {
		this.id = id,
		this.content = content;
	}

	get forPreview () {
		let formatted = this.hint.commonImageForPreview.articleImageForPreview.hintAnchor.blankAnchor.anchor;

		return formatted.content;
	}

	get forPublish () {
		let formatted = this.hint.commonImageForPublish.articleImageForPublish.hintAnchor.blankAnchor.anchor;

		return formatted.content;
	}


	//[:アンカー文字列](:リンク先URL)
	get anchor () {
		return new MagicFormatter(this.id, this.content.replace(/\[(.*)\]\((.+)\)/g, '<A Href = "$2">$1</A>'));
	}
	
	//:[:アンカー文字列](:リンク先URL)
	get blankAnchor () {
		return new MagicFormatter(this.id, this.content.replace(/:\[(.*)\]\((.+)\)/g, '<A Href = "$2" Target = "_blank">$1</A>'));
	}

	//![:Alt属性](:画像URL)
	get articleImageForPreview () {
		return new MagicFormatter(this.id, this.content.replace(/!\[(.*)\]\((.+)\)/g, `<Img Src = "/${CONFIG.PATH.MEDIA}/${this.id}/$2" Alt = "$1" />`));
	}

	get articleImageForPublish () {
		return new MagicFormatter(this.id, this.content.replace(/!\[(.*)\]\((.+)\)/g, '<Img Src = "$2" Alt = "$1" />'));
	}

	//!^[:Alt属性](:画像URL)
	get commonImageForPreview () {
		return new MagicFormatter(this.id, this.content.replace(/!\^\[(.*)\]\((.+)\)/g, `<Img Src = "/${CONFIG.PATH.COMMONMEDIA}/$2" Alt = "$1" />`));
	}

	get commonImageForPublish () {
		return new MagicFormatter(this.id, this.content.replace(/!\^\[(.*)\]\((.+)\)/g, '<Img Src = "../common/$2" Alt = "$1" />'));
	}

	//@[:注釈アンカー文字列](:注釈ラベル名)
	get hintAnchor () {
		return new MagicFormatter(this.id, this.content.replace(/@\[(.+)\]\((.+)\)/g, '$1<A Href = "#$2"><Sup>[$2]</Sup></A>'));
	}

	/*
	 * @:注釈ラベル名
	 * :内容
	 * @@
	 */
	get hint () {
		return new MagicFormatter(this.id, this.content.replace(/@([^\[\](?:\r?\n)]+)\r?\n([^]+)@@/g, [ '<Span ID = "$1">[$1]</Span>', '$2' ].join("\n")));
	}
}