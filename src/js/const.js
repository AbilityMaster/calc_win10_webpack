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