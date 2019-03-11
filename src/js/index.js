'use strict'
import calc from './calculator.js'
import lcStorage from './localStorage.js'
import {forDrag, calculator, numbers, operationList, reverse, percent, sqrt, pow, frac, point, resultButton, smallDisplay} from './var.js'

lcStorage.init();

window.onload = function() {

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
			calculator.style.left = e.pageX - shiftX + 'px';
			calculator.style.top = e.pageY - shiftY + 'px';
			lcStorage.cords = calculator.style.left + ' ' + calculator.style.top;
		}

		document.onmousemove = function(e) {
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
		lcStorage.manage('standart');
	});
	document.querySelector('.index-menu__button_trey').addEventListener('click',function() {
		lcStorage.manage('minimized');
	});
	document.querySelector('.index-menu__button_close').addEventListener('click', function() {
		lcStorage.manage('closed');
	});
	document.querySelector('.open-calculator').addEventListener('click', function() {
		lcStorage.manage('default');
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
		if (smallDisplay.clientWidth > 286) {
			smallDisplay.style.removeProperty('right');
			smallDisplay.style.left = 0;
		} else {
			return;
		}
	}

	document.querySelector('.small-display__button_right').onclick = function() {
		if (smallDisplay.clientWidth > 286) {
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
		} else {
			return;
		}
	}
}