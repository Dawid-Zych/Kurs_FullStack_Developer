class RandomQuote {
	constructor() {
		this.init();
	}

	init() {
		this.quoteContainer = document.querySelector('#quote-container');
		this.quote = document.querySelector('#quote');
		this.quoteBtn = document.querySelector('#next-quote');
		this.author = document.querySelector('#author');

		this.quoteBtn.addEventListener('click', this.getQuote);
		document.addEventListener('keyup', e => {
			if (e.code === 'Space') this.getQuote();
		});

		this.getQuote();
	}

	getQuote = async () => {
		const apiUrl = '/api/quotes/random';

		try {
			const response = await fetch(apiUrl);
			const data = await response.json();

			this.quote.textContent = data.quote;
			this.author.textContent = data.author;
		} catch (error) {
			console.log(error);
			this.quote.textContent = 'Server error' + error;
		}
	};
}

const randomQuote = new RandomQuote();
