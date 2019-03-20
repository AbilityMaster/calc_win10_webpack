import Operations from './operations.js';
import {MAX_WIDTH_DISPLAY, MESSAGES, STYLES, OPERATIONS, NAME_FOR_DISPLAY} from './const.js';
import Display from './display.js';

let display = document.querySelector('.display'),
arrowLeft = document.querySelector('.small-display__button_left'),
arrowRight = document.querySelector('.small-display__button_right'),
smallDisplay = document.querySelector('.small-display__block'),
point = document.querySelector('.calc__button_add-point'),
resultButton = document.querySelector('.calc__button_get-result'),
sqrt = document.querySelector('.calc__button_sqrt'),
pow = document.querySelector('.calc__button_pow'),
frac = document.querySelector('.calc__button_frac'),
percent = document.querySelector('.calc__button_percent'),
reverse = document.querySelector('.calc__button_reverse'),
operationList = document.querySelectorAll('.calc__button_operation'),
hiddenDisplay = document.querySelector('.small-display__add');

export function disableButtons() {
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

export function activateButtons() {
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

class Calculator extends Display {
	constructor() {
		super();
		this.resultPressed = false;
		this.operationPressed = false;
		this.needNewValue = false;
		this.currentValue = null;
		this.needValueForProgressive = false;
		this.enteredNewValue = false;
		this.typeOperation = '';
		this.pressedSingleOperation = false;
		this.maxLength = 11;
		this.singleFunction = false;
	}


	checkForFinite(temp) {
		if (!isFinite(temp)) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;

			return false;
		} else {			
			return true;
		}
	}

	trimmer(temp) {
		temp = parseFloat(temp)
		temp.toPrecision(6);
		if (String(temp).length > this.maxLength) {
			temp = temp.toPrecision(6);
		}
		return temp;
	}


	clear() {
		if (this.operationsDisabled) {
			display.style.fontSize = STYLES.NORMAL;
			this.operationsDisabled = false;
			activateButtons();
		}

		this.displayClear();

		this.currentValue = null;
		this.resultPressed = false;
		this.operationPressed = false;
		this.needNewValue = false;
		this.typeOperation = '';
		this.needValueForProgressive = false,
		this.enteredNewValue = false;
		this.singleFunction = false;
	}

	singleOperation(operation) {
		if (this.operationsDisabled) {
			return;
		}

		this.sendToStatusDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation);

		this.pressedSingleOperation = true;
		this.singleFunction = false;
		this.needNewValue = true;
		this.enteredNewValue = true;

		if (operation === OPERATIONS.PERCENT) {
			display.innerHTML = this.percent();

			return;
		} 

		this.sendOperation(operation);
	}

	result() {
		if (this.operationsDisabled) {
			return;
		}

		smallDisplay.innerHTML = '';
		this.resultPressed = true;
		this.operationPressed = false;
		this.enteredNewValue = true;

		if (this.needValueForProgressive) {
			this.ValueForProgressive = parseFloat(display.innerHTML);
			this.needValueForProgressive = false;
		}

		if ((this.operationPressed || this.resultPressed) && this.currentValue !== null) {
			this.sendOperation(this.typeOperation);
		}

	}

	operation(operation) {
		if (this.operationsDisabled) {
			return;
		}

		this.sendToStatusDisplay(OPERATIONS.LABEL_DEFAULT_OPERATION, operation);

		this.pressedSingleOperation = false;
		this.needValueForProgressive = true;

		if (this.operationPressed) {
			if (this.enteredNewValue) {
				this.sendOperation(this.typeOperation);
				this.enteredNewValue = false;
			}
			this.typeOperation = operation;
		} else {
			this.currentValue = parseFloat(display.innerHTML);
			this.typeOperation = operation;				
			this.operationPressed = true;
			this.enteredNewValue = false; 
		}

		this.needNewValue = true;
	}

}

export default new Calculator();