import Renderer from './Renderer.js';

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

		this.renderer.drawText('Punkty: ' + this.score, 5, 20, 'black', '16px Verdana');
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
			x >= this.NUM_COLS || // czy wychodzi za prawą ścianę
			y >= this.NUM_ROWS //czy wychodzi poza dolną ścianę
		) {
			return true; //jest kolizja
		}
		
		// y to wiersz , x to kolumna
		if (y < 0) return false;
		if (this.board[y][x] == this.DEFAULT) {
			return false; // brak kolizji
		} else {
			return true; // kolizja
		}
	};

	removeFullRows = () => {
		let newScore = 0;
		let numFullRows = 0;

		for (let r = 0; r < this.NUM_ROWS; r++) {
			let isFullRow = true;
			const columns = this.board[r];
			for (let c = 0; c < this.NUM_COLS; c++) {
				if (this.board[r][c] == this.DEFAULT) {
					isFullRow = false; // jest przerwa, nie ma pełnego row;
				}
			}
			if (isFullRow == true) {
				numFullRows++;

				//przesuwamy wszystko o jeden wiersz w dół
				for (let y = r; y > 1; y--) {
					for (let x = 0; x < this.NUM_COLS; x++) {
						this.board[y][x] = this.board[y - 1][x];
					}
				}

				for (let x = 0; x < this.NUM_COLS; x++) {
					this.board[0][x] = this.DEFAULT;
				}

				newScore += 1;
			}
		}

		this.score += newScore * numFullRows;
	};
}
