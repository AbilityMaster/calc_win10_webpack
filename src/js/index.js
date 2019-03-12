'use strict'
import calc from './calculator.js'
import modes from './modes.js'
import {MAX_WIDTH_DISPLAY, CALC_MODES} from './const.js'
import lc from './localStorage.js'

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
openCalc = document.querySelector('.open-calculator');

modes.init();



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
		lc.dataset = info;
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

			if (lc.dataset.mode === CALC_MODES.DEFAULT) {
				info.mode = CALC_MODES.STANDART;
			}
			
			lc.dataset = info;
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
		lc.dataset = info;
		modes.manage(CALC_MODES.STANDART);
	});
	document.querySelector('.index-menu__button_trey').addEventListener('click',function() {
		info.mode = CALC_MODES.MINIMIZED;
		lc.dataset = info;
		modes.manage(CALC_MODES.MINIMIZED)
	});
	document.querySelector('.index-menu__button_close').addEventListener('click', function() {
		modes.manage(CALC_MODES.CLOSED)		
		info.mode = CALC_MODES.CLOSED;
		lc.dataset = info;
	});
	document.querySelector('.open-calculator').addEventListener('click', function() {
		modes.manage(CALC_MODES.DEFAULT);
		info.mode = CALC_MODES.DEFAULT;		
		lc.dataset = info;	
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
	document.querySelector('.calc__button_reverse').onclick = function() {		
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
		calc.singleOperation('NEGATE');
	}
	document.querySelector('.calc__button_clear').onclick = function() {
		calc.clear();
	}
	document.querySelector('.calc__button_pow').onclick = function() {
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
		calc.singleOperation('POW');
	}
	document.querySelector('.calc__button_frac').onclick = function() {
		calc.singleOperation('FRAC');
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
	}
	document.querySelector('.calc__button_sqrt').onclick = function() {
		calc.singleOperation('SQRT');
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
	}

	document.querySelector('.calc__button_percent').onclick = function() {
		calc.singleOperation('PERCENT');
		smallDisplay.style.removeProperty('left');
		smallDisplay.style.right = 0;
	}
	document.querySelector('.calc__button_backspace').onclick = function() {
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
}