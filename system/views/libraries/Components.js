class Components {
	static generateThumbnail (articleId = 0, src = "") {
		src = decodeURIComponent(src);

		return new DOM("Img", {
			classes: ["tooltipped", "z-depth-1"],
			attributes: { Src: `${CONFIG.PATH.MEDIA}/${articleId}/${src}` },

			dataset: {
				position: "bottom",
				delay: 50,
				tooltip: src
			},

			events: {
				dragstart (event) {
					console.log(event);

					let image = decodeURIComponent(event.dataTransfer.getData("text/uri-list")).replace(new RegExp(`(?:https?|ftp)://.+/${CONFIG.PATH.MEDIA}/\\d+/(.+)`), "![$1]($1)");
						event.dataTransfer.setData("text/plain", image);
				}
			}
		});
	}

	static generateCommonThumbnail (src = "") {
		src = decodeURIComponent(src);
		
		return new DOM("Img", {
			classes: ["tooltipped", "z-depth-1"],
			attributes: { Src: `${CONFIG.PATH.COMMONMEDIA}/${src}` },

			dataset: {
				position: "bottom",
				delay: 50,
				tooltip: src
			},

			events: {
				dragstart (event) {
					console.log(event);

					let image = decodeURIComponent(event.dataTransfer.getData("text/uri-list")).replace(new RegExp(`(?:https?|ftp)://.+/${CONFIG.PATH.COMMONMEDIA}/(.+)`), "!^[$1]($1)");
						event.dataTransfer.setData("text/plain", image);
				}
			}
		});
	}
}