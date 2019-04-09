import {CALC_MODES, MESSAGES} from './const';
import calc from './calculator';

class CalcLoader {
	constructor() {
		this.defaultSettings = {
			mode: 'default',
			x: (window.innerWidth - document.querySelector('.js_calculator').offsetWidth) / window.innerWidth * 100 + '%',
			y: (window.innerHeight - document.querySelector('.js_calculator').offsetHeight) / window.innerHeight * 100 + '%'
		};
	}

	init() {	
		let buttonMemory_Clear = document.querySelector('.js_calc-add__button_memory-clear'),
		buttonMemory_Read = document.querySelector('.js_calc-add__button_read'),
		buttonMemory_Open = document.querySelector('.js_calc-add__button_memory'),
		calculator = document.querySelector('.js_calculator');

		if (!calc.storage.dataset) {
			calc.storage.dataset = this.defaultSettings;
		}

		let storage = calc.storage.dataset;

		for (var key in storage.memoryValues) {
			calc.memory.addToMemory(storage.memoryValues[key]);
		}
		
		if (storage.isActivatedMemoryButtons === true) {
			calc.memory.isActivatedMemoryButtons = true;
			buttonMemory_Read.classList.remove('calc-add__button_disabled');
			buttonMemory_Clear.classList.remove('calc-add__button_disabled');
			buttonMemory_Open.classList.remove('calc-add__button_disabled');
		} else {
			buttonMemory_Read.classList.add('calc-add__button_disabled');
			buttonMemory_Clear.classList.add('calc-add__button_disabled');
			buttonMemory_Open.classList.add('calc-add__button_disabled');
		}
		
		calculator.style.left = storage.x ? storage.x : this.defaultSettings.x;
		calculator.style.top = storage.y ? storage.y : this.defaultSettings.y;
		this.manage(storage.mode);
	}

	manage(mode) {
		let optionMenu = document.querySelector('.js_option-menu'),
		buttonArea = document.querySelector('.js_button-area'),
		groupSmallDisplay = document.querySelector('.js_group-small-display'),
		openCalc = document.querySelector('.js_open-calculator'),
		display = document.querySelector('.js_display'),
		calculator = document.querySelector('.js_calculator');

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
				calculator.style.left = this.defaultSettings.x;
				calculator.style.top = this.defaultSettings.y;		
				
				console.log(calculator);
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
				calculator.style.left = this.defaultSettings.x;
				calculator.style.top = this.defaultSettings.y;		
				break;
			}
			default: {
				console.log(MESSAGES.ERROR.MODES);
				break;				
			}
		}
	}

}

export default CalcLoader;