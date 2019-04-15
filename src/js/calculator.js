import Display from './display';
import Operations from './operations';
import Memory from './memory';
import LocalStorage from './localStorage';
import { MAX_LENGTH_DISPLAY, STYLES, OPERATIONS, CALC_MODES, MESSAGES } from './const';
import projectInfo from '../../package.json';

class Calculator {
	constructor() {
		this.values = [];
		this.display = new Display();
		this.operations = new Operations();
		this.memory = new Memory({
			updateLSData: data => {
				this.localStorage.dataset = data;
			},
			getDisplayData: () => {
				return this.display.text;
			},
			isNeedNewValueToDisplay: () => {
				this.display.needNewValue = true;
			}
		});
		this.NAME = projectInfo.name;
		this.VERSION = projectInfo.version;
		this.localStorage = new LocalStorage(this.VERSION, this.NAME);
		this.isResultPressed = false;
		this.maxLength = MAX_LENGTH_DISPLAY;
		this.isOperationPressed = false;
		this.isNeedValueForProgressive = false;
		this.valueForProgressive = null;
		this.typeOperation = '';
		this.currentValue = null;
		this.sendToLocalStorage = {};
		this.$optionMenu = null;
		this.$buttonArea = null;
		this.$groupSmallDisplay = null;
		this.$openCalc = null;
		this.$calculator = null;
		this.$buttonMemoryClear = null;
		this.$buttonMemoryRead = null;
		this.$buttonMemoryOpen = null;
		this.$memoryBoard = null;
		this.$buttonMemoryPlus = null;
		this.$buttonMemoryMinus = null;
		this.$buttonMemorySave = null;
		this.$buttonMemoryOpen = null;
		this.$buttonOpen = null;
		this.$buttonTrey = null;
		this.$buttonClose = null;
		this.$buttonOpenCalculator = null;
		this.$calculator = null;
		this.$forDrag = null;
		this.$buttons = null;
	}

	clear() {
		if (this.operationsDisabled) {
			this.display.$display.style.fontSize = STYLES.NORMAL;
			this.toggleVisualStateButtons();
		}

		this.display.clear();
		this.isResultPressed = false;
		this.isOperationPressed = false;
		this.isNeedValueForProgressive = false;
		this.valueForProgressive = null;
		this.typeOperation = '';
		this.currentValue = null;
	}

	trimmer(temp) {
		temp = temp.toPrecision(6);
		temp = parseFloat(temp);

		if (String(temp).length > this.maxLength) {
			temp = temp.toPrecision(6);
		}
	
		return temp;
	}

	sendResult(operation, result) {
		this.checkException(operation, result);
		
		if (!this.operationsDisabled) {
			this.display.text = this.trimmer(result);
		}
	}

	percent() {
		if (this.operationsDisabled || this.currentValue === null) {
			return;
		}

		let result = this.operations.percent(this.currentValue, parseFloat(this.display.text));
		this.sendResult(OPERATIONS.PERCENT, result);
		this.display.sendToSmallDisplay(OPERATIONS.PERCENT, OPERATIONS.PERCENT, this.isPressedSingleOperation);
		this.isPressedSingleOperation = true;
		this.needNewValue = true;
	}


	singleOperation(operation) {
		if (this.operationsDisabled || operation === OPERATIONS.PERCENT && this.currentValue === null) {
			return;
		}

		this.needNewValue = true;
		this.display.sendToSmallDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation, this.isPressedSingleOperation);
		this.isPressedSingleOperation = true;

		if (this.currentValue === null) {
			this.currentValue = parseFloat(this.display.text);
		}

