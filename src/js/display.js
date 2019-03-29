import Operations from './operations.js';
import {MAX_WIDTH_DISPLAY, NAME_FOR_DISPLAY, OPERATIONS, MESSAGES, STYLES} from './const.js';
import {disableButtons, activateButtons} from './index.js';


class Display extends Operations {
	constructor(display, smallDisplay, arrowLeft, arrowRight, hiddenDisplay) {
		super();
		this.valueArray = [];
		this.display = display;
		this.smallDisplay = smallDisplay;
		this.hiddenDisplay = hiddenDisplay;
		this.arrowLeft = arrowLeft;
		this.arrowRight = arrowRight;
	}
	
	displayClear() {
		this.valueArray = [];
		this.display.innerHTML = '0';
		this.smallDisplay.innerHTML = '';
		this.smallDisplay.style.width = '';
		this.hiddenDisplay.innerHTML = '';
		this.hiddenDisplay.style.width = '';
		this.arrowLeft.style.visibility = 'hidden';
		this.arrowRight.style.visibility = 'hidden';
	}

	numberPress(number) {
		if (this.operationsDisabled) {
			this.operationsDisabled = false;
			this.clear();
			activateButtons();
		}

		this.enteredNewValue = true;
		this.display.style.fontSize = STYLES.NORMAL;

		if (this.display.innerHTML === '0.') {
			this.display.innerHTML += number;
			this.needNewValue = false;
			this.resultPressed = false;

			return;
		}

		if ((this.display.innerHTML === '0' || (this.needNewValue) || (this.resultPressed) || this.display.innerHTML === MESSAGES.DIVIDE_BY_ZERO)) {
			this.display.innerHTML = number;
			this.needNewValue = false;
			this.resultPressed = false;
			this.pressedSingleOperation = false;
		} else {
			if (this.display.innerHTML.length > this.maxLength) {
				return;
			}

			this.display.innerHTML += number;
		}
	}

	addPoint() {
		if (this.operationsDisabled) {
			return;
		}

		if (this.display.innerHTML.indexOf('.') === -1 && this.needNewValue || this.display.innerHTML.indexOf('.') === -1 && this.resultPressed || this.display.innerHTML.indexOf('.') !== -1 && this.needNewValue ||		this.display.innerHTML.indexOf('.') !== -1 && this.resultPressed) {
			this.display.innerHTML = '0.';
			this.needNewValue = false;
			
			return;
		} 

		if (this.display.innerHTML.indexOf('.') === -1) {
			this.display.innerHTML += '.';
		}
	}

	backspace() {
		let length = this.display.innerHTML.length;
		if (length === 2 && this.display.innerHTML[0] === '-' || length === 1) {
			this.display.innerHTML = '0';

			return;
		}

		if (this.display.innerHTML === MESSAGES.DIVIDE_BY_ZERO || this.display.innerHTML === MESSAGES.OVERFLOW || this.display.innerHTML === MESSAGES.UNCORRECT_DATA) {
			this.smallDisplay.innerHTML = '';
			this.display.style.fontSize = STYLES.NORMAL;
			this.operationsDisabled = false;
			this.display.innerHTML = '0';
			activateButtons();

			return;
		}

		this.display.innerHTML = this.display.innerHTML.slice(0,length-1);	
	}

	sendToStatusDisplay(typeOperation, operation) {
		switch (typeOperation) {
			case OPERATIONS.LABEL_SINGLE_OPERATION: {
				if (!this.pressedSingleOperation) {
					this.data = this.smallDisplay.innerHTML;
					this.dataWidth = this.smallDisplay.clientWidth;
					if (operation === OPERATIONS.PERCENT) {
						this.valueArray.push(this.percent());
						this.smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
					} else {
						this.valueArray.push(`${NAME_FOR_DISPLAY[operation]}(${this.display.innerHTML})`);
						this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
						if ((this.dataWidth + this.hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
							this.smallDisplay.style.width = this.dataWidth + this.hiddenDisplay.clientWidth;
						}
						this.smallDisplay.innerHTML += `&nbsp;${NAME_FOR_DISPLAY[operation]}(${this.display.innerHTML})&nbsp;`;
					}
				}
				if (this.pressedSingleOperation) {
					if (operation ===  OPERATIONS.PERCENT) {
						this.valueArray[this.valueArray.length-1] = this.percent();
						this.smallDisplay.innerHTML = `${this.data} ${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
					} else {
						this.valueArray[this.valueArray.length-1] = `${NAME_FOR_DISPLAY[operation]}(${this.valueArray[this.valueArray.length - 1]})`;
						this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}&nbsp;`;
						if ((this.dataWidth + this.hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
							this.arrowLeft.style.visibility = 'visible';
							this.arrowRight.style.visibility = 'visible';
							this.smallDisplay.style.width = this.dataWidth + this.hiddenDisplay.clientWidth;
						} 
						this.smallDisplay.innerHTML = `${this.data} ${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
					}
				}

				break;
			}
			case OPERATIONS.LABEL_DEFAULT_OPERATION: {
				if (this.enteredNewValue && this.pressedSingleOperation) {

					this.valueArray.push(operation);
					this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
					if ((this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
						this.arrowLeft.style.visibility = 'visible';
						this.arrowRight.style.visibility = 'visible';
						this.smallDisplay.style.width = this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth + 1;
					}
					this.smallDisplay.innerHTML += this.valueArray[this.valueArray.length-1];
				} else if (this.enteredNewValue) {


					this.valueArray.push(this.display.innerHTML);
					this.valueArray.push(operation);
					this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;

					if ((this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
						this.arrowLeft.style.visibility = 'visible';
						this.arrowRight.style.visibility = 'visible';
						this.smallDisplay.style.width = this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth;
					}
					this.smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-2]}`;
					this.smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
				} else {
					//hiddenDisplay.innerHTML = ` ${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;
				}

				this.valueArray[this.valueArray.length - 1] = operation;	
				this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;
				this.smallDisplay.innerHTML = this.smallDisplay.innerHTML.slice(0, this.smallDisplay.innerHTML.length-1) + this.valueArray[this.valueArray.length-1];
				
				break;
			}
		}


	}

}

export default Display;