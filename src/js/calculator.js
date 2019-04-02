import Display from './display.js';
import Operations from './operations.js';
import Memory from './memory.js';
import Storage from './localStorage.js';
import CalcLoader from './calcLoader.js';
import {MAX_WIDTH_DISPLAY, MESSAGES, STYLES, OPERATIONS, NAME_FOR_DISPLAY, CALC_MODES} from './const.js';

class Calc {
	constructor(tag) {
		this.disp = new Display();		
		this.operations = new Operations();
		this.memory = new Memory();
		this.storage = new Storage();
		this.isResultPressed = false;
		this.isOperationPressed = false;
		this.isNeedValueForProgressive = false;
		this.isEnteredNewValue = false;
		this.isPressedSingleOperation = false;	
		this.typeOperation = '';
		this.currentValue = null
	}

	clear() {
		if (this.operationsDisabled) {
			this.disp.display.style.fontSize = STYLES.NORMAL;
			this.disp.operationsDisabled = false;
			activateButtons();
		}

		this.disp.displayClear();
		this.isResultPressed = false;
		this.isOperationPressed = false;		
		this.isNeedValueForProgressive = false,
		this.isEnteredNewValue = false;
		this.isPressedSingleOperation = false;		
		this.typeOperation = '';		
		this.currentValue = null;
	}

	singleOperation(operation) {
		if (this.operationsDisabled) {
			return;
		}

		if (operation === OPERATIONS.PERCENT && this.operations.currentValue === null) { 
			return;
		}

		this.disp.sendToStatusDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation);
		this.isPressedSingleOperation = this.disp.isPressedSingleOperation = true;
		this.disp.needNewValue = true;
		this.isEnteredNewValue = true;