		let result = this.operations.sendOperation(operation, parseFloat(this.display.text));
		this.sendResult(operation, result);
	}

	operation(operation) {
		if (this.operationsDisabled) {
			return;
		}

		this.isNeedValueForProgressive = true;
		this.needNewValue = true;
		this.display.sendToSmallDisplay(OPERATIONS.LABEL_DEFAULT_OPERATION, operation, this.isPressedSingleOperation, this.isEnteredNewValue, this.isResultPressed);
		this.isResultPressed = false;
		this.isPressedSingleOperation = false;

		if (this.isOperationPressed) {
			if (this.isEnteredNewValue) {
				if (this.isResultPressed) {
					this.currentValue = this.operations.sendOperation(this.typeOperation, this.currentValue, this.valueForProgressive);
					this.sendResult(operation, this.currentValue);
				} else {
					this.currentValue = this.operations.sendOperation(this.typeOperation, this.currentValue, parseFloat(this.display.text));
					this.sendResult(operation, this.currentValue);
				}
			}

			this.isEnteredNewValue = false;
			this.typeOperation = operation;

			return;
		}

		this.currentValue = parseFloat(this.display.text);
		this.typeOperation = operation;
		this.isOperationPressed = true;
		this.isEnteredNewValue = false;
	}

	result() {
		if (this.operationsDisabled) {
			return;
		}
		
		this.display.SDclear();
		this.isResultPressed = true;

		if (this.isEnteredNewValue && !this.isOperationPressed) {
			this.currentValue = parseFloat(this.display.text);
		}

		this.isEnteredNewValue = false;
		this.isPressedSingleOperation = false;		
		this.isOperationPressed = false;		

		if (this.isNeedValueForProgressive) {
			this.valueForProgressive = parseFloat(this.display.text);
			this.isNeedValueForProgressive = false;
		} 		

		if (this.isResultPressed && this.currentValue !== null) {
			
			
			let result = this.operations.sendOperation(this.typeOperation, this.currentValue, this.valueForProgressive);
			this.sendResult(this.typeOperation, result);
			this.currentValue = parseFloat(this.display.text);
		}
	}

	checkException(operation, result) {
		switch (operation) {
			case OPERATIONS.PLUS, OPERATIONS.MINUS, OPERATIONS.MULTIPLY, OPERATIONS.NEGATE: {
				if (!isFinite(result)) {
					this.toggleVisualStateButtons();
					this.display.$display.style.fontSize = STYLES.SMALL;
					this.display.text = MESSAGES.OVERFLOW;
					this.operationsDisabled = true;
				}

				break;
			}
			case OPERATIONS.DIVIDE: {
				if (this.valueForProgressive === 0 || parseFloat(this.display.text) === 0) {
					this.operationsDisabled = true;
					this.toggleVisualStateButtons();
					this.display.$display.style.fontSize = STYLES.SMALL;
					this.display.text = MESSAGES.DIVIDE_BY_ZERO;
				}

				break;
			}
			case OPERATIONS.FRAC: {
				if (parseFloat(this.display.text) === 0) {
					this.operationsDisabled = true;
					this.toggleVisualStateButtons();
					this.display.$display.style.fontSize = STYLES.SMALL;
					this.display.text = MESSAGES.DIVIDE_BY_ZERO;
				}

				break;
			}
			case OPERATIONS.SQRT: {
				if (parseFloat(this.display.text) < 0) {
					this.toggleVisualStateButtons();
					this.display.$display.style.fontSize = STYLES.SMALL;
					this.display.text = MESSAGES.UNCORRECT_DATA;
					this.operationsDisabled = true;
				}

				break;
			}
		}
	}

	get template() {
		return `
		<div class="calculator js-calculator">
				<div class="index-menu">
					<p class="index-menu__title js-index-menu__title">Калькулятор</p>
					<div class="index-menu__button index-menu__button_trey js-index-menu__button_trey">–</div>
					<div class="index-menu__button index-menu__button_open js-index-menu__button_open">☐</div>
					<div class="index-menu__button index-menu__button_close js-index-menu__button_close">✕</div>
				</div>
				<div class="option-menu js-option-menu">
					<div class="option-menu__btn-menu">☰</div>
					<p class="option-menu__title">Обычный</p>
					<div class="option-menu__btn-journal"></div>
				</div>
				${this.display.template}
				<div class="button-area js-button-area">
					${this.memory.template.buttons}
					<div class="calc">
						<div class="calc__button calc__button_percent js-calc__button_percent" data-add="${OPERATIONS.ADDITIONAL.PERCENT}">%</div>
						<div class="calc__button calc__button_sqrt js-calc__button_sqrt" data-add="${OPERATIONS.ADDITIONAL.SQRT}">√</div>
						<div class="calc__button calc__button_pow js-calc__button_pow" data-add="${OPERATIONS.ADDITIONAL.POW}"><span class="span">x</span></div>
						<div class="calc__button calc__button_frac js-calc__button_frac" data-add="${OPERATIONS.ADDITIONAL.FRAC}"><span class="span">/</span></div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_disabled">CE</div>
						<div class="calc__button calc__button_clear js-calc__button_clear" data-add="${OPERATIONS.ADDITIONAL.CLEAR}">C</div>
						<div class="calc__button calc__button_backspace js-calc__button_backspace" data-add="${OPERATIONS.ADDITIONAL.BACKSPACE}"><-</div>
						<div class="calc__button calc__button_operation js-calc__button_operation" data-operation="${OPERATIONS.DIVIDE}">÷</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_number js-calc__button_number" data-value="7">7</div>
						<div class="calc__button calc__button_number js-calc__button_number" data-value="8">8</div>
						<div class="calc__button calc__button_number js-calc__button_number" data-value="9">9</div>
						<div class="calc__button calc__button_operation js-calc__button_operation" data-operation="${OPERATIONS.MULTIPLY}">*</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_number js-calc__button_number" data-value="4">4</div>
						<div class="calc__button calc__button_number js-calc__button_number" data-value="5">5</div>
						<div class="calc__button calc__button_number js-calc__button_number" data-value="6">6</div>
						<div class="calc__button calc__button_operation js-calc__button_operation" data-operation="${OPERATIONS.MINUS}">-</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_number js-calc__button_number" data-value="1">1</div>
						<div class="calc__button calc__button_number js-calc__button_number" data-value="2">2</div>
						<div class="calc__button calc__button_number js-calc__button_number" data-value="3">3</div>
						<div class="calc__button calc__button_operation js-calc__button_operation" data-operation="${OPERATIONS.PLUS}">+</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_reverse js-calc__button_reverse" data-add="${OPERATIONS.ADDITIONAL.REVERSE}">±</div>
						<div class="calc__button calc__button_number js-calc__button_number" data-value="0">0</div>
						<div class="calc__button calc__button_add-point js-calc__button_add-point" data-add="${OPERATIONS.ADDITIONAL.POINT}">,</div>
						<div class="calc__button calc__button_get-result js-calc__button_get-result" data-add="${OPERATIONS.ADDITIONAL.RESULT}">=</div>
					</div>
					${this.memory.template.memoryArea}
					</div>
				</div>
			</div> 
		`;
	}

	init(tag) {
		this.tagForInsert = tag;
		tag.innerHTML = this.template;
		this.setPropertiesDom();
		this.display.init();
		this.addEvents();
		this.loadStateFromLocalStorage();
	}

	setPropertiesDom() {
		this.$buttonOpen = document.querySelector('.js-index-menu__button_open');
		this.$buttonTrey = document.querySelector('.js-index-menu__button_trey');
		this.$buttonClose = document.querySelector('.js-index-menu__button_close');
		this.$buttonOpenCalculator = document.querySelector('.js-open-calculator');
		this.$calculator = document.querySelector('.js-calculator');
		this.$forDrag = document.querySelector('.js-index-menu__title');
		this.$buttons = document.querySelector('.js-button-area');
		this.$optionMenu = document.querySelector('.js-option-menu');
		this.$buttonArea = document.querySelector('.js-button-area');
		this.$groupSmallDisplay = document.querySelector('.js-group-small-display');
		this.$openCalc = document.querySelector('.js-open-calculator');
		this.$calculator = document.querySelector('.js-calculator');
		this.$buttonMemoryClear = document.querySelector('.js-calc-add__button_memory-clear');
		this.$buttonMemoryRead = document.querySelector('.js-calc-add__button_read');
		this.$buttonMemoryOpen = document.querySelector('.js-calc-add__button_memory');
		this.$memoryBoard = document.querySelector('.js-memory');
		this.$buttonMemoryPlus = document.querySelector('.js-calc-add__button_plus');
		this.$buttonMemoryMinus = document.querySelector('.js-calc-add__button_minus');
		this.$buttonMemorySave = document.querySelector('.js-calc-add__button_ms');
		this.$buttonMemoryOpen = document.querySelector('.js-calc-add__button_memory');
		this.$resultButton = document.querySelector('.js-calc__button_get-result');
		this.$buttonSqrt = document.querySelector('.js-calc__button_sqrt');
		this.$buttonPow = document.querySelector('.js-calc__button_pow');
		this.$buttonFrac = document.querySelector('.js-calc__button_frac');
		this.$buttonPercent = document.querySelector('.js-calc__button_percent');
		this.$buttonReverse = document.querySelector('.js-calc__button_reverse');
		this.$operationList = document.querySelectorAll('.js-calc__button_operation');
		this.$buttonaddPoint = document.querySelector('.js-calc__button_add-point');
	}

	loadStateFromLocalStorage() {
		this.defaultSettings = {
			mode: CALC_MODES.DEFAULT,
			x: (window.innerWidth - this.$calculator.offsetWidth) / window.innerWidth * 100 + '%',
			y: (window.innerHeight - this.$calculator.offsetHeight) / window.innerHeight * 100 + '%'
		};

		if (!this.localStorage.dataset) {
			this.localStorage.dataset = this.defaultSettings;
		}

		let storage = this.localStorage.dataset;

		for (let key in storage.memoryValues) {
			if (!storage.memoryValues.hasOwnProperty(key)) {
				continue;
			}

			this.memory.addToMemory(storage.memoryValues[key]);
		}

		if (storage.isActivatedMemoryButtons) {
			this.memory.isActivatedMemoryButtons = true;
			this.$buttonMemoryRead.classList.remove('calc-add__button_disabled');
			this.$buttonMemoryClear.classList.remove('calc-add__button_disabled');
			this.$buttonMemoryOpen.classList.remove('calc-add__button_disabled');
		} else {
			this.$buttonMemoryRead.classList.add('calc-add__button_disabled');
			this.$buttonMemoryClear.classList.add('calc-add__button_disabled');
			this.$buttonMemoryOpen.classList.add('calc-add__button_disabled');
		}

		this.$calculator.style.left = storage.x ? storage.x : this.defaultSettings.x;
		this.$calculator.style.top = storage.y ? storage.y : this.defaultSettings.y;
		this.manage(storage.mode);
	}

	manage(mode) {
		switch (mode) {
			case CALC_MODES.STANDART: {
				this.$optionMenu.style.display = 'flex';
				this.$groupSmallDisplay.style.display = 'flex';
				this.display.$display.style.display = 'block';
				this.$buttonArea.style.display = 'block';
				this.$calculator.style.height = '540px';
				break;
			}
			case CALC_MODES.MINIMIZED: {
				let offsetTop = this.$calculator.offsetTop;
				this.$optionMenu.style.display = 'none';
				this.$groupSmallDisplay.style.display = 'none';
				this.display.$display.style.display = 'none';
				this.$buttonArea.style.display = 'none';
				this.$calculator.style.height = '32px';
				this.$calculator.style.top = offsetTop;
				this.$calculator.style.bottom = 'auto';
				break;
			}
			case CALC_MODES.CLOSED: {
				this.$openCalc.style.display = 'block';
				this.$calculator.style.display = 'none';
				break;
			}
			case CALC_MODES.DEFAULT: {
				this.$openCalc.style.display = 'none';
				this.$optionMenu.style.display = 'flex';
				this.$groupSmallDisplay.style.display = 'flex';
				this.display.$display.style.display = 'block';
				this.$buttonArea.style.display = 'block';
				this.$calculator.style.height = '540px';
				this.$calculator.style.display = 'block';
				this.$calculator.style.left = this.defaultSettings.x;
				this.$calculator.style.top = this.defaultSettings.y;
				break;
			}
			default: {
				console.log(MESSAGES.ERROR.MODES);
				break;
			}
		}
	}

	addFunctionSwitcher = (typeFunction) => {
		switch (typeFunction) {
			case OPERATIONS.ADDITIONAL.PLUS_MINUS: {
				this.buttonReverse();
				break;
			}
			case OPERATIONS.ADDITIONAL.PERCENT: {
				this.buttonPercent();
				break;
			}
			case OPERATIONS.ADDITIONAL.SQRT: {
				this.buttonSqrt();
				break;
			}
			case OPERATIONS.ADDITIONAL.POW: {
				this.buttonPow();
				break;
			}
			case OPERATIONS.ADDITIONAL.FRAC: {
				this.buttonFrac();
				break;
			}
			case OPERATIONS.ADDITIONAL.CLEAR: {
				this.buttonClear();
				break;
			}
			case OPERATIONS.ADDITIONAL.BACKSPACE: {
				this.buttonBackspace();
				break;
			}
			case OPERATIONS.ADDITIONAL.REVERSE: {
				this.buttonReverse();
				break;
			}
			case OPERATIONS.ADDITIONAL.POINT: {
				this.buttonaddPoint();
				break;
			}
			case OPERATIONS.ADDITIONAL.RESULT: {
				this.resultButton();
				break;
			}
			case OPERATIONS.ADDITIONAL.MCLEAR: {
				this.buttonMemoryClear();
				break;
			}
			case OPERATIONS.ADDITIONAL.MREAD: {
				this.buttonMemoryRead();
				break;
			}
			case OPERATIONS.ADDITIONAL.MPLUS: {
				this.buttonMemoryPlus();
				break;
			}
			case OPERATIONS.ADDITIONAL.MMINUS: {
				this.buttonMemoryMinus();
				break;
			}
			case OPERATIONS.ADDITIONAL.MSAVE: {
				this.buttonMemorySave();
				break;
			}
			case OPERATIONS.ADDITIONAL.MEMORY: {
				this.buttonMemoryOpen();
				break;
			}
		}
	};

	buttonsEventSwitcher = (event) => {
		for (let key in event.target.dataset) {
			switch (key) {
				case OPERATIONS.NAME_OF_DATASET_ATTRIBUTE.VALUE: {
					if (this.operationsDisabled) {
						this.operationsDisabled = false;
						this.display.clear();
						this.toggleVisualStateButtons();
					}
					this.numberPress(event.target.dataset.value);

					break;
				}
				case OPERATIONS.NAME_OF_DATASET_ATTRIBUTE.OPERATION: {
					this.operation(event.target.dataset.operation);

					break;
				}
				case OPERATIONS.NAME_OF_DATASET_ATTRIBUTE.ADDITIONAL: {
					this.addFunctionSwitcher(event.target.dataset.add);
					
					break;
				}
			}
		}
	};

	updateSmallDisplay() {
		if (this.isPressedSingleOperation && !this.isOperationPressed) {
			this.display.SDclear();
		}

		if (this.isPressedSingleOperation && this.isOperationPressed) {
			this.display.SDclearLastValue();
		}
	}

	numberPress = (number) => {
		this.updateSmallDisplay();
		this.isEnteredNewValue = true;
		this.display.$display.style.fontSize = STYLES.NORMAL;
		this.isPressedSingleOperation = false;

		if ((this.display.text === '0' || (this.needNewValue) || (this.isResultPressed && this.display.text !== '0.') || this.display.text === MESSAGES.DIVIDE_BY_ZERO)) {
			this.display.text = number;
			this.needNewValue = false;
			this.isResultPressed = false;

			return;
		}

		if (this.display.text === '0.' && !this.needNewValue) {
			this.display.text += number;
			this.isResultPressed = false;

			return;
		}

		if (String(this.display.text).length >= this.maxLength) {
			return;
		}

		this.display.text += number;
	}

	calcPosOnResize = () => {
		if ((this.$calculator.offsetLeft + this.$calculator.clientWidth) > window.innerWidth) {
			this.sendToLocalStorage.x = `${(window.innerWidth - this.$calculator.clientWidth) / window.innerWidth * 100}%`;
			this.$calculator.style.left = this.sendToLocalStorage.x;
		}

		if ((this.$calculator.offsetTop + this.$calculator.clientHeight) > window.innerHeight) {
			this.sendToLocalStorage.y = `${(window.innerHeight - this.$calculator.clientHeight) / window.innerHeight * 100}%`;
			this.$calculator.style.top = this.sendToLocalStorage.y;
		}

		if (this.$calculator.offsetLeft < 0) {
			this.sendToLocalStorage.x = '0%';
			this.$calculator.style.left = this.sendToLocalStorage.x;
		}

		if (this.$calculator.offsetTop < 0) {
			this.sendToLocalStorage.y = '0%';
			this.$calculator.style.top = this.sendToLocalStorage.y;
		}

		this.localStorage.dataset = this.sendToLocalStorage;
	};

	calculatorDragAndDrop = (e) => {
		let moveAt = (e) => {
			if ((e.pageX - shiftX + this.$calculator.clientWidth) > window.innerWidth) {
				this.$calculator.style.left = `${(window.innerWidth - this.$calculator.clientWidth) / window.innerWidth * 100}%`;
			} else {
				this.$calculator.style.left = `${(e.pageX - shiftX) / window.innerWidth * 100}%`;
			}

			if ((e.pageY - shiftY + this.$calculator.clientHeight) > window.innerHeight) {
				this.$calculator.style.top = `${(window.innerHeight - this.$calculator.clientHeight) / window.innerHeight * 100}%`;
			} else {
				this.$calculator.style.top = `${(e.pageY - shiftY) / window.innerHeight * 100}%`;
			}

			if ((e.pageY - shiftY) <= 0) {
				this.$calculator.style.top = 0;
			}

			if ((e.pageX - shiftX) <= 0) {
				this.$calculator.style.left = 0;
			}

			this.sendToLocalStorage.x = this.$calculator.style.left;
			this.sendToLocalStorage.y = this.$calculator.style.top;

			if (this.localStorage.dataset.mode === CALC_MODES.DEFAULT) {
				this.sendToLocalStorage.mode = CALC_MODES.STANDART;
			}

			this.localStorage.dataset = this.sendToLocalStorage;
		};

		this.$calculator.style.position = 'absolute';
		this.$calculator.style.bottom = 'auto';
		this.$calculator.style.right = 'auto';
		document.body.appendChild(this.$calculator);
		this.tagForInsert.innerHTML = '';
		let shiftX = e.pageX - this.$calculator.offsetLeft;
		let shiftY = e.pageY - this.$calculator.offsetTop;
		moveAt(e);
		this.$calculator.style.zIndex = 1000;

		document.onmousemove = function (e) {
			if (window.innerWidth < 350) {
				return false;
			}
			moveAt(e);
		};

		this.$calculator.onmouseup = () => {
			document.onmousemove = null;
			this.$calculator.onmouseup = null;
		};
	};

	calculatorDragStart = () => {
		return false;
	};

	resultButton = () => {
		this.result();
	};

	buttonaddPoint = () => {
		if (this.operationsDisabled) {
			return;
		}

		this.updateSmallDisplay();

		if (this.display.isResultPressed ||
			this.display.text.indexOf('.') === -1 && this.needNewValue ||
			this.display.text.indexOf('.') === -1 && this.isResultPressed ||
			this.display.text.indexOf('.') !== -1 && this.needNewValue ||
			this.display.text.indexOf('.') !== -1 && this.isResultPressed) {

			this.display.text = '0.';
			this.needNewValue = false;

			return;
		}

		if (this.display.text.indexOf('.') === -1) {
			this.display.text += '.';
		}
	};

	buttonClear = () => {
		this.clear();
	};

	buttonBackspace = () => {
		if (!this.operationsDisabled && this.isResultPressed || this.isOperationPressed) {
			return;
		}

		this.operationsDisabled = false;

		if (this.display.text.indexOf('e') !== -1 || this.isPressedSingleOperation) {
			return;
		}

		if (this.display.text.length === 2 && this.display.text[0] === '-' || this.display.text.length === 1) {
			this.display.text = '0';

			return;
		}

		if (this.display.text === MESSAGES.DIVIDE_BY_ZERO || this.display.text === MESSAGES.OVERFLOW || this.display.text === MESSAGES.UNCORRECT_DATA) {
			this.display.text = '';
			this.display.$display.style.fontSize = STYLES.NORMAL;
			this.display.text = '0';
			this.updateStateDisabledButtons();

			return;
		}

		this.display.text = this.display.text.slice(0, this.display.text.length - 1);
	};

	buttonReverse = () => {
		if (this.operationsDisabled || isNaN(parseFloat(this.display.text))) {
			return;
		}

		this.isPressedSingleOperation = true;
		this.valueForProgressive = this.operations.sendOperation(OPERATIONS.NEGATE, this.display.text);

		if (this.display.text === '0' || this.isResultPressed) {
			this.isEnteredNewValue = true;
			this.needNewValue = true;
			this.display.sendToSmallDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, OPERATIONS.NEGATE);
		}

		if (this.display.text === '0') {
			return;
		}

		if (this.display.text.indexOf('-') === -1) {
			this.display.text = `-${this.display.text}`;

			return;
		}

		this.display.text = this.display.text.substr(1, this.display.text.length - 1);
	};

	buttonPow = () => {
		this.singleOperation(OPERATIONS.POW);
	};

	buttonFrac = () => {
		this.singleOperation(OPERATIONS.FRAC);
	};

	buttonSqrt = () => {
		this.singleOperation(OPERATIONS.SQRT);
	};

	buttonPercent = () => {
		this.percent();
	};

	buttonMemorySave = () => {
		if (this.memory.isOpenMemoryWindow || !isFinite(parseFloat(this.display.text))) {
			return;
		}

		this.memory.isActivatedMemoryButtons = true;
		this.sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
		this.localStorage.dataset = this.sendToLocalStorage;

		this.$buttonMemoryRead.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		this.memory.addToMemory(this.display.text, this.display.$display);
		this.sendToLocalStorage.memoryValues = this.memory.memoryValues;
		this.localStorage.dataset = this.sendToLocalStorage;
	};

	buttonMemoryOpen = () => {
		if (!this.memory.isActivatedMemoryButtons) {
			return;
		}

		this.$memoryBoard.classList.toggle('visibility');
		this.$buttonMemoryClear.classList.toggle('calc-add__button_disabled');
		this.$buttonMemoryRead.classList.toggle('calc-add__button_disabled');
		this.$buttonMemoryPlus.classList.toggle('calc-add__button_disabled');
		this.$buttonMemoryMinus.classList.toggle('calc-add__button_disabled');
		this.$buttonMemorySave.classList.toggle('calc-add__button_disabled');

		if (this.memory.isEmpty()) {
			this.memory.isActivatedMemoryButtons = false;
			this.$buttonMemoryRead.classList.add('calc-add__button_disabled');
			this.$buttonMemoryClear.classList.add('calc-add__button_disabled');
			this.$buttonMemoryOpen.classList.add('calc-add__button_disabled');
			this.memory.isActivatedMemoryButtons = false;
			this.sendToLocalStorage.isActivatedMemoryButtons = '0';
			this.memory.storageMemoryData = {};
			this.sendToLocalStorage.memoryValues = {};
			this.localStorage.dataset = this.sendToLocalStorage;
		}

		if (this.memory.isOpenMemoryWindow) {
			this.memory.isOpenMemoryWindow = false;
			return;
		}

		this.memory.isOpenMemoryWindow = true;
	};

	buttonMemoryPlus = () => {
		if (this.memory.isOpenMemoryWindow || !isFinite(parseFloat(this.display.text))) {
			return;
		}

		this.memory.isActivatedMemoryButtons = true;
		this.sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
		this.localStorage.dataset = this.sendToLocalStorage;

		this.$buttonMemoryRead.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		if (this.memory.isEmpty()) {
			this.memory.addToMemory(this.display.text, this.display.$display);
		} else {
			let memoryBlock = document.querySelector('.memory__block');

			let value = memoryBlock.childNodes[0].innerHTML;
			let displayValue = this.display.text;
			let position = memoryBlock.dataset.position;

			this.memory.plus(value, displayValue, position);

			memoryBlock.childNodes[0].innerHTML = this.memory.memoryValues[position];
		}

		this.sendToLocalStorage.memoryValues = this.memory.memoryValues;
		this.localStorage.dataset = this.sendToLocalStorage;
	};

	buttonMemoryMinus = () => {
		if (this.memory.isOpenMemoryWindow || !isFinite(parseFloat(this.display.text))) {
			return;
		}

		this.memory.isActivatedMemoryButtons = true;
		this.sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
		this.localStorage.dataset = this.sendToLocalStorage;

		this.$buttonMemoryRead.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		if (this.memory.isEmpty()) {
			this.memory.addToMemory(this.display.text);
		} else {
			let memoryBlock = document.querySelector('.memory__block');

			let value = memoryBlock.childNodes[0].innerHTML;
			let displayValue = this.display.text;
			let position = memoryBlock.dataset.position;

			this.memory.minus(value, displayValue, position);

			memoryBlock.childNodes[0].innerHTML = this.memory.memoryValues[position];
		}

		this.sendToLocalStorage.memoryValues = this.memory.memoryValues;
		this.localStorage.dataset = this.sendToLocalStorage;
	};

	buttonMemoryRead = () => {
		if (!this.memory.isActivatedMemoryButtons || this.memory.isOpenMemoryWindow) {
			return;
		}

		let position = document.querySelector('.memory__block').dataset.position;

		this.display.text = this.memory.memoryValues[position];
		this.enteredNewValue = true;
	};

	buttonMemoryClear = () => {
		if (!this.memory.isActivatedMemoryButtons || this.memory.isOpenMemoryWindow) {
			return;
		}

		this.memory.isActivatedMemoryButtons = false;
		this.sendToLocalStorage.isActivatedMemoryButtons = '0';

		this.$buttonMemoryRead.classList.add('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.add('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.add('calc-add__button_disabled');
		this.$memoryBoard.innerHTML = '';

		this.memory.storageMemoryData = {};
		this.sendToLocalStorage.memoryValues = {};

		this.localStorage.dataset = this.sendToLocalStorage;
	};

	buttonTrey = () => {
		this.sendToLocalStorage.mode = CALC_MODES.MINIMIZED;
		this.localStorage.dataset = this.sendToLocalStorage;
		this.manage(CALC_MODES.MINIMIZED);
	};

	buttonOpen = () => {
		this.sendToLocalStorage.mode = CALC_MODES.STANDART;
		this.localStorage.dataset = this.sendToLocalStorage;
		this.manage(CALC_MODES.STANDART);
	};

	buttonClose = () => {
		this.manage(CALC_MODES.CLOSED);
		this.sendToLocalStorage.mode = CALC_MODES.CLOSED;
		this.localStorage.dataset = this.sendToLocalStorage;
		this.sendToRecycle();
	};

	buttonOpenCalculator = () => {
		this.init(this.tagForInsert);
		this.manage(CALC_MODES.DEFAULT);
		this.sendToLocalStorage.mode = CALC_MODES.DEFAULT;
		this.localStorage.dataset = this.sendToLocalStorage;
	};

	addEvents() {
		this.$buttons.addEventListener('click', this.buttonsEventSwitcher);
		window.addEventListener('resize', this.calcPosOnResize);
		this.$forDrag.addEventListener('mousedown', this.calculatorDragAndDrop);
		this.$calculator.addEventListener('dragstart', this.calculatorDragStart);
		this.$buttonTrey.addEventListener('click', this.buttonTrey);
		this.$buttonOpen.addEventListener('click', this.buttonOpen);
		this.$buttonClose.addEventListener('click', this.buttonClose.bind(this));
		this.$buttonOpenCalculator.addEventListener('click', this.buttonOpenCalculator.bind(this));
	}

	sendToRecycle() {
		this.$buttons.removeEventListener('click', this.buttonsEventSwitcher);
		window.removeEventListener('resize', this.calcPosOnResize);
		this.$forDrag.removeEventListener('mousedown', this.calculatorDragAndDrop);
		this.$calculator.removeEventListener('dragstart', this.calculatorDragStart);
		this.$buttonTrey.removeEventListener('click', this.buttonTrey);
		this.$buttonOpen.removeEventListener('click', this.buttonOpen);
		this.$buttonClose.removeEventListener('click', this.buttonClose);
		this.display.sendToRecycle();

		for (let i = 0; i < document.body.children.length; i++) {
			if (document.body.children[i].classList.contains('js-calculator')) {
				document.body.removeChild(document.body.children[i]);
			}
		}

		this.tagForInsert.innerHTML = '';
	}

	toggleVisualStateButtons() {
		this.$buttonReverse.classList.toggle('calc__button_disabled');
		this.$buttonPercent.classList.toggle('calc__button_disabled');
		this.$buttonSqrt.classList.toggle('calc__button_disabled');
		this.$buttonPow.classList.toggle('calc__button_disabled');
		this.$buttonFrac.classList.toggle('calc__button_disabled');
		this.$buttonaddPoint.classList.toggle('calc__button_disabled');
		this.$resultButton.classList.toggle('calc__button_disabled');
		this.$operationList.forEach((element) => {
			element.classList.toggle('calc__button_disabled');
		});
	}
}

export default Calculator;