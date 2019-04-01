import Display from './display.js';
import Operations from './operations.js';
import Memory from './memory.js';
import Storage from './localStorage.js';
import CalcLoader from './calcLoader.js';
import {MAX_WIDTH_DISPLAY, MESSAGES, STYLES, OPERATIONS, NAME_FOR_DISPLAY} from './const.js';
import {activateButtons, disableButtons} from './index.js';

let display = document.querySelector('.js_display'),
arrowLeft = document.querySelector('.js_small-display__button_left'),
arrowRight = document.querySelector('.js_small-display__button_right'),
smallDisplay = document.querySelector('.js_small-display__block'),
hiddenDisplay = document.querySelector('.js_small-display__add');


class Calc {
	constructor(tag) {
		this.template(tag);
		this.disp = new Display(display, smallDisplay, arrowLeft, arrowRight, hiddenDisplay);
		this.operations = new Operations();
		this.memory = new Memory();
		this.calcLoader = new CalcLoader();
		this.storage = new Storage();
		this.isResultPressed = false;
		this.isOperationPressed = false;
		this.isNeedValueForProgressive = false;
		this.isEnteredNewValue = false;
		this.isPressedSingleOperation = false;	
		this.typeOperation = '';
		this.currentValue = null;
	}

	clear() {
		if (this.disp.operationsDisabled) {
			this.disp.display.style.fontSize = STYLES.NORMAL;
			this.disp.operationsDisabled = false;
			activateButtons();
		}

		this.disp.displayClear();
		this.isResultPressed = false;
		this.isOperationPressed = false;		
		this.isNeedValueForProgressive = false,
		this.isEnteredNewValue = false;
		this.isPressedSingleOperation = false;		
		this.typeOperation = '';		
		this.currentValue = null;
	}

	singleOperation(operation) {
		if (this.disp.operationsDisabled) {
			return;
		}

		if (operation === OPERATIONS.PERCENT && this.operations.currentValue === null) { 
			return;
		}

		this.disp.sendToStatusDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation);
		this.isPressedSingleOperation = this.disp.isPressedSingleOperation = true;
		this.disp.needNewValue = true;
		this.isEnteredNewValue = true;

		if (operation === OPERATIONS.PERCENT) {
			display.innerHTML = this.percent();

			return;
		} 

		this.disp.text = this.operations.sendOperation(operation);
	}

	result() {
		if (this.disp.operationsDisabled) {
			return;
		}

		this.disp.smallDisplay.innerHTML = '';
		this.isResultPressed = true;
		this.isOperationPressed = false;
		this.isEnteredNewValue = this.disp.isEnteredNewValue = true;

		if (this.isNeedValueForProgressive) {
			this.operations.valueForProgressive = parseFloat(display.innerHTML);
			this.isNeedValueForProgressive = false;
		}

		if ((this.isOperationPressed || this.isResultPressed) && this.operations.currentValue !== null) {
			this.disp.text = this.operations.sendOperation(this.typeOperation, this.isResultPressed);
		}

	}

	operation(operation) {
		if (this.disp.operationsDisabled) {
			return;
		}
		
		this.isResultPressed = false;
		this.disp.sendToStatusDisplay(OPERATIONS.LABEL_DEFAULT_OPERATION, operation);
		this.isPressedSingleOperation = this.disp.isPressedSingleOperation = false;
		this.isNeedValueForProgressive = true;

		if (this.isOperationPressed) {
			if (this.isEnteredNewValue) {
				this.disp.text = this.operations.sendOperation(this.typeOperation, this.isResultPressed);
				this.isEnteredNewValue = this.disp.isEnteredNewValue = false;
			}
			this.typeOperation = operation;
		} else {
			this.operations.currentValue = parseFloat(display.innerHTML);
			this.typeOperation = operation;				
			this.isOperationPressed = true;
			this.isEnteredNewValue = this.disp.isEnteredNewValue = false; 
		}

		this.disp.needNewValue = true;
	}

	template(tag) {
		let data = `			
	<div class="calculator js_calculator">
			<div class="index-menu">
			<p class="index-menu__title js_index-menu__title">Калькулятор</p>
			<div class="index-menu__button index-menu__button_trey js_index-menu__button_trey">–</div>
			<div class="index-menu__button index-menu__button_open js_index-menu__button_open">☐</div>
			<div class="index-menu__button index-menu__button_close js_index-menu__button_close">✕</div>
		</div>
		<div class="option-menu js_option-menu">
			<div class="option-menu__btn-menu">☰</div>
			<p class="option-menu__title">Обычный</p>
			<div class="option-menu__btn-journal"></div>
		</div>
		<div class="group-small-display js_group-small-display">
			<div class="small-display__button small-display__button_left js_small-display__button_left"></div>
			<div class="small-display">
				<div class="small-display__block js_small-display__block"></div>
				<div class="small-display__add js_small-display__add"></div>
			</div>
			<div class="small-display__button small-display__button_right js_small-display__button_right"></div>
		</div>
		<div class="display js_display">0</div>
		<div class="button-area js_button-area">
			<div class="calc calc-add">
				<div class="calc-add__button calc-add__button_memory-clear js_calc-add__button_memory-clear calc-add__button_disabled">MC</div>
				<div class="calc-add__button calc-add__button_read js_calc-add__button_read calc-add__button_disabled">MR</div>
				<div class="calc-add__button calc-add__button_plus js_calc-add__button_plus">M<span>+</span></div>
				<div class="calc-add__button calc-add__button_minus js_calc-add__button_minus">M<span>-</span></div>
				<div class="calc-add__button calc-add__button_ms js_calc-add__button_ms">MS</div>
				<div class="calc-add__button calc-add__button_memory js_calc-add__button_memory calc-add__button_disabled">M</div>
			</div>
			<div class="calc">
				<div class="calc__button calc__button_enabled calc__button_percent js_calc__button_percent">%</div>
				<div class="calc__button calc__button_enabled calc__button_sqrt js_calc__button_sqrt">√</div>
				<div class="calc__button calc__button_enabled calc__button_pow js_calc__button_pow"><span class="span">x</span></div>
				<div class="calc__button calc__button_enabled calc__button_frac js_calc__button_frac"><span class="span">/</span></div>
			</div>
			<div class="calc">
				<div class="calc__button calc__button_disabled">CE</div>
				<div class="calc__button calc__button_enabled calc__button_clear js_calc__button_clear">C</div>
				<div class="calc__button calc__button_enabled calc__button_backspace js_calc__button_backspace"><-</div>
				<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation">÷</div>
			</div>
			<div class="calc">
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="7">7</div>
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="8">8</div>
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="9">9</div>
				<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation">*</div>
			</div>
			<div class="calc">
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="4">4</div>
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="5">5</div>
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="6">6</div>
				<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation">-</div>
			</div>
			<div class="calc">
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="1">1</div>
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="2">2</div>
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="3">3</div>
				<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation">+</div>
			</div>
			<div class="calc">
				<div class="calc__button calc__button_enabled calc__button_reverse js_calc__button_reverse">±</div>
				<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="0">0</div>
				<div class="calc__button calc__button_enabled calc__button_add-point js_calc__button_add-point">,</div>
				<div class="calc__button calc__button_enabled calc__button_get-result js_calc__button_get-result">=</div>
			</div>
			<div class="memory js_memory">
			</div>
		</div>
		</div> `

		tag.innerHTML = data;
		this.addEvent();
	}

	addEvent() {
		document.querySelector('.index-menu').addEventListener('click', function() {
		})
	}
}

export default new Calc(document.querySelector('.root'));