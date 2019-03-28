import Calculator from './calculator.js';
import Operations from './operations.js';
import {MAX_WIDTH_DISPLAY, NAME_FOR_DISPLAY, OPERATIONS, MESSAGES, STYLES} from './const.js';
import {disableButtons, activateButtons} from './calculator.js';

let display = document.querySelector('.display'),
smallDisplay = document.querySelector('.small-display__block'),
arrowLeft = document.querySelector('.small-display__button_left'),
arrowRight = document.querySelector('.small-display__button_right'),
hiddenDisplay = document.querySelector('.small-display__add');

class Display extends Operations {
	constructor() {
		super();
		this.valueArray = [];
	}
	
	displayClear() {
		this.valueArray = [];
		display.innerHTML = '0';
		smallDisplay.innerHTML = '';
		smallDisplay.style.width = '';
		hiddenDisplay.innerHTML = '';
		hiddenDisplay.style.width = '';
		arrowLeft.style.visibility = 'hidden';
		arrowRight.style.visibility = 'hidden';
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

	addPoint(text) {
		if (this.operationsDisabled) {
			return;
		}

		if (text.indexOf('.') === -1 && this.needNewValue || text.indexOf('.') === -1 && this.resultPressed || text.indexOf('.') !== -1 && this.needNewValue ||		text.indexOf('.') !== -1 && this.resultPressed) {
			display.innerHTML = '0.';
			this.needNewValue = false;
			return;
		} 

		if (text.indexOf('.') === -1) {
			display.innerHTML += '.';
		}
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

	sendToStatusDisplay(typeOperation, operation) {
		switch (typeOperation) {
			case OPERATIONS.LABEL_SINGLE_OPERATION: {
				if (!this.pressedSingleOperation) {
					this.data = smallDisplay.innerHTML;
					this.dataWidth = smallDisplay.clientWidth;
					if (operation === OPERATIONS.PERCENT) {
						this.valueArray.push(this.percent());
						smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
					} else {
						this.valueArray.push(`${NAME_FOR_DISPLAY[operation]}(${display.innerHTML})`);
						hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
						if ((this.dataWidth + hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
							smallDisplay.style.width = this.dataWidth + hiddenDisplay.clientWidth;
						}
						smallDisplay.innerHTML += `&nbsp;${NAME_FOR_DISPLAY[operation]}(${display.innerHTML})&nbsp;`;
					}
				}
				if (this.pressedSingleOperation) {
					if (operation ===  OPERATIONS.PERCENT) {
						this.valueArray[this.valueArray.length-1] = this.percent();
						smallDisplay.innerHTML = `${this.data} ${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
					} else {
						this.valueArray[this.valueArray.length-1] = `${NAME_FOR_DISPLAY[operation]}(${this.valueArray[this.valueArray.length - 1]})`;
						hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}&nbsp;`;
						if ((this.dataWidth + hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
							arrowLeft.style.visibility = 'visible';
							arrowRight.style.visibility = 'visible';
							smallDisplay.style.width = this.dataWidth + hiddenDisplay.clientWidth;
						} 
						smallDisplay.innerHTML = `${this.data} ${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
					}
				}
				break;
			}
			case OPERATIONS.LABEL_DEFAULT_OPERATION: {
				if (this.enteredNewValue && this.pressedSingleOperation) {

					this.valueArray.push(operation);
					hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
					if ((smallDisplay.clientWidth + hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
						arrowLeft.style.visibility = 'visible';
						arrowRight.style.visibility = 'visible';
						smallDisplay.style.width = smallDisplay.clientWidth + hiddenDisplay.clientWidth + 1;
					}
					smallDisplay.innerHTML += this.valueArray[this.valueArray.length-1];
				} else if (this.enteredNewValue) {


					this.valueArray.push(display.innerHTML);
					this.valueArray.push(operation);
					hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;

					if ((smallDisplay.clientWidth + hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
						arrowLeft.style.visibility = 'visible';
						arrowRight.style.visibility = 'visible';
						smallDisplay.style.width = smallDisplay.clientWidth + hiddenDisplay.clientWidth;
					}
					smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-2]}`;
					smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
				} else {
					//hiddenDisplay.innerHTML = ` ${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;
				}

				this.valueArray[this.valueArray.length - 1] = operation;	
				hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;
				smallDisplay.innerHTML = smallDisplay.innerHTML.slice(0,smallDisplay.innerHTML.length-1) + this.valueArray[this.valueArray.length-1];
				break;
			}
		}


	}





}

export default Display;