		if (operation === OPERATIONS.PERCENT) {
			this.disp.display.innerHTML = this.operations.percent();

			return;
		} 

		
		this.disp.text = this.operations.sendOperation(operation, this.disp.text);
	}

	result() {
		if (this.operationsDisabled) {
			return;
		}

		this.disp.smallDisplay.innerHTML = '';
		this.isResultPressed = true;
		this.isOperationPressed = false;
		this.isEnteredNewValue = this.disp.isEnteredNewValue = true;

		if (this.isNeedValueForProgressive) {
			this.operations.valueForProgressive = parseFloat(this.disp.text);
			this.isNeedValueForProgressive = false;
		}

		if ((this.isOperationPressed || this.isResultPressed) && this.operations.currentValue !== undefined) {
			this.disp.text = this.operations.sendOperation(this.typeOperation, this.isResultPressed);
		}

	}

	operation(operation) {
		if (this.operationsDisabled) {
			return;
		}
		this.isResultPressed = false;
		this.disp.sendToStatusDisplay(OPERATIONS.LABEL_DEFAULT_OPERATION, operation);
		this.isPressedSingleOperation = this.disp.isPressedSingleOperation = false;
		this.isNeedValueForProgressive = true;

		if (this.isOperationPressed) {
			if (this.isEnteredNewValue) {
				this.disp.text = this.operations.sendOperation(this.typeOperation, this.isResultPressed);
				this.isEnteredNewValue = this.disp.isEnteredNewValue = false;
			}
			this.typeOperation = operation;
		} else {
			this.operations.currentValue = parseFloat(this.disp.text);
			this.typeOperation = operation;				
			this.isOperationPressed = true;
			this.isEnteredNewValue = this.disp.isEnteredNewValue = false; 
		}

		this.disp.needNewValue = true;
	}

	template(tag) {
		let data = `			
		<div class="calculator js_calculator">
		<div class="index-menu">
		<p class="index-menu__title js_index-menu__title">Калькулятор</p>
		<div class="index-menu__button index-menu__button_trey js_index-menu__button_trey">–</div>
		<div class="index-menu__button index-menu__button_open js_index-menu__button_open">☐</div>
		<div class="index-menu__button index-menu__button_close js_index-menu__button_close">✕</div>
		</div>
		<div class="option-menu js_option-menu">
		<div class="option-menu__btn-menu">☰</div>
		<p class="option-menu__title">Обычный</p>
		<div class="option-menu__btn-journal"></div>
		</div>
		${this.disp.template}
		<div class="button-area js_button-area">
		<div class="calc calc-add">
		<div class="calc-add__button calc-add__button_memory-clear js_calc-add__button_memory-clear calc-add__button_disabled">MC</div>
		<div class="calc-add__button calc-add__button_read js_calc-add__button_read calc-add__button_disabled">MR</div>
		<div class="calc-add__button calc-add__button_plus js_calc-add__button_plus">M<span>+</span></div>
		<div class="calc-add__button calc-add__button_minus js_calc-add__button_minus">M<span>-</span></div>
		<div class="calc-add__button calc-add__button_ms js_calc-add__button_ms">MS</div>
		<div class="calc-add__button calc-add__button_memory js_calc-add__button_memory calc-add__button_disabled">M</div>
		</div>
		<div class="calc">
		<div class="calc__button calc__button_enabled calc__button_percent js_calc__button_percent">%</div>
		<div class="calc__button calc__button_enabled calc__button_sqrt js_calc__button_sqrt">√</div>
		<div class="calc__button calc__button_enabled calc__button_pow js_calc__button_pow"><span class="span">x</span></div>
		<div class="calc__button calc__button_enabled calc__button_frac js_calc__button_frac"><span class="span">/</span></div>
		</div>
		<div class="calc">
		<div class="calc__button calc__button_disabled">CE</div>
		<div class="calc__button calc__button_enabled calc__button_clear js_calc__button_clear">C</div>
		<div class="calc__button calc__button_enabled calc__button_backspace js_calc__button_backspace"><-</div>
		<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation">÷</div>
		</div>
		<div class="calc">
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="7">7</div>
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="8">8</div>
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="9">9</div>
		<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation">*</div>
		</div>
		<div class="calc">
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="4">4</div>
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="5">5</div>
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="6">6</div>
		<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation">-</div>
		</div>
		<div class="calc">
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="1">1</div>
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="2">2</div>
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="3">3</div>
		<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation">+</div>
		</div>
		<div class="calc">
		<div class="calc__button calc__button_enabled calc__button_reverse js_calc__button_reverse">±</div>
		<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="0">0</div>
		<div class="calc__button calc__button_enabled calc__button_add-point js_calc__button_add-point">,</div>
		<div class="calc__button calc__button_enabled calc__button_get-result js_calc__button_get-result">=</div>
		</div>
		<div class="memory js_memory">
		</div>
		</div>
		</div> `

		tag.innerHTML = data;		
		this.calcLoader = new CalcLoader();
		this.addEvent();
	}

	addEvent() {
		this.disp.display = this.operations.display = this.memory.display = document.querySelector('.js_display');
		this.disp.arrowLeft = document.querySelector('.js_small-display__button_left');
		this.disp.arrowRight = document.querySelector('.js_small-display__button_right');
		this.disp.smallDisplay = document.querySelector('.js_small-display__block');
		this.disp.hiddenDisplay = document.querySelector('.js_small-display__add');
		this.memory.memory = document.querySelector('.js_memory');

		this.calcLoader.init();

		let smallDisplay = document.querySelector('.js_small-display__block'),
		point = document.querySelector('.js_calc__button_add-point'),
		resultButton = document.querySelector('.js_calc__button_get-result'),
		button_Sqrt = document.querySelector('.js_calc__button_sqrt'),
		button_Pow = document.querySelector('.js_calc__button_pow'),
		button_Frac = document.querySelector('.js_calc__button_frac'),
		button_Percent = document.querySelector('.js_calc__button_percent'),
		button_Reverse = document.querySelector('.js_calc__button_reverse'),
		button_Clear = document.querySelector('.js_calc__button_clear'),
		button_Backspace = document.querySelector('.js_calc__button_backspace'),
		operationList = document.querySelectorAll('.js_calc__button_operation'),
		button_Open = document.querySelector('.js_index-menu__button_open'),
		button_Trey = document.querySelector('.js_index-menu__button_trey'),
		button_Close = document.querySelector('.js_index-menu__button_close'),
		button_OpenCalculator = document.querySelector('.js_open-calculator'),
		numbers = document.querySelectorAll('.js_calc__button_number'),
		calculator = document.querySelector('.js_calculator'),
		display = document.querySelector('.js_display'),
		forDrag = document.querySelector('.js_index-menu__title'),
		optionMenu = document.querySelector('.js_option-menu'),
		buttonArea = document.querySelector('.js_button-area'),
		groupSmallDisplay = document.querySelector('.js_group-small-display'),
		openCalc = document.querySelector('.js_open-calculator'),
		memoryBoard = document.querySelector('.js_memory'),
		buttonMemory_Clear = document.querySelector('.js_calc-add__button_memory-clear'),
		buttonMemory_Read = document.querySelector('.js_calc-add__button_read'),
		buttonMemory_Plus = document.querySelector('.js_calc-add__button_plus'),
		buttonMemory_Minus = document.querySelector('.js_calc-add__button_minus'),
		buttonMemory_Save = document.querySelector('.js_calc-add__button_ms'),
		buttonMemory_Open = document.querySelector('.js_calc-add__button_memory'),
		button_addPoint = document.querySelector('.js_calc__button_add-point');

		let sendToLocalStorage = {}; 

		window.addEventListener('resize', () => {
			if ((calculator.offsetLeft + calculator.clientWidth) > window.innerWidth) {
				sendToLocalStorage.x = ( window.innerWidth - calculator.clientWidth ) / window.innerWidth * 100 + '%';
				calculator.style.left = sendToLocalStorage.x;
			}
			if ((calculator.offsetTop + calculator.clientHeight) > window.innerHeight) {
				sendToLocalStorage.y = ( window.innerHeight - calculator.clientHeight ) / window.innerHeight * 100 + '%';
				calculator.style.top = sendToLocalStorage.y; 
			}
			if (calculator.offsetLeft < 0) {
				sendToLocalStorage.x = 0 + '%';
				calculator.style.left = sendToLocalStorage.x;
			}
			if (calculator.offsetTop < 0) {
				sendToLocalStorage.y = 0 + '%';
				calculator.style.top = sendToLocalStorage.y;
			}
			this.storage.dataset = sendToLocalStorage;
		});

		forDrag.addEventListener('mousedown', (e) => {
			let moveAt = (e) => {
				if ((e.pageX - shiftX + calculator.clientWidth) > window.innerWidth) {
					calculator.style.left = (window.innerWidth - calculator.clientWidth) / window.innerWidth * 100 + '%';
				} else {				
					calculator.style.left = (e.pageX - shiftX) / window.innerWidth * 100 + '%';
				}

				if ((e.pageY - shiftY + calculator.clientHeight) > window.innerHeight) {
					calculator.style.top = (window.innerHeight - calculator.clientHeight) / window.innerHeight * 100 + '%';
				} else {
					calculator.style.top = (e.pageY - shiftY) / window.innerHeight * 100 + '%';
				}

				if ((e.pageY - shiftY) <= 0) {
					calculator.style.top = 0;
				}

				if ((e.pageX - shiftX) <= 0) {
					calculator.style.left = 0;
				}

				sendToLocalStorage.x = calculator.style.left;
				sendToLocalStorage.y = calculator.style.top;

				if (this.storage.dataset.mode === CALC_MODES.DEFAULT) {
					sendToLocalStorage.mode = CALC_MODES.STANDART;
				}

				this.storage.dataset = sendToLocalStorage;
			}

			calculator.style.position = 'absolute';
			calculator.style.bottom = 'auto';
			calculator.style.right = 'auto';
			document.body.appendChild(calculator);
			let shiftX = e.pageX - calculator.offsetLeft;
			let shiftY = e.pageY - calculator.offsetTop;
			moveAt(e);
			calculator.style.zIndex = 1000;			

			document.onmousemove = function(e) {
				if (window.innerWidth < 350) {
					return false;
				}
				moveAt(e);
			};	

			calculator.onmouseup = function() {
				document.onmousemove = null;
				calculator.onmouseup = null;
			};
		});

		calculator.ondragstart = function() {
			return false;
		};

		button_Open.addEventListener('click', () => {
			sendToLocalStorage.mode = CALC_MODES.STANDART;
			this.storage.dataset = sendToLocalStorage;
			this.calcLoader.manage(CALC_MODES.STANDART);
		});

		button_Trey.addEventListener('click', () => {
			sendToLocalStorage.mode = CALC_MODES.MINIMIZED;
			this.storage.dataset = sendToLocalStorage;
			this.calcLoader.manage(CALC_MODES.MINIMIZED)
		});

		button_Close.addEventListener('click', () => {
			this.calcLoader.manage(CALC_MODES.CLOSED)		
			sendToLocalStorage.mode = CALC_MODES.CLOSED;
			this.storage.dataset = sendToLocalStorage;
		});

		button_OpenCalculator.addEventListener('click', () => {
			this.calcLoader.manage(CALC_MODES.DEFAULT);
			sendToLocalStorage.mode = CALC_MODES.DEFAULT;		
			this.storage.dataset = sendToLocalStorage;	
		});

		numbers.forEach(element => {
			element.addEventListener('click', () => {
				//console.log(this);
			//	button.type = element.dataset.value;
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
			this.disp.numberPress(element.dataset.value);
			this.isEnteredNewValue = true;
			this.isPressedSingleOperation = false;
		});
		});

		operationList.forEach(element => {
			element.addEventListener('click', () => {
				this.operation(element.innerHTML);
				smallDisplay.style.removeProperty('left');
				smallDisplay.style.right = 0;
			});
		});

		document.querySelector('.calc__button_get-result').addEventListener('click', () => {
			this.result();
		});

		button_addPoint.addEventListener('click', () => {
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
			this.disp.addPoint();
		});

		button_Clear.addEventListener('click', () => {
			this.clear();
		});

		button_Backspace.addEventListener('click', () => {
			this.operationsDisabled = false;
			this.disp.backspace();
		});

		button_Reverse.addEventListener('click', () => {
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
			this.singleOperation('NEGATE');
		});

		button_Pow.addEventListener('click', () => {
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
			this.singleOperation('POW');
		});

		button_Frac.addEventListener('click', () => {
			this.singleOperation('FRAC');
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
		});

		button_Sqrt.addEventListener('click', () => {
			this.singleOperation('SQRT');
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
		});

		button_Percent.addEventListener('click', () => {
			this.singleOperation('PERCENT');
			smallDisplay.style.removeProperty('left');
			smallDisplay.style.right = 0;
		});

		document.querySelector('.small-display__button_left').addEventListener('click', () => {
			if (smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
				smallDisplay.style.removeProperty('right');
				smallDisplay.style.left = 0;
				smallDisplay.style.textAlign = 'left';
			}
		});

		document.querySelector('.small-display__button_right').addEventListener('click', () => {
			if (smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
				smallDisplay.style.removeProperty('left');
				smallDisplay.style.right = 0;
				smallDisplay.style.textAlign = 'right';
			} 
		});

		buttonMemory_Save.addEventListener('click', () => {
			if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
				return;
			}

			this.memory.isActivatedMemoryButtons = true;
			sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
			this.storage.dataset = sendToLocalStorage;

			buttonMemory_Read.classList.remove("calc-add__button_disabled");
			buttonMemory_Clear.classList.remove("calc-add__button_disabled");
			buttonMemory_Open.classList.remove("calc-add__button_disabled");

			this.memory.addToMemory(display.innerHTML, display);

			sendToLocalStorage.memoryValues = this.memory.memoryValues;
			this.storage.dataset = sendToLocalStorage;
		});

		buttonMemory_Open.addEventListener('click', () => {	
			if (!this.memory.isActivatedMemoryButtons) {
				return;
			}


			memoryBoard.classList.toggle("visibility");
			buttonMemory_Clear.classList.toggle("calc-add__button_disabled");
			buttonMemory_Read.classList.toggle("calc-add__button_disabled");
			buttonMemory_Plus.classList.toggle("calc-add__button_disabled");
			buttonMemory_Minus.classList.toggle("calc-add__button_disabled");
			buttonMemory_Save.classList.toggle("calc-add__button_disabled");

			if (this.memory.isEmpty()) {
				this.memory.isActivatedMemoryButtons = false;
				buttonMemory_Read.classList.add("calc-add__button_disabled");
				buttonMemory_Clear.classList.add("calc-add__button_disabled");
				buttonMemory_Open.classList.add("calc-add__button_disabled");
				this.memory.isActivatedMemoryButtons = false;
				sendToLocalStorage.isActivatedMemoryButtons = '0';
				this.memory.memoryValues = {};
				this.memory.storageMemoryData = {};
				sendToLocalStorage.memoryValues = this.memory.memoryValues;

				this.storage.dataset = sendToLocalStorage;
			}

			if (this.memory.isOpenMemoryWindow) {
				this.memory.isOpenMemoryWindow = false;
				return;
			}

			this.memory.isOpenMemoryWindow = true;
		});

		buttonMemory_Plus.addEventListener('click', () => {	
			if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
				return;
			}

			this.memory.isActivatedMemoryButtons = true;
			sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
			this.storage.dataset = sendToLocalStorage;

			buttonMemory_Read.classList.remove("calc-add__button_disabled");
			buttonMemory_Clear.classList.remove("calc-add__button_disabled");
			buttonMemory_Open.classList.remove("calc-add__button_disabled");

			if (this.memory.isEmpty()) {
				this.memory.addToMemory(display.innerHTML, display);
			} else {
				let value =	document.querySelector('.memory__block').childNodes[0].innerHTML;
				let displayValue = display.innerHTML;
				let position = document.querySelector('.memory__block').dataset.position;

				this.memory.plus(value, displayValue, position);

				document.querySelector('.memory__block').childNodes[0].innerHTML = this.memory.memoryValues[position];
			}

			sendToLocalStorage.memoryValues = this.memory.memoryValues;
			this.storage.dataset = sendToLocalStorage;
		});

		buttonMemory_Minus.addEventListener('click', () => {
			if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
				return;
			}

			this.memory.isActivatedMemoryButtons = true;
			sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
			this.storage.dataset = sendToLocalStorage;

			buttonMemory_Read.classList.remove("calc-add__button_disabled");
			buttonMemory_Clear.classList.remove("calc-add__button_disabled");
			buttonMemory_Open.classList.remove("calc-add__button_disabled");

			if (this.memory.isEmpty()) {
				this.memory.addToMemory(display.innerHTML);
			} else {
				let value =	document.querySelector('.memory__block').childNodes[0].innerHTML;
				let displayValue = display.innerHTML;
				let position = document.querySelector('.memory__block').dataset.position;

				this.memory.minus(value, displayValue, position);

				document.querySelector('.memory__block').childNodes[0].innerHTML = this.memory.memoryValues[position];
			}

			sendToLocalStorage.memoryValues = this.memory.memoryValues;
			this.storage.dataset = sendToLocalStorage;
		});

		buttonMemory_Read.addEventListener('click', () => {		
			if (!this.memory.isActivatedMemoryButtons || this.memory.isOpenMemoryWindow) {
				return;
			}

			let position = document.querySelector('.memory__block').dataset.position;

			display.innerHTML = this.memory.memoryValues[position];
			this.enteredNewValue = true;
		});

		buttonMemory_Clear.addEventListener('click', () => {
			if (!this.memory.isActivatedMemoryButtons || this.memory.isOpenMemoryWindow) {
				return;
			}

			this.memory.isActivatedMemoryButtons = false;
			sendToLocalStorage.isActivatedMemoryButtons = '0';

			buttonMemory_Read.classList.add("calc-add__button_disabled");
			buttonMemory_Clear.classList.add("calc-add__button_disabled");
			buttonMemory_Open.classList.add("calc-add__button_disabled");
			memoryBoard.innerHTML = '';

			this.memory.memoryValues = {};
			this.memory.storageMemoryData = {};
			sendToLocalStorage.memoryValues = this.memory.memoryValues;

			this.storage.dataset = sendToLocalStorage;
		});
	}
}

