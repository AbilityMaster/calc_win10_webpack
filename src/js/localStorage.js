import {display, CALC_MODES, calculator} from './var.js'

const optionMenu = document.querySelector('.option-menu'),
buttonArea = document.querySelector('.button-area'),
groupSmallDisplay = document.querySelector('.group-small-display'),
openCalc = document.querySelector('.open-calculator');

class lcStorage {
	constructor() {
		this.PositionX = window.innerWidth - calculator.offsetWidth;
		this.PositionY = window.innerHeight - calculator.offsetHeight;
		this.mode = (localStorage.getItem('mode'))?localStorage.getItem('mode'):'default';
	}

	init() {	
		calculator.style.left = (localStorage.getItem('X'))?localStorage.getItem('X'):this.PositionX;
		calculator.style.top = (localStorage.getItem('Y'))?localStorage.getItem('Y'):this.PositionY;
		this.manage(localStorage.getItem('mode'));
	}

	manage(mode) {
		switch (mode) {
			case CALC_MODES.STANDART: {
				optionMenu.style.display = 'flex';
				groupSmallDisplay.style.display = 'flex';
				display.style.display = 'block';
				buttonArea.style.display = 'block';
				calculator.style.height = '540px';
				localStorage.setItem('mode','standart');
			}
			break;
			case CALC_MODES.MINIMIZED: {
				let offsetTop = calculator.offsetTop;
				optionMenu.style.display = 'none';
				groupSmallDisplay.style.display = 'none';
				display.style.display = 'none';
				buttonArea.style.display = 'none';
				calculator.style.height = '32px';
				calculator.style.top = offsetTop;
				calculator.style.bottom = 'auto';
				localStorage.setItem('mode','minimized');
			}
			break;
			case CALC_MODES.CLOSED: {
				openCalc.style.display ='block';
				optionMenu.style.display = 'flex';
				groupSmallDisplay.style.display = 'flex';
				display.style.display = 'block';
				calculator.style.height = '540px';
				localStorage.clear();
				localStorage.setItem('mode','closed');
				calculator.style.display = 'none';
			}
			break;
			case CALC_MODES.DEFAULT: {
				openCalc.style.display ='none';
				optionMenu.style.display = 'flex';
				groupSmallDisplay.style.display = 'flex';
				display.style.display = 'block';
				buttonArea.style.display = 'block';
				calculator.style.height = '540px';
				calculator.style.display = 'block';
				calculator.style.left = this.PositionX;
				calculator.style.top = this.PositionY;
				localStorage.setItem('mode','standart');
			}
			break;
			default:
			console.log('error');
			break;
		}
	}

	set cords(value) {
		[this.positionX, this.positionY] = value.split(' ');		
		localStorage.setItem('X',this.positionX);
		localStorage.setItem('Y',this.positionY);
	}
}

export default new lcStorage();