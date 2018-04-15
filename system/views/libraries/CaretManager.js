class CaretManager {
	/**
	 * Creates an instance of CaretManager
	 * @param {HTMLInputElement} inputElem An inputted field
	 */
	constructor (inputElem) {
		this.inputElem = inputElem;
		this.memoryPos = [0, 0];
	}

	get startPos () { return this.inputElem.selectionStart }
	set startPos (pos = 0) { this.inputElem.selectionStart = pos }

	get endPos () { return this.inputElem.selectionEnd }
	set endPos (pos = 0) { this.inputElem.selectionEnd = pos }

	/**
	 * Updates memoryPos to current one
	 */
	updateMemoryPos () {
		this.memoryPos = [this.startPos, this.endPos];
	}

	/**
	 * Puts a text into the inputted field
	 * @param {String} text An inserted text
	 */
	appendText (text = "") {
		this.updateMemoryPos();

		let mStartPos = this.memoryPos[0],
			mEndPos = this.memoryPos[1];

		let value = this.inputElem.value;
			value = `${value.slice(0, this.startPos)}${text}${value.slice(this.endPos)}`;

			this.inputElem.value = value;

		this.startPos = this.endPos = mStartPos + text.length;
	}
}