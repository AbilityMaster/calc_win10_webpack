'use strict'
import calc from './calculator.js'
import calcLoader from './calcLoader.js'
import {MAX_WIDTH_DISPLAY, CALC_MODES} from './const.js'
import Storage from './localStorage.js'
import Display from './display.js'
import Memory from './memory.js'

let smallDisplay = document.querySelector('.small-display__block'),
point = document.querySelector('.calc__button_add-point'),
resultButton = document.querySelector('.calc__button_get-result'),
sqrt = document.querySelector('.calc__button_sqrt'),
pow = document.querySelector('.calc__button_pow'),
frac = document.querySelector('.calc__button_frac'),
percent = document.querySelector('.calc__button_percent'),
reverse = document.querySelector('.calc__button_reverse'),
operationList = document.querySelectorAll('.calc__button_operation'),
numbers = document.querySelectorAll('.calc__button_number'),
calculator = document.querySelector('.calculator'),
display = document.querySelector('.display'),
forDrag = document.querySelector('.index-menu__title'),
optionMenu = document.querySelector('.option-menu'),
buttonArea = document.querySelector('.button-area'),
groupSmallDisplay = document.querySelector('.group-small-display'),
openCalc = document.querySelector('.open-calculator'),
mem = document.querySelector('.memory'),
memoryClear = document.querySelector('.calc-add__button_memory-clear'),
memoryRead = document.querySelector('.calc-add__button_read'),
memoryPlus = document.querySelector('.calc-add__button_plus'),
memoryMinus = document.querySelector('.calc-add__button_minus'),
clear = document.querySelector('.calc__button_clear'),
backspace = document.querySelector('.calc__button_backspace'),
memorySave = document.querySelector('.calc-add__button_ms'),
memory = document.querySelector('.calc-add__button_memory');

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

	document.querySelector('.index-menu__button_open').addEventListener('click', function() {
		info.mode = CALC_MODES.STANDART;
		Storage.dataset = info;
		calcLoader.manage(CALC_MODES.STANDART);
	});
	document.querySelector('.index-menu__button_trey').addEventListener('click',function() {
		info.mode = CALC_MODES.MINIMIZED;
		Storage.dataset = info;
		calcLoader.manage(CALC_MODES.MINIMIZED)
	});
	document.querySelector('.index-menu__button_close').addEventListener('click', function() {
		calcLoader.manage(CALC_MODES.CLOSED)		
		info.mode = CALC_MODES.CLOSED;
		Storage.dataset = info;
	});
	document.querySelector('.open-calculator').addEventListener('click', function() {
		calcLoader.manage(CALC_MODES.DEFAULT);
		info.mode = CALC_MODES.DEFAULT;		
		Storage.dataset = info;	
	});

	numbers.forEach(element => {
		element.addEventListener('click', function() {
			calc.numberPress(this.innerHTML);
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
		});
	});

	operationList.forEach(function(element){
		element.addEventListener('click', function() {
			calc.operation(this.innerHTML);
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
		});
	});

	document.querySelector('.calc__button_get-result').onclick = function() {
		calc.result();
	}
	document.querySelector('.calc__button_add-point').onclick = function() {	
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
		calc.addPoint(display.innerHTML);
	}
	reverse.onclick = function() {		
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
		calc.singleOperation('NEGATE');
	}
	clear.onclick = function() {
		calc.clear();
	}

	pow.onclick = function() {
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
		calc.singleOperation('POW');
	}

	frac.onclick = function() {
		calc.singleOperation('FRAC');
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
	}

	sqrt.onclick = function() {
		calc.singleOperation('SQRT');
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
	}

	percent.onclick = function() {
		calc.singleOperation('PERCENT');
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
	}
	backspace.onclick = function() {
		calc.backspace();
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

	memorySave.onclick = function() {
		if (calc.openWindow) {
			return;
		}

		memoryRead.classList.remove("calc-add__button_disabled");
		memoryClear.classList.remove("calc-add__button_disabled");
		memory.classList.remove("calc-add__button_disabled");
		calc.MemoryActivatedButtons = true;

		calc.addToMemory(display.innerHTML);
	}

	memory.onclick = function() {		
		if (!calc.MemoryActivatedButtons) {
			return;
		}
		mem.classList.toggle("visibility");
		memoryClear.classList.toggle("calc-add__button_disabled");
		memoryRead.classList.toggle("calc-add__button_disabled");
		memoryPlus.classList.toggle("calc-add__button_disabled");
		memoryMinus.classList.toggle("calc-add__button_disabled");
		memorySave.classList.toggle("calc-add__button_disabled");
		if (calc.openWindow) {
			calc.openWindow = false;
			return;
		}
		calc.openWindow = true;

	}

	memoryPlus.onclick = function() {		
		if (calc.openWindow) {
			return;
		}

		memoryRead.classList.remove("calc-add__button_disabled");
		memoryClear.classList.remove("calc-add__button_disabled");
		memory.classList.remove("calc-add__button_disabled");
		calc.MemoryActivatedButtons = true;

		if (document.querySelector('.memory').children.length === 0) {
			calc.addToMemory(display.innerHTML);
		} else {
			let value =	document.querySelector('.memory__block').childNodes[0].innerHTML;
			let displayValue = display.innerHTML;
			document.querySelector('.memory__block').childNodes[0].innerHTML = calc.m_plus(value, displayValue);
		}
	}

	memoryMinus.onclick = function() {
		if (calc.openWindow) {
			return;
		}

		memoryRead.classList.remove("calc-add__button_disabled");
		memoryClear.classList.remove("calc-add__button_disabled");
		memory.classList.remove("calc-add__button_disabled");
		calc.MemoryActivatedButtons = true;

		if (document.querySelector('.memory').children.length === 0) {
			calc.addToMemory(display.innerHTML);
		} else {
			let value =	document.querySelector('.memory__block').childNodes[0].innerHTML;
			let displayValue = display.innerHTML;
			document.querySelector('.memory__block').childNodes[0].innerHTML = calc.m_minus(value, displayValue);
		}
	}

	memoryRead.onclick = function() {		
		if (!calc.MemoryActivatedButtons || calc.openWindow) {
			return;
		}
		display.innerHTML = 	document.querySelector('.memory__block').childNodes[0].innerHTML;
		calc.enteredNewValue = true;
	}

	memoryClear.onclick = function() {
		if (!calc.MemoryActivatedButtons || calc.openWindow) {
			return;
		}
		calc.MemoryActivatedButtons = false;
		memoryRead.classList.add("calc-add__button_disabled");
		memoryClear.classList.add("calc-add__button_disabled");
		memory.classList.add("calc-add__button_disabled");
		mem.innerHTML = '';
	}

}