window.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll('.datepicker').forEach(picker => {
		M.Datepicker.init(picker, {
			format: "yyyy/mm/dd",
			defaultDate: new Date()
		});
	});
});