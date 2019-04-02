import {MAX_WIDTH_DISPLAY, MAX_LENGTH_DISPLAY, NAME_FOR_DISPLAY, OPERATIONS, MESSAGES, STYLES} from './const.js';
import {disableButtons, activateButtons} from './index.js';


class Display {
	constructor() {
		this.valueArray = [];
		//this.display = display;
		//this.smallDisplay = smallDisplay;
		//this.hiddenDisplay = hiddenDisplay;
		//this.arrowLeft = arrowLeft;
		//this.arrowRight = arrowRight;
		this.needNewValue = false;
		this.maxLength = MAX_LENGTH_DISPLAY;
	}
	
	displayClear() {
		this.valueArray = [];
		this.needNewValue = false;
		this.display.innerHTML = '0';
		this.smallDisplay.innerHTML = '';
		this.smallDisplay.style.width = '';
		this.hiddenDisplay.innerHTML = '';
		this.hiddenDisplay.style.width = '';
		this.arrowLeft.style.visibility = 'hidden';
		this.arrowRight.style.visibility = 'hidden';
		this.isEnteredNewValue = false;
		this.isPressedSingleOperation = false;

	}

	numberPress(number) {


		if (this.operationsDisabled) {
			this.operationsDisabled = false;
			this.clear();
			activateButtons();
		}


		this.isEnteredNewValue = true;
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
			this.isPressedSingleOperation = false;
		} else {
			if (this.display.innerHTML.length > this.maxLength) {
				return;
			}
			this.display.innerHTML += number;
		}
	}

	set text(data) {
		this.display.innerHTML = data;
	}

	get text() {
		return this.display.innerHTML;
	}

	get template() {
		return `
				<div class="group-small-display js_group-small-display">
			<div class="small-display__button small-display__button_left js_small-display__button_left"></div>
			<div class="small-display">
				<div class="small-display__block js_small-display__block"></div>
				<div class="small-display__add js_small-display__add"></div>
			</div>
			<div class="small-display__button small-display__button_right js_small-display__button_right"></div>
		</div>
		<div class="display js_display">0</div> `
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
				if (!this.isPressedSingleOperation) {
					this.data = this.smallDisplay.innerHTML;
					this.dataWidth = this.smallDisplay.clientWidth;
					if (operation === OPERATIONS.PERCENT) {
						this.valueArray.push(this.percent());
						this.smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
					} else {
						this.valueArray.push(`${NAME_FOR_DISPLAY[operation]}(${this.display.innerHTML})`);
						this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
						this.addDisplayWidth();
						this.smallDisplay.innerHTML += `&nbsp;${NAME_FOR_DISPLAY[operation]}(${this.display.innerHTML})&nbsp;`;
					}
				}
				if (this.isPressedSingleOperation) {
					if (operation ===  OPERATIONS.PERCENT) {
						this.valueArray[this.valueArray.length-1] = this.percent();
						this.smallDisplay.innerHTML = `${this.data} ${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
					} else {
						this.valueArray[this.valueArray.length-1] = `${NAME_FOR_DISPLAY[operation]}(${this.valueArray[this.valueArray.length - 1]})`;
						this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}&nbsp;`;
						this.addDisplayWidth(); 
						this.smallDisplay.innerHTML = `${this.data} ${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
					}
				}

				break;
			}
			case OPERATIONS.LABEL_DEFAULT_OPERATION: {
				if (this.isEnteredNewValue && this.isPressedSingleOperation) {
					this.valueArray.push(operation);
					this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
					this.addDisplayWidth();
					this.smallDisplay.innerHTML += this.valueArray[this.valueArray.length-1];
				} else if (this.isEnteredNewValue) {
					this.valueArray.push(this.display.innerHTML);
					this.valueArray.push(operation);
					this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;
					this.addDisplayWidth();
					this.smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-2]}`;
					this.smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
				} 

				this.valueArray[this.valueArray.length - 1] = operation;	
				this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;
				this.smallDisplay.innerHTML = this.smallDisplay.innerHTML.slice(0, this.smallDisplay.innerHTML.length-1) + this.valueArray[this.valueArray.length-1];

				break;
			}
		}
	}

	addDisplayWidth() {
		if ((this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
			this.arrowLeft.style.visibility = 'visible';
			this.arrowRight.style.visibility = 'visible';
			this.smallDisplay.style.width = this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth;
		}
	}

}

export default Display;