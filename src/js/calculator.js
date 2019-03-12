import Operations from './operations.js';
import {MAX_WIDTH_DISPLAY, MESSAGES, STYLES, OPERATIONS, disableButtons, activateButtons, NAME_FOR_DISPLAY} from './const.js';

let display = document.querySelector('.display'),
arrowLeft = document.querySelector('.small-display__button_left'),
arrowRight = document.querySelector('.small-display__button_right'),
smallDisplay = document.querySelector('.small-display__block'),
hiddenDisplay = document.querySelector('.small-display__add');


class Calculator extends Operations {
	constructor() {
		super();
		this.operationsDisabled = false;
		this.resultPressed = false;
		this.operationPressed = false;
		this.needNewValue = false;
		this.valueArray = [];
		this.currentValue = null;
		this.needValueForProgressive = false;
		this.enteredNewValue = false;
		this.typeOperation = '';
		this.pressedSingleOperation = false;
		this.maxLength = 11;
		this.singleFunction = false;
	}

	trimmer(temp) {
		temp = parseFloat(temp)
		temp.toPrecision(6);
		if (String(temp).length > this.maxLength) {
			temp = temp.toPrecision(6);
		}
		return temp;
	}

	backspace() {
		let length = display.innerHTML.length;
		if (length === 2 && display.innerHTML[0] === '-' || length === 1) {
			display.innerHTML = '0';
			return;
		}

		if (display.innerHTML === MESSAGES.DIVIDE_BY_ZERO || display.innerHTML === MESSAGES.OVERFLOW || display.innerHTML === MESSAGES.UNCORRECT_DATA) {
			smallDisplay.innerHTML = '';
			display.style.fontSize = STYLES.NORMAL;
			this.operationsDisabled = false;
			display.innerHTML = '0';
			activateButtons();
			return;
		}

		display.innerHTML = display.innerHTML.slice(0,length-1);	
	}

	clear() {
		if (this.operationsDisabled) {
			display.style.fontSize = STYLES.NORMAL;
			this.operationsDisabled = false;
			activateButtons();
		}

		display.innerHTML = '0';
		smallDisplay.innerHTML = '';
		smallDisplay.style.width = '';
		hiddenDisplay.innerHTML = '';
		hiddenDisplay.style.width = '';
		arrowLeft.style.visibility = 'hidden';
		arrowRight.style.visibility = 'hidden';
		this.currentValue = null;
		this.resultPressed = false;
		this.operationPressed = false;
		this.needNewValue = false;
		this.typeOperation = '';
		this.needValueForProgressive = false,
		this.enteredNewValue = false;
		this.singleFunction = false;
		smallDisplay.innerHTML = '';
		this.valueArray = [];
	}

