'use strict'
import calc from './calculator.js'
import calcLoader from './calcLoader.js'
import {MAX_WIDTH_DISPLAY, CALC_MODES, OPERATIONS} from './const.js'
import Storage from './localStorage.js'
import Display from './display.js'
import Memory from './memory.js'
import button from './Button.js'

let smallDisplay = document.querySelector('.js_small-display__block'),
point = document.querySelector('.js_calc__button_add-point'),
resultButton = document.querySelector('.js_calc__button_get-result'),
button_Sqrt = document.querySelector('.js_calc__button_sqrt'),
button_Pow = document.querySelector('.js_calc__button_pow'),
button_Frac = document.querySelector('.js_calc__button_frac'),
button_Percent = document.querySelector('.js_calc__button_percent'),
button_Reverse = document.querySelector('.js_calc__button_reverse'),
button_Clear = document.querySelector('.js_calc__button_clear'),
button_Backspace = document.querySelector('.js_calc__button_backspace'),
operationList = document.querySelectorAll('.js_calc__button_operation'),
button_Open = document.querySelector('.js_index-menu__button_open'),
button_Trey = document.querySelector('.js_index-menu__button_trey'),
button_Close = document.querySelector('.js_index-menu__button_close'),
button_OpenCalculator = document.querySelector('.js_open-calculator'),
numbers = document.querySelectorAll('.js_calc__button_number'),
calculator = document.querySelector('.js_calculator'),
display = document.querySelector('.js_display'),
forDrag = document.querySelector('.js_index-menu__title'),
optionMenu = document.querySelector('.js_option-menu'),
buttonArea = document.querySelector('.js_button-area'),
groupSmallDisplay = document.querySelector('.js_group-small-display'),
openCalc = document.querySelector('.js_open-calculator'),
memoryBoard = document.querySelector('.js_memory'),
buttonMemory_Clear = document.querySelector('.js_calc-add__button_memory-clear'),
buttonMemory_Read = document.querySelector('.js_calc-add__button_read'),
buttonMemory_Plus = document.querySelector('.js_calc-add__button_plus'),
buttonMemory_Minus = document.querySelector('.js_calc-add__button_minus'),
buttonMemory_Save = document.querySelector('.js_calc-add__button_ms'),
buttonMemory_Open = document.querySelector('.js_calc-add__button_memory'),
button_addPoint = document.querySelector('.js_calc__button_add-point');


export function disableButtons() {
	button_Reverse.classList.remove('calc__button_enabled');
	button_Reverse.classList.add('calc__button_disabled');
	button_Percent.classList.remove('calc__button_enabled');
	button_Percent.classList.add('calc__button_disabled');
	button_Sqrt.classList.remove('calc__button_enabled');
	button_Sqrt.classList.add('calc__button_disabled');
	button_Pow.classList.remove('calc__button_enabled');
	button_Pow.classList.add('calc__button_disabled');
	button_Frac.classList.remove('calc__button_enabled');
	button_Frac.classList.add('calc__button_disabled');
	button_addPoint.classList.remove('calc__button_enabled');
	button_addPoint.classList.add('calc__button_disabled');
	resultButton.classList.remove('calc__button_enabled');
	resultButton.classList.add('calc__button_disabled');
	operationList.forEach(function(element){
		element.classList.remove('calc__button_enabled');
		element.classList.add('calc__button_disabled');
	});
}

export function activateButtons() {
	button_Reverse.classList.add('calc__button_enabled');
	button_Reverse.classList.remove('calc__button_disabled');
	button_addPoint.classList.add('calc__button_enabled');
	button_addPoint.classList.remove('calc__button_disabled');
	resultButton.classList.add('calc__button_enabled');
	resultButton.classList.remove('calc__button_disabled');
	button_Percent.classList.add('calc__button_enabled');
	button_Percent.classList.remove('calc__button_disabled');
	button_Sqrt.classList.add('calc__button_enabled');
	button_Sqrt.classList.remove('calc__button_disabled');
	button_Pow.classList.add('calc__button_enabled');
	button_Pow.classList.remove('calc__button_disabled');
	button_Frac.classList.add('calc__button_enabled');
	button_Frac.classList.remove('calc__button_disabled');
	operationList.forEach(function(element){
		element.classList.add('calc__button_enabled');
		element.classList.remove('calc__button_disabled');
	});
}

calcLoader.init();

