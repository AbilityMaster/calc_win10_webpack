import {MESSAGES, OPERATIONS} from './const';

class Operations {
	constructor() {	
	}		

	sendOperation(operation, a, b) {
		switch (operation) {
			case OPERATIONS.PLUS:
			return this._plus(a, b);
			break;
			case OPERATIONS.MINUS:
			return this._minus(a, b);
			break;
			case OPERATIONS.MULTIPLY:
			return this._multiply(a, b);
			break;
			case OPERATIONS.DIVIDE:
			return this._divide(a, b);
			break;
			case OPERATIONS.POW:
			return this._pow(a);
			break;
			case OPERATIONS.FRAC:
			return this._frac(a);
			break;
			case OPERATIONS.SQRT:
			return this._sqrt(a);
			break;
			case OPERATIONS.NEGATE: 
			return this._negate(a);
			break;
			default:
			console.log(MESSAGES.ERROR.OPERATIONS);
		}
	}

	_plus(a, b) {
		return a + b;
	}

	_minus(a, b) {		
		return a - b;
	}

	_multiply(a, b) {
		return a * b;
	}

	_divide(a, b) {
		return a / b;
	}

	_pow(a) {
		return Math.pow(a , 2);
	}

	_frac(a) {
		return 1 / a;
	}

	_sqrt(a) {
		return Math.sqrt(a);
	}

	_negate(a) {
		return a * -1;
	}

	percent(...props) {
		return parseFloat(props[0]) / 100 * props[1];
	}
}

export default Operations; 