import Block from './Block.js';
import Board from './Board.js';
import Renderer from './Renderer.js';

window.onload = function () {
	game.init();
};

class Game {
	constructor() {}

	init = async () => {
		this.renderer = Renderer.getInstance();
		this.board = new Board({
			width: this.renderer.getWidth(),
			height: this.renderer.getHeight(),
			squareSize: 20,
		});

		this.block = new Block(this.board);
		await this.block.init();
		this.block.nextBlock();
		this.initControls();
		this.startGame();
	};

	initControls = () => {
		document.addEventListener('keydown', e => {
			if (e.key == 'ArrowLeft') {
				if (!this.block.checkCollision(-1, 0)) {
					this.block.moveLeft();
				}
			} else if (e.key == 'ArrowUp') {
				if (!this.block.checkCollision(0, 0)) {
					this.block.rotateLeft();
				}
			} else if (e.key == 'ArrowRight') {
				if (!this.block.checkCollision(1, 0)) {
					this.block.moveRight();
				}
			} else if (e.key == 'ArrowDown') {
				this.moveDown();
			}
		});
	};

	moveDown = () => {
		if (!this.block.checkCollision(0, 1)) {
			this.block.moveDown();
		} else {
			//kolizja
			this.block.lockOnBoard();
			this.board.removeFullRows();
			this.block.nextBlock();

			// Sprawdzamy, czy nowy blok może być umieszczony na górze planszy
			if (this.block.checkCollision(0, 0)) {
				this.endGame();
			}
		}
	};

	startGame = () => {
		this.lastDropTime = Date.now();

		const fps = 30;
		this.gameInterval = setInterval(this.updateGame, 1000 / fps);
	};

	updateGame = () => {
		if (Date.now() - this.lastDropTime > 1000) {
			this.lastDropTime = Date.now();

			this.moveDown();
		}

		this.render();
	};

	render = () => {
		this.board.draw();
		this.block.drawOnBoard(this.board);
	};

	endGame = () => {
		// Tutaj dodaj odpowiednie działania końca gry
		clearInterval(this.gameInterval);
		console.log('Game Over');
		const modal = document.querySelector('.modal');
		const score = document.querySelector('.score');
		const restart = document.querySelector('button');
		score.innerText = this.board.score;
		modal.classList.add('active');

		restart.addEventListener('click', () => {
			modal.classList.remove('active');
			this.resetGame();
		});
	};

	resetGame = async () => {
		// Zresetuj planszę i punkty
		this.board = new Board({
			width: this.renderer.getWidth(),
			height: this.renderer.getHeight(),
			squareSize: 20,
		});
		this.board.score = 0;

		// Zresetuj blok
		this.block = new Block(this.board);
		await this.block.init();
		this.block.nextBlock();

		// Rozpocznij grę od nowa
		this.startGame();
	};
}

const game = new Game();
