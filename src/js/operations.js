import {MESSAGES, STYLES, OPERATIONS, display, disableButtons, activateButtons} from './var.js';

class Operations {
	constructor() {	
		this.nameOp = {
			[OPERATIONS.POW]: 'sqr',
			[OPERATIONS.FRAC]: '1/',
			[OPERATIONS.SQRT]: '√',
			[OPERATIONS.NEGATE]: 'negate'
		}
	}		

	[OPERATIONS.PLUS]() {
		if (this.resultPressed) {
			this.currentValue += this.ValueForProgressive;
		}	else {
			this.currentValue += parseFloat(display.innerHTML);
		}
		if (!isFinite(this.currentValue)) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;
			return;
		}
		display.innerHTML = this.trimmer(this.currentValue);
	}

	[OPERATIONS.MINUS]() {
		if (this.resultPressed) {
			this.currentValue -= this.ValueForProgressive;
		}	else {   
			this.currentValue -= parseFloat(display.innerHTML);
		}
		if (!isFinite(this.currentValue)) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;
			return;
		}
		display.innerHTML = this.trimmer(this.currentValue);
	}

	[OPERATIONS.MULTIPLY]() {
		if (this.resultPressed) {
			this.currentValue *= this.ValueForProgressive;
		}	else {
			this.currentValue *= parseFloat(display.innerHTML);
		}
		if (!isFinite(this.currentValue)) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;
			return;
		}
		display.innerHTML = this.trimmer(this.currentValue);
	}

	[OPERATIONS.DIVIDE]() {
		if (this.ValueForProgressive === 0 || parseFloat(display.innerHTML) === 0) {	
			this.operationsDisabled = true;
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.DIVIDE_BY_ZERO;
			return;
		} 

		if (this.resultPressed) {
			this.currentValue /= this.ValueForProgressive;
		}	else {
			this.currentValue /= +display.innerHTML;
		}

		display.innerHTML = this.trimmer(this.currentValue);
	}

	[OPERATIONS.POW]() {
		let temp = Math.pow(parseFloat(display.innerHTML),2);
		if (!isFinite(temp)) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;
			return;
		}
		display.innerHTML = this.trimmer(Math.pow(parseFloat(display.innerHTML),2));
	}

	[OPERATIONS.FRAC]() {
		if (parseFloat(display.innerHTML) === 0) {	
			this.operationsDisabled = true;
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.DIVIDE_BY_ZERO;
			return;
		} 
		let temp = 1 / parseFloat(display.innerHTML)
		if (!isFinite(temp)) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;
			return;
		}
		display.innerHTML = this.trimmer(temp);
	}

	[OPERATIONS.SQRT]() {
		if (parseFloat(display.innerHTML) < 0) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML =  MESSAGES.UNCORRECT_DATA;
			this.operationsDisabled = true;
			return;
		}
		let temp = Math.sqrt(parseFloat(display.innerHTML));
		if (!isFinite(temp)) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;
			return;
		}
		display.innerHTML = this.trimmer(temp);
	}

	[OPERATIONS.NEGATE]() {
		let temp = parseFloat(display.innerHTML) * -1;
		if (!isFinite(temp)) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;
			return;
		}
		display.innerHTML = this.trimmer(temp);
	}

	[OPERATIONS.PERCENT]() {
		let temp = parseFloat(display.innerHTML)/100*this.currentValue;
		if (!isFinite(temp)) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;
			return;
		}
		if (!this.currentValue) {
			display.innerHTML = 0;
			return;
		}
		return this.trimmer(temp);
	}
}

export default Operations; 