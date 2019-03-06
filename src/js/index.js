'use strict'
import calc from './calculator.js'
import {numbers, operationList, reverse, percent, sqrt, pow, frac, point, resultButton, smallDisplay} from './var.js'

window.onload = function() {

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

	function disableButtons() {
		reverse.classList.remove('calc__button_enabled');
		reverse.classList.add('calc__button_disabled');
		percent.classList.remove('calc__button_enabled');
		percent.classList.add('calc__button_disabled');
		sqrt.classList.remove('calc__button_enabled');
		sqrt.classList.add('calc__button_disabled');
		pow.classList.remove('calc__button_enabled');
		pow.classList.add('calc__button_disabled');
		frac.classList.remove('calc__button_enabled');
		frac.classList.add('calc__button_disabled');
		point.classList.remove('calc__button_enabled');
		point.classList.add('calc__button_disabled');
		resultButton.classList.remove('calc__button_enabled');
		resultButton.classList.add('calc__button_disabled');
		operationList.forEach(function(element){
			element.classList.remove('calc__button_enabled');
			element.classList.add('calc__button_disabled');
		});
	}
	function activateButtons() {
		reverse.classList.add('calc__button_enabled');
		reverse.classList.remove('calc__button_disabled');
		point.classList.add('calc__button_enabled');
		point.classList.remove('calc__button_disabled');
		resultButton.classList.add('calc__button_enabled');
		resultButton.classList.remove('calc__button_disabled');
		percent.classList.add('calc__button_enabled');
		percent.classList.remove('calc__button_disabled');
		sqrt.classList.add('calc__button_enabled');
		sqrt.classList.remove('calc__button_disabled');
		pow.classList.add('calc__button_enabled');
		pow.classList.remove('calc__button_disabled');
		frac.classList.add('calc__button_enabled');
		frac.classList.remove('calc__button_disabled');
		operationList.forEach(function(element){
			element.classList.add('calc__button_enabled');
			element.classList.remove('calc__button_disabled');
		});
	}

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