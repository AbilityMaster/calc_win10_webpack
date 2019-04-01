import Display from './display.js';
import Operations from './operations.js';
import Memory from './memory.js';
import {MAX_WIDTH_DISPLAY, MESSAGES, STYLES, OPERATIONS, NAME_FOR_DISPLAY} from './const.js';
import {activateButtons, disableButtons} from './index.js';

let display = document.querySelector('.js_display'),
arrowLeft = document.querySelector('.js_small-display__button_left'),
arrowRight = document.querySelector('.js_small-display__button_right'),
smallDisplay = document.querySelector('.js_small-display__block'),
hiddenDisplay = document.querySelector('.js_small-display__add');


class Calc {
	constructor() {
		this.disp = new Display(display, smallDisplay, arrowLeft, arrowRight, hiddenDisplay);
		this.operations = new Operations();
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

		this.operations.sendOperation(operation);
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

}

export default new Calc();