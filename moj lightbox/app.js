/* const gallery = document.querySelector('.gallery');

for (let i = 0; i < 12; i++) {
	const img = document.createElement('img');
	img.src = `https://picsum.photos/1200/800?random=${i}`;
	gallery.append(img);
}

const images = document.querySelectorAll('img');
const showLightBox = e => {
	e.target.classList.toggle('lightbox-img');
};
console.log(images);

images.forEach(img => img.addEventListener('click', showLightBox));
 */

const LightMe = {
	gallery: document.querySelector('.gallery'),
	init: function () {
		for (let i = 0; i < 12; i++) {
			const img = document.createElement('img');
			img.src = `https://picsum.photos/1200/800?random=${i}`;
			this.gallery.append(img);
		}
		this.addListeners();
	},

	addListeners: function () {
		let images = document.querySelectorAll('img');
		images.forEach(img => img.addEventListener('click', this.showLightBox));
	},

	showLightBox: function (e) {
		e.target.classList.toggle('lightbox-img');
	},
};

LightMe.init();
