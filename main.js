window.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll('.datepicker').forEach(picker => {
		M.Datepicker.init(picker, {
			format: "yyyy/mm/dd",
			defaultDate: new Date()
		});
	});

	document.querySelector("#Editor-Btns-Save").addEventListener("click", () => {
		DOM.xhr({
			type: "POST",
			url: "/save",

			data: JSON.stringify({
				createdAt: document.querySelector("#Editor-Info-CreatedAt").value
			}, null, "\t")
		});
	});
});