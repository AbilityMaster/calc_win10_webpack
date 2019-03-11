export const numbers = document.querySelectorAll('.calc__button_number'),
display = document.querySelector('.display'),
smallDisplay = document.querySelector('.small-display__block'),
hiddenDisplay = document.querySelector('.small-display__add'),
operationList = document.querySelectorAll('.calc__button_operation'),
reverse = document.querySelector('.calc__button_reverse'),
point = document.querySelector('.calc__button_add-point'),
resultButton = document.querySelector('.calc__button_get-result'),
percent = document.querySelector('.calc__button_percent'),
sqrt = document.querySelector('.calc__button_sqrt'),
pow = document.querySelector('.calc__button_pow'),
frac = document.querySelector('.calc__button_frac'),
arrowLeft = document.querySelector('.small-display__button_left'),
arrowRight = document.querySelector('.small-display__button_right'),
calculator = document.querySelector('.calculator'),
forDrag = document.querySelector('.index-menu__title');

export const CALC_MODES = {
	STANDART: 'standart',
	MINIMIZED: 'minimized',
	CLOSED: 'closed',
	DEFAULT: 'default'
}

export const MESSAGES = {
	OVERFLOW: 'Переполнение',
	DIVIDE_BY_ZERO: 'Деление на 0 невозможно',
	UNCORRECT_DATA: 'Введены неверные данные'
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