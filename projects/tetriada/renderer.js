export default class Renderer {
	constructor() {
		this.canvas = document.querySelector('#canvas');
		this.context = this.canvas.getContext('2d');
	}

	getCanvas = () => {
		return this.canvas;
	};

	getWidth = () => {
		return this.canvas.width;
	};

	getHeight = () => {
		return this.canvas.height;
	};

	drawSquare = (x, y, width, height, color) => {
		this.drawRect(x, y, width, height, color);
		this.context.lineWidth = 1;
		this.context.strokeStyle = 'gray';
		this.context.strokeRect(x, y, width, height);
	};

	drawRect = (x, y, width, height, color) => {
		this.context.fillStyle = color;
		this.context.fillRect(x, y, width, height);
	};

	drawText = (str, x, y, color, font = '20px Verdana') => {
		this.context.fillStyle = color;
		this.context.font = font;
		this.context.fillText(str, x, y);
	};

	static getInstance() {
		if (!this.instance) {
			this.instance = new Renderer();
		}
		return this.instance;
	}
}
