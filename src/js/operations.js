import {MESSAGES, STYLES, OPERATIONS} from './const.js';
import {disableButtons, activateButtons} from './calculator.js';

let display = document.querySelector('.display');

class Operations{
	constructor() {	
		this.operationsDisabled = false;
	}		

	sendOperation(operation) {
		switch (operation) {
			case OPERATIONS.PLUS:
			this._plus();
			break;
			case OPERATIONS.MINUS:
			this._minus();
			break;
			case OPERATIONS.MULTIPLY:
			this._multiply();
			break;
			case OPERATIONS.DIVIDE:
			this._divide();
			break;
			case OPERATIONS.POW:
			this._pow();
			break;
			case OPERATIONS.FRAC:
			this._frac();
			break;
			case OPERATIONS.SQRT:
			this._sqrt();
			break;
			case OPERATIONS.NEGATE: 
			this._negate();
			break;
			default:
			console.log(MESSAGES.ERROR.OPERATIONS);
		}
	}

	_plus() {
		if (this.resultPressed) {
			this.currentValue += this.ValueForProgressive;
		}	else {
			this.currentValue += parseFloat(display.innerHTML);
		}

		if (this.checkForFinite(this.currentValue)) {
			display.innerHTML = this.trimmer(this.currentValue);
		}
	}

	_minus() {
		if (this.resultPressed) {
			this.currentValue -= this.ValueForProgressive;
		}	else {   
			this.currentValue -= parseFloat(display.innerHTML);
		}

		if (this.checkForFinite(this.currentValue)) {
			display.innerHTML = this.trimmer(this.currentValue);
		}
	}

	_multiply() {
		if (this.resultPressed) {
			this.currentValue *= this.ValueForProgressive;
		}	else {
			this.currentValue *= parseFloat(display.innerHTML);
		}

		if (this.checkForFinite(this.currentValue)) {
			display.innerHTML = this.trimmer(this.currentValue);
		}
	}

	_divide() {
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

	_pow() {
		let temp = Math.pow(parseFloat(display.innerHTML), 2);

		if (this.checkForFinite(temp)) {
			display.innerHTML = this.trimmer(Math.pow(parseFloat(display.innerHTML), 2));
		}
	}

	_frac() {
		if (parseFloat(display.innerHTML) === 0) {	
			this.operationsDisabled = true;
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML = MESSAGES.DIVIDE_BY_ZERO;

			return;
		}

		let temp = 1 / parseFloat(display.innerHTML);

		if (this.checkForFinite(temp)) {
			display.innerHTML = this.trimmer(temp);
		}
	}

	_sqrt() {
		if (parseFloat(display.innerHTML) < 0) {
			disableButtons();
			display.style.fontSize = STYLES.SMALL;
			display.innerHTML =  MESSAGES.UNCORRECT_DATA;
			this.operationsDisabled = true;

			return;
		}

		let temp = Math.sqrt(parseFloat(display.innerHTML));

		if (this.checkForFinite(temp)) {
			display.innerHTML = this.trimmer(temp);
		}
	}

	_negate() {
		let temp = parseFloat(display.innerHTML) * -1;

		if (this.checkForFinite(temp)) {
			display.innerHTML = this.trimmer(temp);
		}
	}

	percent() {
		let temp = parseFloat(display.innerHTML) / 100 * this.currentValue;

		if (this.checkForFinite(temp)) {

			if (!this.currentValue) {
				display.innerHTML = 0;

				return;
			}	

			return this.trimmer(temp);
		}
	}

}

export default Operations; 