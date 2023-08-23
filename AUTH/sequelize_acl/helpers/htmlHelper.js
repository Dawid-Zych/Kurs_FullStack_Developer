class HtmlHelper {
	getSelectIdCodeFromArr(arr, selectName, propertyToShow, id, className, selectedId = -1) {
		let idCode = '';
		if (id) idCode = `id="${id}"`;
		let html = `<select name="${selectName}" ${idCode} class="${className}"> `;

		for (const el of arr) {
			let data = '';
			if (selectedId === el.id) data = 'selected';

			html += `\n <option value='${el.id}' ${data}> ${el[propertyToShow]} </option>`;
		}

		return html + `/n</select>`;
	}

	// arr = ['admin','teacher']
	getSelectCodeFromArr(arr, selectName, id, className, selectedValue) {
		let idCode = '';
		if (id) idCode = `id="${id}"`;
		let html = `<select name="${selectName}" ${idCode} class="${className}"> `;

		for (const str of arr) {
			let data = '';
			if (selectedValue === str) data = 'selected';

			html += `\n <option value='${str}' ${data}> ${str} </option>`;
		}

		return html + `/n</select>`;
	}

	getElValueFromArrById(arr, id, propertyToShow = 'id') {
		for (const el of arr) {
			if (el.id === id) return el[propertyToShow];
		}

		return null;
	}
}

const htmlHelper = new HtmlHelper();

export { htmlHelper };
