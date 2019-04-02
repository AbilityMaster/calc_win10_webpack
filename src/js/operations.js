import {MESSAGES, STYLES, OPERATIONS} from './const.js';
import {disableButtons, activateButtons} from './index.js';

let display = document.querySelector('.js_display');

class Operations {
	constructor() {	
		this.operationsDisabled = false;
	}		

	sendOperation(operation, resultPressed) {
		switch (operation) {
			case OPERATIONS.PLUS:
			return this._plus(resultPressed);
			break;
			case OPERATIONS.MINUS:
			return this._minus(resultPressed);
			break;
			case OPERATIONS.MULTIPLY:
			return this._multiply(resultPressed);
			break;
			case OPERATIONS.DIVIDE:
			return this._divide(resultPressed);
			break;
			case OPERATIONS.POW:
			return this._pow();
			break;
			case OPERATIONS.FRAC:
			return this._frac();
			break;
			case OPERATIONS.SQRT:
			return this._sqrt();
			break;
			case OPERATIONS.NEGATE: 
			return this._negate();
			break;
			default:
			console.log(MESSAGES.ERROR.OPERATIONS);
		}
	}

	_plus(resultPressed) {
		if (resultPressed) {
			this.currentValue += this.valueForProgressive;
		} else {
			this.currentValue += parseFloat(this.display.innerHTML);
		}

		if (this.checkForFinite(this.currentValue)) {
			return this.trimmer(this.currentValue);
		}
	}

	_minus(resultPressed) {
		if (resultPressed) {
			this.currentValue -= this.valueForProgressive;
		}	else {   
			this.currentValue -= parseFloat(this.display.innerHTML);
		}
		
		if (this.checkForFinite(this.currentValue)) {
			return this.trimmer(this.currentValue);
		}
	}

	_multiply(resultPressed) {
		if (resultPressed) {
			this.currentValue *= this.valueForProgressive;
		}	else {
			this.currentValue *= parseFloat(this.display.innerHTML);
		}

		if (this.checkForFinite(this.currentValue)) {
			return this.trimmer(this.currentValue);
		}
	}

	_divide(resultPressed) {
		if (this.valueForProgressive === 0 || parseFloat(this.display.innerHTML) === 0) {	
			this.operationsDisabled = true;
			disableButtons();
			this.display.style.fontSize = STYLES.SMALL;
			this.display.innerHTML = MESSAGES.DIVIDE_BY_ZERO;

			return;
		} 

		if (resultPressed) {
			this.currentValue /= this.valueForProgressive;
		}	else {
			this.currentValue /= +this.display.innerHTML;
		}

		return this.trimmer(this.currentValue);
	}

	_pow() {
		let temp = Math.pow(parseFloat(this.display.innerHTML), 2);

		if (this.checkForFinite(temp)) {
			return this.trimmer(Math.pow(parseFloat(this.display.innerHTML), 2));
		}
	}

	_frac() {
		if (parseFloat(this.display.innerHTML) === 0) {	
			this.operationsDisabled = true;
			disableButtons();
			this.display.style.fontSize = STYLES.SMALL;
			this.display.innerHTML = MESSAGES.DIVIDE_BY_ZERO;

			return;
		}

		let temp = 1 / parseFloat(this.display.innerHTML);

		if (this.checkForFinite(temp)) {
			return this.trimmer(temp);
		}
	}

	_sqrt() {
		if (parseFloat(this.display.innerHTML) < 0) {
			disableButtons();
			this.display.style.fontSize = STYLES.SMALL;
			this.display.innerHTML =  MESSAGES.UNCORRECT_DATA;
			this.operationsDisabled = true;

			return;
		}

		let temp = Math.sqrt(parseFloat(this.display.innerHTML));

		if (this.checkForFinite(temp)) {
			return this.trimmer(temp);
		}
	}

	_negate() {
		let temp = parseFloat(this.display.innerHTML) * -1;

		if (this.checkForFinite(temp)) {
			return this.trimmer(temp);
		}
	}

	percent() {
		let temp = parseFloat(this.display.innerHTML) / 100 * this.currentValue;

		if (this.checkForFinite(temp)) {

			if (!this.currentValue) {
				this.display.innerHTML = 0;

				return;
			}	

			return this.trimmer(temp);
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

}

export default Operations; 