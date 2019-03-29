import Display from './display.js';
import {MAX_WIDTH_DISPLAY, MESSAGES, STYLES, OPERATIONS, NAME_FOR_DISPLAY} from './const.js';
import {activateButtons, disableButtons} from './index.js';

let display = document.querySelector('.js_display'),
arrowLeft = document.querySelector('.js_small-display__button_left'),
arrowRight = document.querySelector('.js_small-display__button_right'),
smallDisplay = document.querySelector('.js_small-display__block'),
hiddenDisplay = document.querySelector('.js_small-display__add');


class Calculator extends Display {
	constructor() {
		super(display, smallDisplay, arrowLeft, arrowRight, hiddenDisplay);
		this.valueArray = [];
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
			this.display.style.fontSize = STYLES.SMALL;
			this.display.innerHTML = MESSAGES.OVERFLOW;
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
			this.display.style.fontSize = STYLES.NORMAL;
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

		if (operation === OPERATIONS.PERCENT && this.currentValue === null) { 
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

		this.smallDisplay.innerHTML = '';
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