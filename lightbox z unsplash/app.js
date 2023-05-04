const imgs = document.querySelectorAll('img');

const lightbox = {
	gallery: document.querySelector('.gallery'),
	init: function () {
		this.container = document.createElement('div');
		this.container.id = 'lightbox';
		document.body.appendChild(this.container);

		this.lightboxImg = document.createElement('img');
		this.container.appendChild(this.lightboxImg);

		this.loadImages();
	},

	loadImages: function (keywordsArr, defSize = '300x300') {
		let keywords = [
			'car',
			'bicycle',
			'sun',
			'water',
			'bike',
			'ocean',
			'ship',
			'house',
			'plant',
			'sea',
			'traffic',
			'planet',
			'pen',
			'red',
			'blue',
			'green',
			'forest',
			'yellow',
			'silver',
			'truck',
			'skyscraper',
			'laptop',
			'cpu',
		];

		if (keywordsArr) keywords = keywordsArr;

		let htmlCode = '';

		for (let key of keywords) {
			key = key.trim().toLowerCase();

			const url = `https://source.unsplash.com/${defSize}?${key}`;
			htmlCode += `<img src='${url}'>`;
		}

		this.gallery.innerHTML = htmlCode;
		this.addListeners();
	},

	addListeners: function () {
		const images = document.querySelectorAll('.gallery img');
		images.forEach(img => {
			img.addEventListener('click', event => this.galleryImgCLicked(img));
		});

		this.container.addEventListener('click', () => {
			this.hide();
		});
	},

	galleryImgCLicked: function (img) {
		console.log(img);
		this.show(img);
	},

	show: function (img) {
		this.lightboxImg.src = img.src;
		this.container.classList.add('active');
	},

	hide: function () {
		this.container.classList.remove('active');
	},
};

lightbox.init();
