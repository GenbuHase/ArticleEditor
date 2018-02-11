window.addEventListener("DOMContentLoaded", () => {
	const articleNumber = document.querySelector("#Editor-Info-ArticleNumber");
	const articleTitle = document.querySelector("#Editor-Info-Title");
	const articleCreatedAt = document.querySelector("#Editor-Info-CreatedAt");
	const articleContent = document.querySelector("#Editor-Content");

	document.querySelectorAll("Select").forEach(selectBox => M.Select.init(selectBox));

	document.querySelectorAll(".datepicker").forEach(picker => {
		picker.value = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
		picker.parentElement.querySelector("Label").classList.add("active");

		M.Datepicker.init(picker, {
			format: "yyyy/mm/dd",
			defaultDate: new Date()
		});
	});

	document.querySelector("#Editor-Btns-Save").addEventListener("click", () => {
		DOM.xhr({
			type: "POST",
			url: "/api/article",
			doesSync: true,

			headers: {
				"Content-Type": "application/json"
			},

			data: JSON.stringify({
				title: articleTitle.value,
				createdAt: articleCreatedAt.value,

				content: articleContent.value
			})
		});
	});

	DOM.xhr({
		type: "GET",
		url: "/api/articles",
		doesSync: true,
		resType: "json",

		onLoad (event) {
			for (let i = 0; i < event.target.response.amount; i++) {
				articleNumber.querySelector("Optgroup:Last-Child").appendChild(new Option(i + 1, i + 1));
			}

			M.Select.init(articleNumber);
		}
	});
});