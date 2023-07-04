class Toast {
	constructor() {
		this.toastContainerId = 'toasts-container';
		this.toastbtn = document.querySelector('#random-toast');
		this.toastbtn.addEventListener('click', this.generateRandomToast);
		this.init();
	}

	init = () => {
		this.container = document.createElement('div');
		this.container.id = this.toastContainerId;
		this.container.classList.add('toasts-container');
		document.body.appendChild(this.container);
	};

	create = (content, { type = 'success', duration = 2000, callbackDestroyed }) => {
		const toastEl = document.createElement('div');
		toastEl.classList.add(`toast`);
		toastEl.classList.add(type);
		toastEl.innerHTML = content;

		this.container.append(toastEl);

		if (duration) {
			setTimeout(() => {
				toastEl.classList.add('toast-destroy');
				toastEl.addEventListener('animationend', () => {
					this.removeToast(toastEl, callbackDestroyed);
				});
			}, duration);
		}

		toastEl.addEventListener('click', () => {
			this.removeToast(toastEl, callbackDestroyed);
		});
	};

	removeToast = (toastEl, callbackDestroyed) => {
		toastEl.remove();
	};

	generateRandomToast = () => {
		const types = ['success', 'danger', 'warning', 'dark', 'light'];
		const type = types[Math.floor(Math.random() * types.length)];

		const duration = Math.floor(Math.random() * 50000);

		this.create(`random-${type} toast`, { type: type, duration: duration });
	};
}

const toast = new Toast();
toast.create('success toast', { type: 'success' });
toast.create('danger toast', { type: 'danger', duration: 3000 });
toast.create('warning toast', { type: 'warning', duration: 5000 });
toast.create('light toast', { type: 'light', duration: 6000 });
toast.create('dark toast', {
	type: 'dark',
	duration: 9000,
	callbackDestroyed: () => {
		console.log('toast usunięty');
	},
});
