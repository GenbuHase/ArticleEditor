const CONFIG = require("./../config");

module.exports = class MagicFormatter {
	constructor (id = 0, content = "") {
		this.id = id,
		this.content = content;
	}

	get forPreview () {
		let formatted = this.hint().commonImageForPreview().articleImageForPreview().hintAnchor().blankAnchor().anchor().emphasis().italic().strikeThrough();

		return formatted.content;
	}

	get forPublish () {
		let formatted = this.hint().commonImageForPublish().articleImageForPublish().hintAnchor().blankAnchor().anchor().emphasis().italic().strikeThrough();

		return formatted.content;
	}



	//*:強調文字列*
	emphasis () {
		return new MagicFormatter(this.id, this.content.replace(/\*((?:\S|[ \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff](?!\*))+)\*(?!\S)/g, '<B>$1</B>'));
	}

	//_:斜体文字列_
	italic () {
		return new MagicFormatter(this.id, this.content.replace(/_((?:\S|[ \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff](?!_))+)_(?!\S)/g, '<I>$1</I>'));
	}

	//-:打ち消し文字列-
	strikeThrough () {
		return new MagicFormatter(this.id, this.content.replace(/-((?:\S|[ \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff](?!-))+)-(?!\S)/g, '<S>$1</S>'));
	}

	//[:アンカー文字列](:リンク先URL)
	anchor () {
		return new MagicFormatter(this.id, this.content.replace(/\[([^\]]*)\]\(([^\)]+)\)/g, '<A Href = "$2">$1</A>'));
	}
	
	//:[:アンカー文字列](:リンク先URL)
	blankAnchor () {
		return new MagicFormatter(this.id, this.content.replace(/:\[([^\]]*)\]\(([^\)]+)\)/g, '<A Href = "$2" Target = "_blank">$1</A>'));
	}

	//![:Alt属性](:画像URL)
	articleImageForPreview () {
		return new MagicFormatter(this.id, this.content.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, `<Img Src = "/${CONFIG.PATH.MEDIA}/${this.id}/$2" Alt = "$1" />`));
	}

	articleImageForPublish () {
		return new MagicFormatter(this.id, this.content.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<Img Src = "$2" Alt = "$1" />'));
	}

	//!^[:Alt属性](:画像URL)
	commonImageForPreview () {
		return new MagicFormatter(this.id, this.content.replace(/!\^\[([^\]]*)\]\(([^\)]+)\)/g, `<Img Src = "/${CONFIG.PATH.COMMONMEDIA}/$2" Alt = "$1" />`));
	}

	commonImageForPublish () {
		return new MagicFormatter(this.id, this.content.replace(/!\^\[([^\]]*)\]\(([^\)]+)\)/g, '<Img Src = "../common/$2" Alt = "$1" />'));
	}

	//@[:注釈アンカー文字列](:注釈ラベル1)(:注釈ラベル2)...(:注釈ラベルn)
	hintAnchor () {
		//注釈あり<A Href = "#ABC"><Sup>[ABC]</Sup></A>~
		let formatted = this.content;

		const MATCHER_HINT_ANCHOR = /@\[(\S+)\]\((\S+)\)/g;
		let hintAnchors = [],
			mHintAnchor;
			
		while ((mHintAnchor = MATCHER_HINT_ANCHOR.exec(this.content)) != null) {
			hintAnchors.push(mHintAnchor);
		}
		
		const MATCHER_HINT = /\|?([^|]+)/y;
		for (let i in hintAnchors) {
			let hintAnchor = hintAnchors[i],
				formattedHintAnchor = hintAnchor[1],
				hints = hintAnchor[2];

			let mHint;

			while ((mHint = MATCHER_HINT.exec(hints)) != null) {
				formattedHintAnchor += `<A Href = "#${mHint[1]}"><Sup>[${mHint[1]}]</Sup></A>`;
			}
			
			formatted = formatted.replace(hintAnchor[0], formattedHintAnchor);
		}

		return new MagicFormatter(this.id, formatted);
	}

	/*
	 * @:注釈ラベル名
	 * :内容
	 * @@
	 */
	hint () {
		return new MagicFormatter(this.id, this.content.replace(/^@([^[\]\r\n]+)\r?\n((?:.|\r?\n(?!@@))*)\r?\n@@$/gm, [ '<Span ID = "$1">[$1]</Span>', '$2' ].join("\n")));
	}
}