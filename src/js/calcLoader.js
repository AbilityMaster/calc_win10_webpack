import {CALC_MODES, MESSAGES} from './const.js'
import Storage from './localStorage.js'

let optionMenu = document.querySelector('.option-menu'),
		buttonArea = document.querySelector('.button-area'),
		groupSmallDisplay = document.querySelector('.group-small-display'),
		openCalc = document.querySelector('.open-calculator'),
		display = document.querySelector('.display'),
		calculator = document.querySelector('.calculator');

let def = {
	mode: 'default',
	x: (window.innerWidth - calculator.offsetWidth) / window.innerWidth * 100 + '%',
	y: (window.innerHeight - calculator.offsetHeight) / window.innerHeight * 100 + '%'
};

class CalcLoader {
	constructor() {}

	init() {	
		if (!Storage.dataset) {
			Storage.dataset = def;
		}

		let obj = Storage.dataset;
		
		calculator.style.left = obj.x ? obj.x : def.x;
		calculator.style.top = obj.y ? obj.y : def.y;
		this.manage(obj.mode);
	}

	manage(mode) {
		switch (mode) {
			case CALC_MODES.STANDART: {
				optionMenu.style.display = 'flex';
				groupSmallDisplay.style.display = 'flex';
				display.style.display = 'block';
				buttonArea.style.display = 'block';
				calculator.style.height = '540px';
				break;
			}
			case CALC_MODES.MINIMIZED: {
				let offsetTop = calculator.offsetTop;
				optionMenu.style.display = 'none';
				groupSmallDisplay.style.display = 'none';
				display.style.display = 'none';
				buttonArea.style.display = 'none';
				calculator.style.height = '32px';
				calculator.style.top = offsetTop;
				calculator.style.bottom = 'auto';
				break;
			}
			case CALC_MODES.CLOSED: {
				openCalc.style.display ='block';
				optionMenu.style.display = 'flex';
				groupSmallDisplay.style.display = 'flex';
				display.style.display = 'block';
				calculator.style.height = '540px';
				calculator.style.left = def.x;
				calculator.style.top = def.y;		
				calculator.style.display = 'none';
				break;
			}
			case CALC_MODES.DEFAULT: {
				openCalc.style.display ='none';
				optionMenu.style.display = 'flex';
				groupSmallDisplay.style.display = 'flex';
				display.style.display = 'block';
				buttonArea.style.display = 'block';
				calculator.style.height = '540px';
				calculator.style.display = 'block';
				calculator.style.left = def.x;
				calculator.style.top = def.y;			
				break;
			}
			default: {
				console.log(MESSAGES.ERROR.MODES);
				break;				
			}
		}
	}
}

export default new CalcLoader();