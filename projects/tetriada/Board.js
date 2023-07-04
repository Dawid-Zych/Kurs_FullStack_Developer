import Renderer from './renderer';

export default class Board {
	board = null;
	NUM_ROWS = null;
	NUM_COLS = null;
	DEFAULT = 'white';

	score = 0;

	constructor({ width, height, squareSize }) {
		this.renderer = Renderer.getInstance();
		this.NUM_ROWS = Math.floor(height / squareSize);
		this.NUM_COLS = Math.floor(width / squareSize);

		this.width = width;
		this.height = height;
		this.squareSize = squareSize;

		this.board = [];

		for (let i = 0; i < this.NUM_ROWS; i++) {
			this.board[i] = [];
			for (let j = 0; j < this.NUM_COLS; j++) {
				this.board[i][j] = this.DEFAULT;
			}
		}
	}

	draw = () => {
		this.board.forEach((row, rowIndex) => {
			row.forEach((col, colIndex) => {
				this.drawBoardSquare(rowIndex, colIndex, this.board[rowIndex][colIndex]);
			});
		});

		this.renderer.drawText('Points: ' + this.score, 5, 20, 'black', '16px Verdana');
	};

	drawBoardSquare = (rowIndex, colIndex, color) => {
		this.renderer.drawSquare(
			colIndex * this.squareSize,
			rowIndex * this.squareSize,
			this.squareSize,
			this.squareSize,
			color
		);
	};

	lockBoardSquare = (rowIndex, colIndex, color) => {
		if (rowIndex >= this.board.length || rowIndex < 0) return;
		if (colIndex >= this.board[rowIndex].length || colIndex < 0) return;

		this.board[rowIndex][colIndex] = color;
	};

	checkSquareCollision = (x, y) => {
		if (
			x < 0 || // czy wychodzi za lewa scianę
			x > this.NUM_COLS || // czy wychodzi za prawą ścianę
			y >= this.NUM_ROWS //czy wychodzi poza dolną ścianę
		) {
			return true; //jest kolizja
		}

		if (y < 0) return false;
	};
}
