class QuoteEditor {
	constructor() {
		this.init();
	}

	init() {
		this.lightbox = document.querySelector('#lightbox');
		this.editor = document.querySelector('#edit-box');
		this.quoteText = document.querySelector('#new-quote-text');
		this.quoteAuthor = document.querySelector('#new-quote-author');
		this.quotesList = document.querySelector('.quotes-list');
		this.cancelQuote = document.querySelector('#cancel-quote');
		this.editAuthor = document.querySelector('#edit-quote-author');
		this.editTextQuote = document.querySelector('#edit-quote-text');
		this.updateQuote = document.querySelector('#update-quote');

		document.addEventListener('keyup', e => {
			if (e.code === 'Backquote') this.showEditor();
		});

		document.querySelector('form').addEventListener('submit', e => {
			e.preventDefault();
			this.processNewQuote();
		});

		this.updateQuote.addEventListener('click', () => {
			const id = this.updateQuote.dataset.id; // Pobierz ID cytatu z atrybutu data-id
			this.updateDB(id);
		});
	}

	showEditor = async () => {
		this.lightbox.classList.toggle('active');
		await this.reloadQuotesList();
	};

	reloadQuotesList = async () => {
		this.removeAllChildNodes(this.quotesList);
		try {
			const quotes = await this.getQuotes();
			for (const q of quotes) {
				const quoteHtml = this.getQuoteHtmlListItem(q);
				this.quotesList.appendChild(quoteHtml);
			}
		} catch (error) {
			console.log('Brak obiektów w bazie danych! \n Przygotowanie nowej listy...');
		}
	};

	getQuoteHtmlListItem = quoteData => {
		const html = `
	        <div class="quote-list-item">
           		<span class="author">${quoteData.author}</span>: ${quoteData.quote}
            </div>
			<div class="keys">
		  	 	<div>
					<a class="editQuote" href="#" data-id="${quoteData._id}"><i class="fa-regular fa-pen-to-square"></i></a>
				</div>
			    <div>
					<a class="deleteQuote" href="#" data-id="${quoteData._id}"><i class="fa-solid fa-trash"></i></a>
	     	    </div>
	    	</div>
        `;

		const li = document.createElement('li');
		li.classList.add('list-item');
		li.innerHTML = html;

		li.querySelector('.editQuote').addEventListener('click', e => {
			this.editor.classList.add('active');
			this.editQuote(quoteData._id);
		});

		li.querySelector('.deleteQuote').addEventListener('click', e => {
			this.deleteQuote(quoteData._id);
		});

		return li;
	};

	getQuotes = async () => {
		try {
			const response = await fetch('/api/quotes');
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}

		return null;
	};

	removeAllChildNodes(parent) {
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
	}

	processNewQuote = async () => {
		if (this.quoteText.value.length === 0 || this.quoteAuthor.value.length === 0) {
			console.log('Brak pełnych danych cytatu');
			return;
		}

		const response = await fetch('/api/quotes/save', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				quote: this.quoteText.value,
				author: this.quoteAuthor.value,
			}),
		});

		const data = await response.json();
		if (data && data.saved === true) {
			console.log('Nowy element zapisany w bazie z  _id: ', data._id);

			this.reloadQuotesList();
			this.quoteText.value = '';
			this.quoteAuthor.value = '';
		}
	};

	deleteQuote = async id => {
		const response = await fetch('/api/quotes/delete', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				_id: id,
			}),
		});
		const data = await response.json();

		if (data && data.deleted === true) {
			console.log('Skasowany element: ', id);
		}
		this.reloadQuotesList();
	};

	editQuote = async id => {
		this.cancelQuote.addEventListener('click', e => {
			this.editor.classList.remove('active');
		});
		try {
			const response = await fetch(`/api/quote/${id}`);
			const data = await response.json();
			this.editAuthor.value = data.author;
			this.editTextQuote.value = data.quote;

			this.updateQuote.dataset.id = id;
		} catch (error) {
			console.error('bład w edit quote', error);
		}
	};

	updateDB = async id => {
		const files = {
			_id: id,
			author: this.editAuthor.value,
			quote: this.editTextQuote.value,
		};
		console.log('files:', files);
		try {
			const response = await fetch(`/api/quotes/update/one`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(files),
			});

			const data = await response.json();
			if (data && data.updated === true) {
				console.log('Cytat zaktualizowany w bazie danych: ', id);
				this.reloadQuotesList(); // Odśwież listę cytatów
			} else if (data && data.updated === false) {
				console.log('Nie wprowadzono nowych danych');
			}
			this.editAuthor.value = '';
			this.editTextQuote.value = '';
			this.editor.classList.remove('active');
		} catch (error) {
			console.error('Błąd podczas aktualizacji cytatu: ', error);
		}
	};
}

const quoteEditor = new QuoteEditor();
