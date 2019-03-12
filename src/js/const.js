export const MAX_WIDTH_DISPLAY = 286;
export const VERSION = '1.0.0';

export const CALC_MODES = {
	STANDART: 'standart',
	MINIMIZED: 'minimized',
	CLOSED: 'closed',
	DEFAULT: 'default'
}

export const MESSAGES = {
	OVERFLOW: 'Переполнение',
	DIVIDE_BY_ZERO: 'Деление на 0 невозможно',
	UNCORRECT_DATA: 'Введены неверные данные',
	ERROR: {
		MODES: 'Ошибка в режиме калькулятора',
		OPERATIONS: 'Ошибка в работе операций'
	}
};

export const STYLES = {
	SMALL: '20px',
	NORMAL: '45px'
};

export const OPERATIONS = {
	PLUS: '+',
	MINUS: '-',
	MULTIPLY: '*',
	DIVIDE: '÷',
	POW: 'POW',
	FRAC: 'FRAC',
	SQRT: 'SQRT',
	NEGATE: 'NEGATE',
	PERCENT: 'PERCENT'
};


export const NAME_FOR_DISPLAY = {
	[OPERATIONS.POW]: 'sqr',
	[OPERATIONS.FRAC]: '1/',
	[OPERATIONS.SQRT]: '√',
	[OPERATIONS.NEGATE]: 'negate'
};

export function disableButtons() {
	reverse.classList.remove('calc__button_enabled');
	reverse.classList.add('calc__button_disabled');
	percent.classList.remove('calc__button_enabled');
	percent.classList.add('calc__button_disabled');
	sqrt.classList.remove('calc__button_enabled');
	sqrt.classList.add('calc__button_disabled');
	pow.classList.remove('calc__button_enabled');
	pow.classList.add('calc__button_disabled');
	frac.classList.remove('calc__button_enabled');
	frac.classList.add('calc__button_disabled');
	point.classList.remove('calc__button_enabled');
	point.classList.add('calc__button_disabled');
	resultButton.classList.remove('calc__button_enabled');
	resultButton.classList.add('calc__button_disabled');
	operationList.forEach(function(element){
		element.classList.remove('calc__button_enabled');
		element.classList.add('calc__button_disabled');
	});
}
export	function activateButtons() {
	reverse.classList.add('calc__button_enabled');
	reverse.classList.remove('calc__button_disabled');
	point.classList.add('calc__button_enabled');
	point.classList.remove('calc__button_disabled');
	resultButton.classList.add('calc__button_enabled');
	resultButton.classList.remove('calc__button_disabled');
	percent.classList.add('calc__button_enabled');
	percent.classList.remove('calc__button_disabled');
	sqrt.classList.add('calc__button_enabled');
	sqrt.classList.remove('calc__button_disabled');
	pow.classList.add('calc__button_enabled');
	pow.classList.remove('calc__button_disabled');
	frac.classList.add('calc__button_enabled');
	frac.classList.remove('calc__button_disabled');
	operationList.forEach(function(element){
		element.classList.add('calc__button_enabled');
		element.classList.remove('calc__button_disabled');
	});
}