const CONFIG = require("./../config");

module.exports = class MagicFormatter {
	constructor (id = 0, content = "") {
		this.id = id,
		this.content = content;
	}

	get forPreview () {
		let formatted = this.hint.commonImageForPreview.articleImageForPreview.hintAnchor.blankAnchor.anchor.emphasis.italic.strikeThrough;

		return formatted.content;
	}

	get forPublish () {
		let formatted = this.hint.commonImageForPublish.articleImageForPublish.hintAnchor.blankAnchor.anchor.emphasis.italic.strikeThrough;

		return formatted.content;
	}



	//*:強調文字列*
	get emphasis () {
		return new MagicFormatter(this.id, this.content.replace(/\*((?:\S|[ \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff](?!\*))+)\*(?!(?:\S))/g, '<B>$1</B>'));
	}

	//_:斜体文字列_
	get italic () {
		return new MagicFormatter(this.id, this.content.replace(/_((?:\S|[ \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff](?!_))+)_(?!(?:\S))/g, '<I>$1</I>'));
	}

	//-:打ち消し文字列-
	get strikeThrough () {
		return new MagicFormatter(this.id, this.content.replace(/-((?:\S|[ \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff](?!-))+)-(?!(?:\S))/g, '<S>$1</S>'));
	}

	//[:アンカー文字列](:リンク先URL)
	get anchor () {
		return new MagicFormatter(this.id, this.content.replace(/\[([^\]]*)\]\(([^\)]+)\)/g, '<A Href = "$2">$1</A>'));
	}
	
	//:[:アンカー文字列](:リンク先URL)
	get blankAnchor () {
		return new MagicFormatter(this.id, this.content.replace(/:\[([^\]]*)\]\(([^\)]+)\)/g, '<A Href = "$2" Target = "_blank">$1</A>'));
	}

	//![:Alt属性](:画像URL)
	get articleImageForPreview () {
		return new MagicFormatter(this.id, this.content.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, `<Img Src = "/${CONFIG.PATH.MEDIA}/${this.id}/$2" Alt = "$1" />`));
	}

	get articleImageForPublish () {
		return new MagicFormatter(this.id, this.content.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<Img Src = "$2" Alt = "$1" />'));
	}

	//!^[:Alt属性](:画像URL)
	get commonImageForPreview () {
		return new MagicFormatter(this.id, this.content.replace(/!\^\[([^\]]*)\]\(([^\)]+)\)/g, `<Img Src = "/${CONFIG.PATH.COMMONMEDIA}/$2" Alt = "$1" />`));
	}

	get commonImageForPublish () {
		return new MagicFormatter(this.id, this.content.replace(/!\^\[([^\]]*)\]\(([^\)]+)\)/g, '<Img Src = "../common/$2" Alt = "$1" />'));
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
		return new MagicFormatter(this.id, this.content.replace(/@([^\[\](?:\r?\n)]+)\r?\n([^]+)\r?\n@@/g, [ '<Span ID = "$1">[$1]</Span>', '$2' ].join("\n")));
	}
}