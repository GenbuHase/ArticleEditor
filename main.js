window.addEventListener("DOMContentLoaded", () => {
	const articleId = document.querySelector("#Editor-Info-ArticleID");
	const articleTitle = document.querySelector("#Editor-Info-Title");
	const articleCreatedAt = document.querySelector("#Editor-Info-CreatedAt");
	const articleContent = document.querySelector("#Editor-Content");
	const btns = document.querySelector("#Editor-Btns");
	const saveBtn = document.querySelector("#Editor-Btns-Save");
	const publishBtn = document.querySelector("#Editor-Btns-Publish");
	const deleteBtn = document.querySelector("#Editor-Btns-Delete");

	document.querySelectorAll("Select").forEach(selectBox => M.Select.init(selectBox));

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
			url: `api/article`,
			resType: "json",
			doesSync: true,

			params: {
				id: articleId.value
			},

			onLoad (event) {
				let { title, createdAt, content } = JSON.parse(event.target.response.content);

				articleTitle.value = title,
				articleCreatedAt.value = createdAt,
				articleContent.value = content;

				M.updateTextFields(),
				M.textareaAutoResize(articleContent);
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
			})
		});
	});

	publishBtn.addEventListener("click", () => {

	});

	deleteBtn.addEventListener("click", () => {
		DOM.xhr({
			type: "DELETE",
			url: "/api/article",
			resType: "json",
			doesSync: true,

			params: {
				id: articleId.value
			},

			onLoad (event) {
				console.log(event.target.response);

				articleId.M_Select.$selectOptions[1].querySelector(`Option[Value="${event.target.response.id}"]`).remove(),
				articleId.M_Select.$selectOptions[0].querySelector('Option[Value="None"]').selected = true;

				articleTitle.value = articleContent.value = "",
				articleCreatedAt.value = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;

				M.Select.init(articleId),
				M.updateTextFields(),
				M.textareaAutoResize(articleContent);
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
});