window.onload = function() {
	let info = {} 

	window.onresize = function(e) {
		if ((calculator.offsetLeft + calculator.clientWidth) > window.innerWidth) {
			info.x = ( window.innerWidth - calculator.clientWidth ) / window.innerWidth * 100 + '%';
			calculator.style.left = info.x;
		}
		if ((calculator.offsetTop + calculator.clientHeight) > window.innerHeight) {
			info.y = ( window.innerHeight - calculator.clientHeight ) / window.innerHeight * 100 + '%';
			calculator.style.top = info.y; 
		}
		if (calculator.offsetLeft < 0) {
			info.x = 0 + '%';
			calculator.style.left = info.x;
		}
		if (calculator.offsetTop < 0) {
			info.y = 0 + '%';
			calculator.style.top = info.y;
		}
		Storage.dataset = info;
	}	

	forDrag.onmousedown = function(e) {

		calculator.style.position = 'absolute';
		calculator.style.bottom = 'auto';
		calculator.style.right = 'auto';
		document.body.appendChild(calculator);
		let shiftX = e.pageX - calculator.offsetLeft;
		let shiftY = e.pageY - calculator.offsetTop;
		moveAt(e);
		calculator.style.zIndex = 1000;

		function moveAt(e) {
			if ((e.pageX - shiftX + calculator.clientWidth) > window.innerWidth) {
				calculator.style.left = (window.innerWidth - calculator.clientWidth) / window.innerWidth * 100 + '%';
			} else {				
				calculator.style.left = (e.pageX - shiftX) / window.innerWidth * 100 + '%';
			}

			if ((e.pageY - shiftY + calculator.clientHeight) > window.innerHeight) {
				calculator.style.top = (window.innerHeight - calculator.clientHeight) / window.innerHeight * 100 + '%';
			} else {
				calculator.style.top = (e.pageY - shiftY) / window.innerHeight * 100 + '%';
			}
			if ((e.pageY - shiftY) <= 0) {
				calculator.style.top = 0;
			}
			if ((e.pageX - shiftX) <= 0) {
				calculator.style.left = 0;
			}

			info.x = calculator.style.left;
			info.y = calculator.style.top;

			if (Storage.dataset.mode === CALC_MODES.DEFAULT) {
				info.mode = CALC_MODES.STANDART;
			}
			
			Storage.dataset = info;
		}

		document.onmousemove = function(e) {
			if (window.innerWidth < 350) {
				return false;
			}
			moveAt(e);
		};	

		calculator.onmouseup = function() {
			document.onmousemove = null;
			calculator.onmouseup = null;
		};
	}

	calculator.ondragstart = function() {
		return false;
	};

	button_Open.onclick = function() {
		info.mode = CALC_MODES.STANDART;
		Storage.dataset = info;
		calcLoader.manage(CALC_MODES.STANDART);
	}

	button_Trey.onclick = function() {
		info.mode = CALC_MODES.MINIMIZED;
		Storage.dataset = info;
		calcLoader.manage(CALC_MODES.MINIMIZED)
	}

	button_Close.onclick = function() {
		calcLoader.manage(CALC_MODES.CLOSED)		
		info.mode = CALC_MODES.CLOSED;
		Storage.dataset = info;
	}

	button_OpenCalculator.onclick = function() {
		calcLoader.manage(CALC_MODES.DEFAULT);
		info.mode = CALC_MODES.DEFAULT;		
		Storage.dataset = info;	
	}

	numbers.forEach(element => {
		element.addEventListener('click', function() {
			button.type = element.dataset.value;
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
			calc.disp.numberPress(button.type)
			calc.enteredNewValue = true;
		});
	});

	operationList.forEach(element => {
		element.addEventListener('click', function() {
			calc.operation(this.innerHTML);
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
		});
	});

	document.querySelector('.calc__button_get-result').onclick = function() {
		calc.result();
	}

	button_addPoint.onclick = function() {	
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
		calc.addPoint();
	}

	button_Clear.onclick = function() {
		calc.clear();
	}

	button_Backspace.onclick = function() {
		calc.operationsDisabled = false;
		calc.backspace();
	}

	button_Reverse.onclick = function() {		
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
		calc.singleOperation('NEGATE');
	}

	button_Pow.onclick = function() {
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
		calc.singleOperation('POW');
	}

	button_Frac.onclick = function() {
		calc.singleOperation('FRAC');
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
	}

	button_Sqrt.onclick = function() {
		calc.singleOperation('SQRT');
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
	}

	button_Percent.onclick = function() {
		calc.singleOperation('PERCENT');
		console.log(calc.singleOperation);
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
	}

	document.querySelector('.small-display__button_left').onclick = function() {
		if (smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
			smallDisplay.style.removeProperty('right');
			smallDisplay.style.left = 0;
		}
	}

	document.querySelector('.small-display__button_right').onclick = function() {
		if (smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
		} 
	}

	buttonMemory_Save.onclick = function() {
		if (Memory.isOpenMemoryWindow) {
			return;
		}

		Memory.isActivatedMemoryButtons = true;
		info.isActivatedMemoryButtons = Memory.isActivatedMemoryButtons;
		Storage.dataset = info;

		buttonMemory_Read.classList.remove("calc-add__button_disabled");
		buttonMemory_Clear.classList.remove("calc-add__button_disabled");
		buttonMemory_Open.classList.remove("calc-add__button_disabled");

		Memory.addToMemory(display.innerHTML);

		info.memoryValues = Memory.memoryValues;
		Storage.dataset = info;
	}

	buttonMemory_Open.onclick = function() {		
		if (!Memory.isActivatedMemoryButtons) {
			return;
		}

		memoryBoard.classList.toggle("visibility");
		buttonMemory_Clear.classList.toggle("calc-add__button_disabled");
		buttonMemory_Read.classList.toggle("calc-add__button_disabled");
		buttonMemory_Plus.classList.toggle("calc-add__button_disabled");
		buttonMemory_Minus.classList.toggle("calc-add__button_disabled");
		buttonMemory_Save.classList.toggle("calc-add__button_disabled");

		if (Memory.isOpenMemoryWindow) {
			Memory.isOpenMemoryWindow = false;
			return;
		}

		Memory.isOpenMemoryWindow = true;
	}

	buttonMemory_Plus.onclick = function() {		
		if (Memory.isOpenMemoryWindow) {
			return;
		}

		Memory.isActivatedMemoryButtons = true;
		info.isActivatedMemoryButtons = Memory.isActivatedMemoryButtons;
		Storage.dataset = info;

		buttonMemory_Read.classList.remove("calc-add__button_disabled");
		buttonMemory_Clear.classList.remove("calc-add__button_disabled");
		buttonMemory_Open.classList.remove("calc-add__button_disabled");

		if (Memory.isEmpty()) {
			Memory.addToMemory(display.innerHTML);
		} else {
			let value =	document.querySelector('.memory__block').childNodes[0].innerHTML;
			let displayValue = display.innerHTML;
			let position = document.querySelector('.memory__block').dataset.position;

			Memory.plus(value, displayValue, position);

		  document.querySelector('.memory__block').childNodes[0].innerHTML = Memory.memoryValues[position];
		}

		info.memoryValues = Memory.memoryValues;
		Storage.dataset = info;
	}

	buttonMemory_Minus.onclick = function() {
		if (Memory.isOpenMemoryWindow) {
			return;
		}

		Memory.isActivatedMemoryButtons = true;
		info.isActivatedMemoryButtons = Memory.isActivatedMemoryButtons;
		Storage.dataset = info;

		buttonMemory_Read.classList.remove("calc-add__button_disabled");
		buttonMemory_Clear.classList.remove("calc-add__button_disabled");
		buttonMemory_Open.classList.remove("calc-add__button_disabled");

		if (Memory.isEmpty()) {
			Memory.addToMemory(display.innerHTML);
		} else {
			let value =	document.querySelector('.memory__block').childNodes[0].innerHTML;
			let displayValue = display.innerHTML;
			let position = document.querySelector('.memory__block').dataset.position;

			Memory.minus(value, displayValue, position);

			document.querySelector('.memory__block').childNodes[0].innerHTML = Memory.memoryValues[position];
		}

		info.memoryValues = Memory.memoryValues;
		Storage.dataset = info;
	}

	buttonMemory_Read.onclick = function() {		
		if (!Memory.isActivatedMemoryButtons || Memory.isOpenMemoryWindow) {
			return;
		}

		let position = document.querySelector('.memory__block').dataset.position;

		display.innerHTML = Memory.memoryValues[position];
		calc.enteredNewValue = true;
	}

	buttonMemory_Clear.onclick = function() {
		if (!Memory.isActivatedMemoryButtons || Memory.isOpenMemoryWindow) {
			return;
		}

		Memory.isActivatedMemoryButtons = false;
		info.isActivatedMemoryButtons = '0';

		buttonMemory_Read.classList.add("calc-add__button_disabled");
		buttonMemory_Clear.classList.add("calc-add__button_disabled");
		buttonMemory_Open.classList.add("calc-add__button_disabled");
		memoryBoard.innerHTML = '';

		Memory.memoryValues = {};
		Memory.storageMemoryData = {};
		info.memoryValues = Memory.memoryValues;

		Storage.dataset = info;
	}

}