	singleOperation(operation) {
		if (this.operationsDisabled) {
			return;
		}
		if (!this.pressedSingleOperation) {
			this.data = smallDisplay.innerHTML;
			this.dataWidth = smallDisplay.clientWidth;
			if (operation === OPERATIONS.PERCENT) {
				this.valueArray.push(this.sendOperation(operation));
				smallDisplay.innerHTML += ` ${this.valueArray[this.valueArray.length-1]}`;
			} else {
				this.valueArray.push(`${NAME_FOR_DISPLAY[operation]}(${display.innerHTML})`);
				hiddenDisplay.innerHTML = ` ${this.valueArray[this.valueArray.length-1]}`;
				if ((this.dataWidth + hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
					smallDisplay.style.width = this.dataWidth + hiddenDisplay.clientWidth;
				}
				smallDisplay.innerHTML += ` ${NAME_FOR_DISPLAY[operation]}(${display.innerHTML})`;
			}
		}
		if (this.pressedSingleOperation) {
			if (operation ===  OPERATIONS.PERCENT) {
				this.valueArray[this.valueArray.length-1] = this.sendOperation(operation);
				smallDisplay.innerHTML = `${this.data} ${this.valueArray[this.valueArray.length - 1]} `;
			} else {
				this.valueArray[this.valueArray.length-1] = `${NAME_FOR_DISPLAY[operation]}(${this.valueArray[this.valueArray.length - 1]})`;
				hiddenDisplay.innerHTML = ` ${this.valueArray[this.valueArray.length-1]} `;
				if ((this.dataWidth + hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
					arrowLeft.style.visibility = 'visible';
					arrowRight.style.visibility = 'visible';
					smallDisplay.style.width = this.dataWidth + hiddenDisplay.clientWidth;
				} 
				smallDisplay.innerHTML = `${this.data} ${this.valueArray[this.valueArray.length - 1]} `;
			}
		}

		this.pressedSingleOperation = true;
		this.singleFunction = false;
		this.needNewValue = true;
		this.enteredNewValue = true;

		if (operation ===  OPERATIONS.PERCENT) {
			display.innerHTML = this.sendOperation(operation);
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

		if (this.enteredNewValue && this.pressedSingleOperation) {
			this.valueArray.push(operation);
			hiddenDisplay.innerHTML = ` ${this.valueArray[this.valueArray.length-1]}`;
			if ((smallDisplay.clientWidth + hiddenDisplay.clientWidth) >= 286) {
				arrowLeft.style.visibility = 'visible';
				arrowRight.style.visibility = 'visible';
				smallDisplay.style.width = smallDisplay.clientWidth + hiddenDisplay.clientWidth + 1;
			}
			smallDisplay.innerHTML += this.valueArray[this.valueArray.length-1];
		} else if (this.enteredNewValue) {
			this.valueArray.push(display.innerHTML);
			this.valueArray.push(operation);
			hiddenDisplay.innerHTML = ` ${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;
			if ((smallDisplay.clientWidth + hiddenDisplay.clientWidth) >= 286) {
				arrowLeft.style.visibility = 'visible';
				arrowRight.style.visibility = 'visible';
				smallDisplay.style.width = smallDisplay.clientWidth + hiddenDisplay.clientWidth;
			}
			smallDisplay.innerHTML += ` ${this.valueArray[this.valueArray.length-2]}`;
			smallDisplay.innerHTML += ` ${this.valueArray[this.valueArray.length-1]}`;
		}

		this.valueArray[this.valueArray.length - 1] = operation;	
		smallDisplay.innerHTML = smallDisplay.innerHTML.slice(0,smallDisplay.innerHTML.length-1) + this.valueArray[this.valueArray.length-1];
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


	addPoint(text) {
		if (this.operationsDisabled) {
			return;
		}

		if (text.indexOf('.') === -1 && this.needNewValue ||
			text.indexOf('.') === -1 && this.resultPressed ||
			text.indexOf('.') !== -1 && this.needNewValue ||				
			text.indexOf('.') !== -1 && this.resultPressed) {
			display.innerHTML = '0.';
		this.needNewValue = false;
		return;
	} 

	if (text.indexOf('.') === -1) {
		display.innerHTML += '.';
	}
}

numberPress(number) {
	if (this.operationsDisabled) {
		this.operationsDisabled = false;
		this.clear();
		activateButtons();
	}

	this.enteredNewValue = true;
	display.style.fontSize = STYLES.NORMAL;

	if (display.innerHTML === '0.') {
		display.innerHTML += number;
		this.needNewValue = false;
		this.resultPressed = false;
		return;
	}

	if ((display.innerHTML === '0' || (this.needNewValue) || (this.resultPressed) || display.innerHTML === MESSAGES.DIVIDE_BY_ZERO)) {
		display.innerHTML = number;
		this.needNewValue = false;
		this.resultPressed = false;
		this.pressedSingleOperation = false;
	} else {
		if (display.innerHTML.length > this.maxLength) {
			return;
		}
		display.innerHTML += number;
	}
}

}

export default new Calculator();