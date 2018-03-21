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
			}
		});
	}
}