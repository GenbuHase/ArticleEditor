window.addEventListener("DOMContentLoaded", () => {
	const articleId = document.getElementById("Editor-Info-ArticleID");
	const articleTitle = document.getElementById("Editor-Info-Title");
	const articleCreatedAt = document.getElementById("Editor-Info-CreatedAt");
	const articleContent = document.getElementById("Editor-Content-Text");

	const articleMediaForm = document.getElementById("Editor-Content-Medias-InArticle").querySelector("Form");
	const articleMediaPicker = document.getElementById("Editor-Content-Medias-InArticle-MediaPicker");
	const articleAlbum = document.getElementById("Editor-Content-Medias-InArticle").querySelector("Album");
	const commonMediaForm = document.getElementById("Editor-Content-Medias-InBlog").querySelector("Form");
	const commonMediaPicker = document.getElementById("Editor-Content-Medias-InBlog-MediaPicker");
	const commonAlbum = document.getElementById("Editor-Content-Medias-InBlog").querySelector("Album");

	const btns = document.getElementById("Editor-Btns");
	const saveBtn = document.getElementById("Editor-Btns-Save");
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
				articleMediaForm.action = `/api/media/${id}`;
				Array.from(btns.children).forEach(btn => btn.classList.remove("disabled"));

				break;

			case "None":
				articleMediaForm.action = "";
				Array.from(btns.children).forEach(btn => btn.classList.add("disabled"));

				return;
				break;

			case "Add":
				DOM.xhr({
					type: "POST",
					url: "/api/new",

					headers: {
						"Content-Type": "application/json"
					},

					onLoad (event) {
						id = JSON.parse(event.target.response).id;
						
						let article = new Option(id, id);
						
						articleId.M_Select.$selectOptions[1].appendChild(article);
						article.selected = true;
						
						M.Select.init(articleId);

						articleMediaForm.action = `/api/media/${id}`;
						Array.from(btns.children).forEach(btn => btn.classList.remove("disabled"));

						M.toast({ html: `記事(ID：${id})が新規作成されました` });
					}
				});
				
				break;
		}

		DOM.xhr({
			type: "GET",
			url: `/api/article/${id}`,
			resType: "json",
			doesSync: true,

			onLoad (event) {
				let { title, createdAt, content } = JSON.parse(event.target.response.content);

				articleTitle.value = title,
				articleCreatedAt.value = createdAt,
				articleContent.value = content;

				M.updateTextFields(),
				M.textareaAutoResize(articleContent);
			}
		});

		DOM.xhr({
			type: "GET",
			url: `/api/medias/${id}`,
			resType: "json",
			doesSync: true,

			onLoad (event) {
				while (articleAlbum.children.length != 0) articleAlbum.children[0].remove();

				let medias = event.target.response.medias;

				for (let i = 0; i < medias.length; i++) {
					let thumb = Components.generateThumbnail(id, medias[i]);
						M.Tooltip.init(thumb);

					articleAlbum.appendChild(thumb);
				}
			}
		});
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
		DOM.xhr({
			type: "POST",
			url: `/api/article/${articleId.value}`,
			resType: "json",
			doesSync: true,

			headers: {
				"Content-Type": "application/json"
			},

			data: JSON.stringify({
				title: articleTitle.value,
				createdAt: articleCreatedAt.value,
				content: articleContent.value
			}),

			onLoad (event) {
				M.toast({ html: `記事(ID：${event.target.response.id})が保存されました` });
			}
		});
	});

	publishBtn.addEventListener("click", () => {
		DOM.xhr({
			type: "POST",
			url: `/api/publish/${articleId.value}`,
			resType: "json",
			doesSync: true,

			onLoad (event) {
				M.toast({ html: `記事ページ(${event.target.response.path})が作成されました` });
			}
		});
	});

	deleteBtn.addEventListener("click", () => {
		DOM.xhr({
			type: "DELETE",
			url: `/api/article/${articleId.value}`,
			resType: "json",
			doesSync: true,

			onLoad (event) {
				let id = event.target.response.id;
				
				articleId.M_Select.$selectOptions[1].querySelector(`Option[Value="${id}"]`).remove(),
				articleId.M_Select.$selectOptions[0].querySelector('Option[Value="None"]').selected = true;
				
				Array.from(btns.children).forEach(btn => btn.classList.add("disabled"));
				
				articleTitle.value = "",
				articleContent.value = "",
				articleCreatedAt.value = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;

				M.Select.init(articleId),
				M.updateTextFields(),
				M.textareaAutoResize(articleContent);

				M.toast({ html: `記事(ID：${id})が削除されました` });
			}
		});
	});

	publishAllBtn.addEventListener("click", () => {
		DOM.xhr({
			type: "GET",
			url: "/api/articles",
			resType: "json",
			doesSync: true,

			onLoad (event) {
				for (let articleName in event.target.response.articles) {
					DOM.xhr({
						type: "POST",
						url: "/api/publish",
						resType: "json",
						doesSync: true,
			
						headers: {
							"Content-Type": "application/json"
						},
			
						data: JSON.stringify({
							id: event.target.response.articles[articleName]
						}),
			
						onLoad (event) {
							M.toast({ html: `記事ページ(${event.target.response.path})が作成されました` });
						}
					});
				}
			}
		});
	});



	DOM.xhr({
		type: "GET",
		url: "/api/articles",
		resType: "json",
		doesSync: true,

		onLoad (event) {
			let articles = event.target.response.articles;

			for (let id in articles) {
				articleId.M_Select.$selectOptions[1].appendChild(new Option(parseInt(articles[id]), parseInt(articles[id])));
			}

			M.Select.init(articleId);
		}
	});

	DOM.xhr({
		type: "GET",
		url: `/api/medias`,
		resType: "json",
		doesSync: true,

		onLoad (event) {
			let medias = event.target.response.medias;

			for (let i = 0; i < medias.length; i++) {
				let thumbnail = Components.generateCommonThumbnail(medias[i]);
					M.Tooltip.init(thumbnail);

				commonAlbum.appendChild(thumbnail);
			}
		}
	});
});