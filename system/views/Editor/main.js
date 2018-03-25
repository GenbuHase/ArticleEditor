window.addEventListener("DOMContentLoaded", () => {
	const articleId = document.getElementById("Editor-Info-ArticleID");
	const articleTitle = document.getElementById("Editor-Info-Title");
	const articleCreatedAt = document.getElementById("Editor-Info-CreatedAt");
	const articleContent = document.getElementById("Editor-Content-Text");
	const articlePreview = document.getElementById("Editor-Content-Preview");

	const articleMediaForm = document.getElementById("Editor-Content-Medias-InArticle").querySelector("Form");
	const articleMediaPicker = document.getElementById("Editor-Content-Medias-InArticle-MediaPicker");
	const articleAlbum = document.getElementById("Editor-Content-Medias-InArticle").querySelector("Album");
	const commonMediaForm = document.getElementById("Editor-Content-Medias-InBlog").querySelector("Form");
	const commonMediaPicker = document.getElementById("Editor-Content-Medias-InBlog-MediaPicker");
	const commonAlbum = document.getElementById("Editor-Content-Medias-InBlog").querySelector("Album");
	const mediaPickerForeground = document.getElementById("Editor-Content-Medias-Foreground");

	const btns = document.getElementById("Editor-Btns");
	const saveBtn = document.getElementById("Editor-Btns-Save");
	const previewBtn = document.getElementById("Editor-Btns-Preview");
	const publishBtn = document.getElementById("Editor-Btns-Publish");
	const deleteBtn = document.getElementById("Editor-Btns-Delete");
	const publishAllBtn = document.getElementById("Toolbar-PublishAll");

	document.querySelectorAll("Select").forEach(selectBox => M.Select.init(selectBox));
	document.querySelectorAll(".tabs").forEach(tab => M.Tabs.init(tab));

	document.querySelectorAll(".datepicker").forEach(picker => {
		picker.value = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
		M.updateTextFields();

		M.Datepicker.init(picker, {
			format: "yyyy/mm/dd",
			defaultDate: new Date()
		});
	});



	articleId.addEventListener("change", event => {
		let id = articleId.value;

		switch (id) {
			default:
				articlePreview.src = `/api/preview/${id}`,
				articleMediaForm.action = `/api/media/${id}`;

				Array.from(btns.children).forEach(btn => btn.classList.remove("disabled"));
				break;

			case "Add":
				IO.createArticle(res => {
					id = res.id;
					
					let article = new Option(id, id);
						article.selected = true;

					articleId.M_Select.$selectOptions[1].appendChild(article);
					M.Select.init(articleId);

					articlePreview.src = `/api/preview/${id}`,
					articleMediaForm.action = `/api/media/${id}`;
					Array.from(btns.children).forEach(btn => btn.classList.remove("disabled"));

					M.toast({ html: `記事(ID：${id})が新規作成されました` });
				});
				
				break;
		}

		IO.getArticle(id, res => {
			let { title, createdAt, content } = JSON.parse(res.content);
			
			articleTitle.value = title,
			articleCreatedAt.value = createdAt,
			articleContent.value = content;

			M.updateTextFields(),
			M.textareaAutoResize(articleContent);
		});

		IO.getMedias(id, res => {
			while (articleAlbum.children.length != 0) articleAlbum.children[0].remove();

			let medias = res.medias;

			for (let i = 0; i < medias.length; i++) {
				let thumb = Components.generateThumbnail(id, medias[i]);
					M.Tooltip.init(thumb);

				articleAlbum.appendChild(thumb);
			}
		});
	});

	[articleMediaPicker, commonMediaPicker].forEach(picker => {
		picker.addEventListener("dragover", () => {
			mediaPickerForeground.classList.add("isDropping");
		});

		picker.addEventListener("dragleave", () => {
			mediaPickerForeground.classList.remove("isDropping");
		});

		picker.addEventListener("drop", () => {
			mediaPickerForeground.classList.remove("isDropping");
		})
	});

	articleMediaPicker.addEventListener("drop", event => {
		event.preventDefault();
		articleMediaPicker.files = event.dataTransfer.files;

		articleMediaForm.submit();
	});

	articleMediaForm.addEventListener("submit", event => {
		let id = articleId.value,
			medias = articleMediaPicker.files;

		for (let i = 0; i < medias.length; i++) {
			let path = medias[i].name;

			if (!articleAlbum.querySelector(`Img[Data-Tooltip="${path}"]`)) {
				(function looper () {
					if (DOM.xhr({ type: "GET", url: `${CONFIG.PATH.MEDIA}/${id}/${path}` }).status == 404) {
						setTimeout(looper, 10);
						return;
					}

					let thumbnail = Components.generateThumbnail(id, path)
						M.Tooltip.init(thumbnail);

					articleAlbum.appendChild(thumbnail);
				})();
			}
		}
	});

	commonMediaPicker.addEventListener("drop", event => {
		event.preventDefault();
		commonMediaPicker.files = event.dataTransfer.files;
	});

	commonMediaForm.addEventListener("submit", event => {
		let medias = commonMediaPicker.files;

		for (let i = 0; i < medias.length; i++) {
			let path = medias[i].name;

			if (!commonAlbum.querySelector(`Img[Data-Tooltip="${path}"]`)) {
				(function looper () {
					if (DOM.xhr({ type: "GET", url: `${CONFIG.PATH.COMMONMEDIA}/${path}` }).status == 404) {
						setTimeout(looper, 10);
						return;
					}

					let thumbnail = Components.generateCommonThumbnail(path)
						M.Tooltip.init(thumbnail);

					commonAlbum.appendChild(thumbnail);
				})();
			}
		}
	});



	saveBtn.addEventListener("click", () => {
		IO.saveArticle(articleId.value, {
			title: articleTitle.value,
			createdAt: articleCreatedAt.value,
			content: articleContent.value
		}, res => {
			M.toast({ html: `記事(ID：${res.id})が保存されました` });
		});
	});

	previewBtn.addEventListener("click", () => {
		saveBtn.click();
		articlePreview.contentWindow.location.reload();
	});

	publishBtn.addEventListener("click", () => {
		IO.publishArticle(articleId.value, res => {
			M.toast({ html: `記事ページ(${res.path})が作成されました` });
		});
	});

	deleteBtn.addEventListener("click", () => {
		IO.deleteArticle(articleId.value, res => {
			let id = res.id;
			
			articleId.M_Select.$selectOptions[1].querySelector(`Option[Value="${id}"]`).remove(),
			articleId.M_Select.$selectOptions[0].querySelector('Option[Value="None"]').selected = true;
			
			articlePreview.src = "",
			articleMediaForm.action = "";
			while (articleAlbum.children.length != 0) articleAlbum.children[0].remove();

			Array.from(btns.children).forEach(btn => btn.classList.add("disabled"));
			
			articleTitle.value = "",
			articleContent.value = "",
			articleCreatedAt.value = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;

			M.Select.init(articleId),
			M.updateTextFields(),
			M.textareaAutoResize(articleContent);

			M.toast({ html: `記事(ID：${id})が削除されました` });
		});
	});

	publishAllBtn.addEventListener("click", () => {
		IO.getArticles(res => {
			for (let articleName in res.articles) {
				IO.publishArticle(res.articles[articleName], res => {
					M.toast({ html: `記事ページ(${res.path})が作成されました` });
				});
			}
		});
	});



	IO.getArticles(res => {
		let articles = res.articles;

		for (let id in articles) {
			articleId.M_Select.$selectOptions[1].appendChild(new Option(parseInt(articles[id]), parseInt(articles[id])));
		}

		M.Select.init(articleId);
	});

	IO.getCommonMedias(res => {
		let medias = res.medias;

		for (let i = 0; i < medias.length; i++) {
			let thumbnail = Components.generateCommonThumbnail(medias[i]);
				M.Tooltip.init(thumbnail);

			commonAlbum.appendChild(thumbnail);
		}
	});
});