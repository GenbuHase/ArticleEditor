window.addEventListener("DOMContentLoaded", () => {
	const articleId = document.querySelector("#Editor-Info-ArticleID");
	const articleTitle = document.querySelector("#Editor-Info-Title");
	const articleCreatedAt = document.querySelector("#Editor-Info-CreatedAt");
	const articleContent = document.querySelector("#Editor-Content");
	const saveBtn = document.querySelector("#Editor-Btns-Save");

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
		console.log(event.target.value);

		if (event.target.value == "Add") {
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
				}
			});
		}

		DOM.xhr({
			type: "GET",
			url: `articles/${articleId.value}.json`,
			resType: "json",
			doesSync: true,

			onLoad (event) {
				let { title, createdAt, content } = event.target.response;

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

	DOM.xhr({
		type: "GET",
		url: "/api/articles",
		resType: "json",
		doesSync: true,

		onLoad (event) {
			for (let i = 0; i < event.target.response.amount; i++) {
				articleId.M_Select.$selectOptions[1].appendChild(new Option(i + 1, i + 1));
			}

			M.Select.init(articleId);
		}
	});
});