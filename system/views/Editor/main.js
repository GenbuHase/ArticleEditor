window.addEventListener("DOMContentLoaded", () => {
	const articleId = document.getElementById("Editor-Info-ArticleID");
	const articleTitle = document.getElementById("Editor-Info-Title");
	const articleCreatedAt = document.getElementById("Editor-Info-CreatedAt");
	const articleContent = document.getElementById("Editor-Content-Text");
	const articleAlbum = document.getElementById("Editor-Content-Medias-InArticle");
	const commonAlbum = document.getElementById("Editor-Content-Medias-InBlog");
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
		switch (event.target.value) {
			default:
				Array.from(btns.children).forEach(btn => btn.classList.remove("disabled"));
				break;

			case "None":
				Array.from(btns.children).forEach(btn => btn.classList.add("disabled"));
				break;

			case "Add":
				DOM.xhr({
					type: "POST",
					url: "/api/new",

					headers: {
						"Content-Type": "application/json"
					},

					onLoad (event) {
						let id = JSON.parse(event.target.response).id;
						let article = new Option(id, id);
						
						articleId.M_Select.$selectOptions[1].appendChild(article);
						article.selected = true;
						
						M.Select.init(articleId);
						Array.from(btns.children).forEach(btn => btn.classList.remove("disabled"));
					}
				});

				break;
		}

		DOM.xhr({
			type: "GET",
			url: `/api/article/${articleId.value}`,
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
			url: `/api/medias/${articleId.value}`,
			resType: "json",
			doesSync: true,

			onLoad (event) {
				let medias = event.target.response.medias;
			}
		});
	});

	saveBtn.addEventListener("click", () => {
		DOM.xhr({
			type: "POST",
			url: "/api/draft",
			resType: "json",
			doesSync: true,

			headers: {
				"Content-Type": "application/json"
			},

			data: JSON.stringify({
				id: articleId.value,

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
			url: "/api/publish",
			resType: "json",
			doesSync: true,

			headers: {
				"Content-Type": "application/json"
			},

			data: JSON.stringify({
				id: articleId.value
			}),

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
				
				articleTitle.value = articleContent.value = "",
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
				commonAlbum.appendChild(new DOM("Img", {
					classes: ["tooltipped", "z-depth-1"],
					attributes: { Src: `medias/common/${medias[i]}` },

					dataset: {
						position: "bottom",
						delay: 50,
						tooltip: medias[i]
					}
				}));
			}

			document.querySelectorAll(".tooltipped").forEach(tooltip => M.Tooltip.init(tooltip));
		}
	});
});