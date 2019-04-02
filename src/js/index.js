'use strict'
import calc from './calculator.js'
//import calcLoader from './calcLoader.js'
import {MAX_WIDTH_DISPLAY, CALC_MODES, OPERATIONS} from './const.js'
import Storage from './localStorage.js'
import Display from './display.js'
import button from './Button.js'

calc.template(document.querySelector('.root'));

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