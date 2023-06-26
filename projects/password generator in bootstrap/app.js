class PasswordGenerator {
	constructor() {
		this.resultPassword = document.querySelector('#result');
		this.clipboardButton = document.querySelector('#clipboard');
		this.length = document.querySelector('#length');
		this.lengthRange = document.querySelector('#lengthRange');

		this.lowercaseCheckbox = document.querySelector('#lowercase');
		this.uppercaseCheckbox = document.querySelector('#uppercase');

		this.numbersCheckbox = document.querySelector('#numbers');
		this.symbolsCheckbox = document.querySelector('#symbols');
		this.generateButton = document.querySelector('#generate-password');

		this.popover = document.querySelector('.copied');

		this.init();
	}

	init() {
		const elements = document.querySelectorAll('.password-generator input[type="checkbox"]');
		console.log(elements);
		elements.forEach(cb => {
			cb.addEventListener('click', this.updateOptions);
		});

		this.generateButton.addEventListener('click', this.generatePassword);
		this.clipboardButton.addEventListener('click', this.copyToClipboard);
		this.lengthRange.addEventListener('input', this.rangeLengthChange);
		this.length.addEventListener('input', this.lengthChange);

		this.updateOptions();
		console.log('init');
	}

	lengthChange = () => {
		this.lengthRange.value = this.length.value;
	};
	rangeLengthChange = () => {
		this.length.value = this.lengthRange.value;
	};
	copyToClipboard = () => {
		const v = this.resultPassword.value;
		if (!v) return;
		this.resultPassword.setSelectionRange(0, 99999);
		navigator.clipboard.writeText(v).then(() => console.log('Password in clipboard'));

		this.showMessege();
	};

	showMessege() {
		this.popover.classList.toggle('active');

		if (this.popover.classList.contains('active')) {
			setTimeout(() => {
				this.popover.classList.remove('active');
			}, 1000);
		}
	}

	updateOptions = () => {
		const optionMetods = [];

		if (this.uppercaseCheckbox.checked) {
			optionMetods.push(this.getRandomUppercase);
		}
		if (this.lowercaseCheckbox.checked) {
			optionMetods.push(this.getRandomLowercase);
		}

		if (this.numbersCheckbox.checked) {
			optionMetods.push(this.getRandomNumber);
		}
		if (this.symbolsCheckbox.checked) {
			optionMetods.push(this.getRandomSymbol);
		}

		this.optionMetods = optionMetods;
	};
	getRandomUppercase = () => {
		// od 65 do 90
		return String.fromCharCode(65 + Math.floor(Math.random() * 26));
	};
	getRandomLowercase = () => {
		// od 97 do 122
		return String.fromCharCode(97 + Math.floor(Math.random() * 26));
	};
	getRandomNumber = () => {
		return Math.floor(Math.random() * 10);
	};
	getRandomSymbol = () => {
		const symbols = `!@#$%^&*(){}|\/>.<,][=-`;
		return symbols.charAt(Math.floor(Math.random() * symbols.length));
	};

	generatePassword = () => {
		if (!this.length.value) return;
		if (this.optionMetods.length === 0) return;

		const arrIndexes = Array.from(Array(+this.length.value).keys());
		console.log(arrIndexes);

		const password = arrIndexes.map(i => {
			const method = this.getRandomMethod();
			return method();
		});

		this.resultPassword.value = password.join('');
	};

	getRandomMethod = () => {
		return this.optionMetods[Math.floor(Math.random() * this.optionMetods.length)];
	};
}

const passwordGenerator = new PasswordGenerator();
