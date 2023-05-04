const genBtn = document.querySelector('.random-button');
const textColor = document.querySelector('#color-text');
var tooltip = document.getElementById('myTooltip');
const generateColor = () => {
	let num1 = Math.floor(Math.random() * 256);
	let num2 = Math.floor(Math.random() * 256);
	let num3 = Math.floor(Math.random() * 256);
	let color = `rgb(${num1},${num2},${num3})`;
	textColor.innerHTML = color;
	console.log(color);
	document.body.style.backgroundColor = `${color}`;
	textColor.addEventListener('click', copyToClipboard);
};

const copyToClipboard = () => {
	const text = textColor.innerHTML;
	navigator.clipboard.writeText(text);
	tooltip.classList.add('active');

	tooltip.innerHTML = 'Copied: ' + text;
	setTimeout(() => {
		tooltip.classList.remove('active');
	}, 2000);
};

genBtn.addEventListener('click', generateColor);