export function disableButtons() {
	let resultButton = document.querySelector('.js_calc__button_get-result'),
	button_Sqrt = document.querySelector('.js_calc__button_sqrt'),
	button_Pow = document.querySelector('.js_calc__button_pow'),
	button_Frac = document.querySelector('.js_calc__button_frac'),
	button_Percent = document.querySelector('.js_calc__button_percent'),
	button_Reverse = document.querySelector('.js_calc__button_reverse'),
	operationList = document.querySelectorAll('.js_calc__button_operation'),
	button_addPoint = document.querySelector('.js_calc__button_add-point');

	button_Reverse.classList.remove('calc__button_enabled');
	button_Reverse.classList.add('calc__button_disabled');
	button_Percent.classList.remove('calc__button_enabled');
	button_Percent.classList.add('calc__button_disabled');
	button_Sqrt.classList.remove('calc__button_enabled');
	button_Sqrt.classList.add('calc__button_disabled');
	button_Pow.classList.remove('calc__button_enabled');
	button_Pow.classList.add('calc__button_disabled');
	button_Frac.classList.remove('calc__button_enabled');
	button_Frac.classList.add('calc__button_disabled');
	button_addPoint.classList.remove('calc__button_enabled');
	button_addPoint.classList.add('calc__button_disabled');
	resultButton.classList.remove('calc__button_enabled');
	resultButton.classList.add('calc__button_disabled');
	operationList.forEach((element) => {
		element.classList.remove('calc__button_enabled');
		element.classList.add('calc__button_disabled');
	});
}

