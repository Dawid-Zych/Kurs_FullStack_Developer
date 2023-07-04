/* manipulowanie blokami */

export default class Block {
	constructor(board) {
		this.board;
	}

	blockTypes = null;

	activeBlock = null;
	activePatternIndex = 0;
	x = 5;
	y = 2;

	init = async () => {
		await this.loadBlocks('blocks.json');
	};

	loadBlocks = async fileName => {
		const data = await fetch(fileName);
		const jsonData = await data.json();

		if (!jsonData.blocks) {
			console.log('Wrong file format in blocks.json');
			return null;
		}

		this.blockTypes = jsonData.blocks;
	};

	nextBlock = () => {
		this.x = 4;
		this.y = -2;
		this.activePatternIndex = 0;
		this.activeBlock = this.getRandomBlock();
		return this.activeBlock;
	};

	getRandomBlock = () => {
		const randIndex = Math.floor(Math.random() * this.blockTypes.length);
		return this.blockTypes[randIndex];
	};
}
