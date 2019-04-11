import { MESSAGES, OPERATIONS } from './const';

class Operations {
	constructor() {
	}

	sendOperation(operation, first, second) {
		switch (operation) {
			case OPERATIONS.PLUS:
				return this._plus(first, second);
			case OPERATIONS.MINUS:
				return this._minus(first, second);
			case OPERATIONS.MULTIPLY:
				return this._multiply(first, second);
			case OPERATIONS.DIVIDE:
				return this._divide(first, second);
			case OPERATIONS.POW:
				return this._pow(first);
			case OPERATIONS.FRAC:
				return this._frac(first);
			case OPERATIONS.SQRT:
				return this._sqrt(first);
			case OPERATIONS.NEGATE:
				return this._negate(first);
			default:
				console.log(MESSAGES.ERROR.OPERATIONS);
		}
	}

	_plus(first, second) {
		return first + second;
	}

	_minus(first, second) {
		return first - second;
	}

	_multiply(first, second) {
		return first * second;
	}

	_divide(first, second) {
		return first / second;
	}

	_pow(first) {
		return Math.pow(first, 2);
	}

	_frac(first) {
		return 1 / first;
	}

	_sqrt(first) {
		return Math.sqrt(first);
	}

	_negate(first) {
		return first * -1;
	}

	percent(...props) {
		return parseFloat(props[0]) / 100 * props[1];
	}
}

export default Operations; 