export function activateButtons() {
	let resultButton = document.querySelector('.js_calc__button_get-result'),
	button_Sqrt = document.querySelector('.js_calc__button_sqrt'),
	button_Pow = document.querySelector('.js_calc__button_pow'),
	button_Frac = document.querySelector('.js_calc__button_frac'),
	button_Percent = document.querySelector('.js_calc__button_percent'),
	button_Reverse = document.querySelector('.js_calc__button_reverse'),
	operationList = document.querySelectorAll('.js_calc__button_operation'),
	button_addPoint = document.querySelector('.js_calc__button_add-point');

	button_Reverse.classList.add('calc__button_enabled');
	button_Reverse.classList.remove('calc__button_disabled');
	button_addPoint.classList.add('calc__button_enabled');
	button_addPoint.classList.remove('calc__button_disabled');
	resultButton.classList.add('calc__button_enabled');
	resultButton.classList.remove('calc__button_disabled');
	button_Percent.classList.add('calc__button_enabled');
	button_Percent.classList.remove('calc__button_disabled');
	button_Sqrt.classList.add('calc__button_enabled');
	button_Sqrt.classList.remove('calc__button_disabled');
	button_Pow.classList.add('calc__button_enabled');
	button_Pow.classList.remove('calc__button_disabled');
	button_Frac.classList.add('calc__button_enabled');
	button_Frac.classList.remove('calc__button_disabled');
	operationList.forEach((element) => {
		element.classList.add('calc__button_enabled');
		element.classList.remove('calc__button_disabled');
	});
}

export default new Calc();