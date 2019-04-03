export const MAX_WIDTH_DISPLAY = 286;
export const VERSION = '1.0.0';
export const MAX_LENGTH_DISPLAY = 11;

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
	PERCENT: 'PERCENT',
	LABEL_SINGLE_OPERATION: 'single',
	LABEL_DEFAULT_OPERATION: 'default',
	ADD: {
		PERCENT: '%',
		SQRT: '√',
		POW: 'POW',
		FRAC: 'frac',
		CLEAR: 'clear',
		BACKSPACE: 'back',
		REVERSE: 'reverse',
		POINT: 'point',
		RESULT: 'result',
		MCLEAR: 'maclear',
		MREAD: 'mread',
		MPLUS: 'mplus',
		MMINUS: 'mminus',
		MSAVE: 'msave',
		MEMORY: 'memory'
	}
};


export const NAME_FOR_DISPLAY = {
	[OPERATIONS.POW]: 'sqr',
	[OPERATIONS.FRAC]: '1/',
	[OPERATIONS.SQRT]: '√',
	[OPERATIONS.NEGATE]: 'negate'
};