import {CALC_MODES, MESSAGES} from './const.js'
import Storage from './localStorage.js'
import Memory from './memory.js'

let optionMenu = document.querySelector('.js_option-menu'),
buttonArea = document.querySelector('.js_button-area'),
groupSmallDisplay = document.querySelector('.js_group-small-display'),
openCalc = document.querySelector('.js_open-calculator'),
display = document.querySelector('.js_display'),
smallDisplay = document.querySelector('.js_small-display__block'),
buttonMemory_Clear = document.querySelector('.js_calc-add__button_memory-clear'),
buttonMemory_Read = document.querySelector('.js_calc-add__button_read'),
buttonMemory_Open = document.querySelector('.js_calc-add__button_memory'),
calculator = document.querySelector('.js_calculator');

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

		for (var key in obj.memoryValues) {
			Memory.addToMemory(obj.memoryValues[key]);
		}
		
		if (obj.isActivatedMemoryButtons === true) {
			Memory.isActivatedMemoryButtons = true;
			buttonMemory_Read.classList.remove("calc-add__button_disabled");
			buttonMemory_Clear.classList.remove("calc-add__button_disabled");
			buttonMemory_Open.classList.remove("calc-add__button_disabled");
		} else {
			buttonMemory_Read.classList.add("calc-add__button_disabled");
			buttonMemory_Clear.classList.add("calc-add__button_disabled");
			buttonMemory_Open.classList.add("calc-add__button_disabled");
		}
		
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