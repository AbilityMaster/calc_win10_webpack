import Display from './display';
import Operations from './operations';
import Memory from './memory';
import LocalStorage from './localStorage';
import { MAX_WIDTH_DISPLAY, MAX_LENGTH_DISPLAY, STYLES, OPERATIONS, CALC_MODES, MESSAGES } from './const';
import projectInfo from '../../package.json';

class Calculator {
	constructor() {
		this.disp = new Display();
		this.operations = new Operations();
		this.memory = new Memory();
		this.NAME = projectInfo.name;
		this.VERSION = projectInfo.version;
		this.localStorage = new LocalStorage(this.VERSION, this.NAME);
		this.isResultPressed = false;
		this.maxLength = MAX_LENGTH_DISPLAY;
		this.isOperationPressed = false;
		this.isNeedValueForProgressive = false;
		this.isEnteredNewValue = false;
		this.typeOperation = '';
		this.currentValue = null;
	}
	
	clear() {
		if (this.operationsDisabled) {
			this.disp.display.style.fontSize = STYLES.NORMAL;
			this.disp.operationsDisabled = false;
			this.toggleVisualStateButtons();
		}

		this.disp.displayClear();
		this.isResultPressed = false;
		this.isOperationPressed = false;
		this.isNeedValueForProgressive = false,
			this.isEnteredNewValue = false;
		this.typeOperation = '';
		this.currentValue = null;
	}

	trimmer(temp) {
		temp = parseFloat(temp);
		if (String(temp).length > this.maxLength) {
			temp = temp.toPrecision(6);
		}

		return temp;
	}

	checkForFinite(temp) {
		if (!isFinite(temp)) {
			this.toggleVisualStateButtons();
			this.disp.display.style.fontSize = STYLES.SMALL;
			this.disp.text = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;

			return false;
		} else {
			return true;
		}
	}

	sendResult(operation, result) {
		if (this.checkException(operation, result)) {
			this.disp.text = this.trimmer(result);
		}
	}

	singleOperation(operation) {
		if (this.operationsDisabled) {
			return;
		}

		if (operation === OPERATIONS.PERCENT && this.currentValue === null) {
			return;
		}

		this.disp.smallDisplay.style.removeProperty('left');
		this.disp.smallDisplay.style.right = 0;

		this.disp.sendToStatusDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation);
		this.disp.isPressedSingleOperation = true;
		this.disp.needNewValue = true;

		this.disp.isEnteredNewValue = this.isEnteredNewValue = true;

		if (operation === OPERATIONS.PERCENT) {
			let result = this.operations.percent(this.currentValue, parseFloat(this.disp.text));
			this.sendResult(operation, result);

			return;
		}

		if (this.currentValue === null) {
			this.currentValue = parseFloat(this.disp.text);
		}

		let result = this.operations.sendOperation(operation, parseFloat(this.disp.text));
		this.sendResult(operation, result);
	}

	result() {
		if (this.operationsDisabled) {
			return;
		}

		this.disp.smallDisplay.innerHTML = '';
		this.isResultPressed = true;
		this.isEnteredNewValue = this.disp.isEnteredNewValue = true;

		if (this.isNeedValueForProgressive) {
			this.valueForProgressive = parseFloat(this.disp.text);
			this.isNeedValueForProgressive = false;
		}

		if (this.isResultPressed && this.currentValue !== null) {
			let result = this.operations.sendOperation(this.typeOperation, this.currentValue, this.valueForProgressive);
			this.sendResult(this.typeOperation, result);
			this.currentValue = parseFloat(this.disp.text);
		}
		this.isOperationPressed = false;

	}

	checkException(operation, result) {
		switch (operation) {
			case OPERATIONS.PLUS, OPERATIONS.MINUS, OPERATIONS.MULTIPLY, OPERATIONS.NEGATE: {
				if (!isFinite(result)) {
					this.toggleVisualStateButtons();
					this.disp.display.style.fontSize = STYLES.SMALL;
					this.disp.text = MESSAGES.OVERFLOW;
					this.operationsDisabled = true;
				}

				break;
			}
			case OPERATIONS.DIVIDE: {
				if (this.valueForProgressive === 0 || parseFloat(this.disp.text) === 0) {
					this.operationsDisabled = true;
					this.toggleVisualStateButtons();
					this.disp.display.style.fontSize = STYLES.SMALL;
					this.disp.text = MESSAGES.DIVIDE_BY_ZERO;
				}

				break;
			}
			case OPERATIONS.FRAC: {
				if (parseFloat(this.disp.text) === 0) {
					this.operationsDisabled = true;
					this.toggleVisualStateButtons();
					this.disp.display.style.fontSize = STYLES.SMALL;
					this.disp.text = MESSAGES.DIVIDE_BY_ZERO;
				}

				break;
			}
			case OPERATIONS.SQRT: {
				if (parseFloat(this.disp.text) < 0) {
					this.toggleVisualStateButtons();
					this.disp.display.style.fontSize = STYLES.SMALL;
					this.disp.text = MESSAGES.UNCORRECT_DATA;
					this.operationsDisabled = true;
				}

				break;
			}
		}

		if (this.operationsDisabled) {
			return false;
		}

		return true;
	}

	operation(operation) {
		if (this.operationsDisabled) {
			return;
		}

		this.isResultPressed = false;
		this.disp.sendToStatusDisplay(OPERATIONS.LABEL_DEFAULT_OPERATION, operation);
		this.disp.isPressedSingleOperation = false;
		this.isNeedValueForProgressive = true;

		if (this.isOperationPressed) {
			if (this.isEnteredNewValue) {
				if (this.isResultPressed) {
					let result = this.currentValue = this.operations.sendOperation(this.typeOperation, this.currentValue, this.valueForProgressive);
					this.sendResult(operation, result);
				} else {
					let result = this.currentValue = this.operations.sendOperation(this.typeOperation, this.currentValue, parseFloat(this.disp.text));
					this.sendResult(operation, result);
				}
				this.isEnteredNewValue = this.disp.isEnteredNewValue = false;
			}
			this.typeOperation = operation;
		} else {
			this.currentValue = parseFloat(this.disp.text);
			this.typeOperation = operation;
			this.isOperationPressed = true;
			this.isEnteredNewValue = this.disp.isEnteredNewValue = false;
		}

		this.disp.needNewValue = true;
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
				${this.disp.template}
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
		this.sendToLocalStorage = {};
		this.disp.init();
		this.addEvents();
		this.loadStateFromLocalStorage();
	}

	loadStateFromLocalStorage() {
		this.defaultSettings = {
			mode: CALC_MODES.DEFAULT,
			x: (window.innerWidth - document.querySelector('.js-calculator').offsetWidth) / window.innerWidth * 100 + '%',
			y: (window.innerHeight - document.querySelector('.js-calculator').offsetHeight) / window.innerHeight * 100 + '%'
		};

		let buttonMemory_Clear = document.querySelector('.js-calc-add__button_memory-clear'),
			buttonMemory_Read = document.querySelector('.js-calc-add__button_read'),
			buttonMemory_Open = document.querySelector('.js-calc-add__button_memory'),
			calculator = document.querySelector('.js-calculator');

		if (!this.localStorage.dataset) {
			this.localStorage.dataset = this.defaultSettings;
		}

		let storage = this.localStorage.dataset;

		for (let key in storage.memoryValues) {
			if (!storage.memoryValues.hasOwnProperty(key)) continue;
			this.memory.addToMemory(storage.memoryValues[key]);
		}

		if (storage.isActivatedMemoryButtons) {
			this.memory.isActivatedMemoryButtons = true;
			buttonMemory_Read.classList.remove('calc-add__button_disabled');
			buttonMemory_Clear.classList.remove('calc-add__button_disabled');
			buttonMemory_Open.classList.remove('calc-add__button_disabled');
		} else {
			buttonMemory_Read.classList.add('calc-add__button_disabled');
			buttonMemory_Clear.classList.add('calc-add__button_disabled');
			buttonMemory_Open.classList.add('calc-add__button_disabled');
		}

		calculator.style.left = storage.x ? storage.x : this.defaultSettings.x;
		calculator.style.top = storage.y ? storage.y : this.defaultSettings.y;
		this.manage(storage.mode);
	}

	manage(mode) {
		let optionMenu = document.querySelector('.js-option-menu'),
			buttonArea = document.querySelector('.js-button-area'),
			groupSmallDisplay = document.querySelector('.js-group-small-display'),
			openCalc = document.querySelector('.js-open-calculator'),
			display = document.querySelector('.js-display'),
			calculator = document.querySelector('.js-calculator');

		switch (mode) {
			case CALC_MODES.STANDART: {
				optionMenu.style.display = 'flex';
				groupSmallDisplay.style.display = 'flex';
				display.style.display = 'block';
				buttonArea.style.display = 'block';
				calculator.style.height = '540px';
				break;
			}
			case CALC_MODES.MINIMIZED: {
				let offsetTop = calculator.offsetTop;
				optionMenu.style.display = 'none';
				groupSmallDisplay.style.display = 'none';
				display.style.display = 'none';
				buttonArea.style.display = 'none';
				calculator.style.height = '32px';
				calculator.style.top = offsetTop;
				calculator.style.bottom = 'auto';
				break;
			}
			case CALC_MODES.CLOSED: {
				openCalc.style.display = 'block';
				calculator.style.display = 'none';
				break;
			}
			case CALC_MODES.DEFAULT: {
				openCalc.style.display = 'none';
				optionMenu.style.display = 'flex';
				groupSmallDisplay.style.display = 'flex';
				display.style.display = 'block';
				buttonArea.style.display = 'block';
				calculator.style.height = '540px';
				calculator.style.display = 'block';
				calculator.style.left = this.defaultSettings.x;
				calculator.style.top = this.defaultSettings.y;
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
			case '±': {
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
	}

	buttonsEventSwitcher = (event) => {
		for (let key in event.target.dataset) {
			switch (key) {
				case OPERATIONS.NAME_OF_DATASET_ATTRIBUTE.VALUE: {
					this.disp.smallDisplay.style.removeProperty('left');
					this.disp.smallDisplay.style.right = 0;
					this.disp.numberPress(event.target.dataset.value);
					this.isEnteredNewValue = true;
					this.disp.isPressedSingleOperation = false;
					break;
				}
				case OPERATIONS.NAME_OF_DATASET_ATTRIBUTE.OPERATION: {
					this.operation(event.target.dataset.operation);
					this.disp.smallDisplay.style.removeProperty('left');
					this.disp.smallDisplay.style.right = 0;
					break;
				}
				case OPERATIONS.NAME_OF_DATASET_ATTRIBUTE.ADDITIONAL: {
					this.addFunctionSwitcher(event.target.dataset.add);
					break;
				}
			}
		}
	}

	calcPosOnResize = () => {
		let calculator = document.querySelector('.js-calculator');

		if ((calculator.offsetLeft + calculator.clientWidth) > window.innerWidth) {
			this.sendToLocalStorage.x = `${(window.innerWidth - calculator.clientWidth) / window.innerWidth * 100}%`;
			calculator.style.left = this.sendToLocalStorage.x;
		}
		if ((calculator.offsetTop + calculator.clientHeight) > window.innerHeight) {
			this.sendToLocalStorage.y = `${(window.innerHeight - calculator.clientHeight) / window.innerHeight * 100}%`;
			calculator.style.top = this.sendToLocalStorage.y;
		}
		if (calculator.offsetLeft < 0) {
			this.sendToLocalStorage.x = '0%';
			calculator.style.left = this.sendToLocalStorage.x;
		}
		if (calculator.offsetTop < 0) {
			this.sendToLocalStorage.y = '0%';
			calculator.style.top = this.sendToLocalStorage.y;
		}
		this.localStorage.dataset = this.sendToLocalStorage;
	}

	calculatorDragAndDrop = (e) => {
		let calculator = document.querySelector('.js-calculator');

		let moveAt = (e) => {
			if ((e.pageX - shiftX + calculator.clientWidth) > window.innerWidth) {
				calculator.style.left = `${(window.innerWidth - calculator.clientWidth) / window.innerWidth * 100}%`;
			} else {
				calculator.style.left = `${(e.pageX - shiftX) / window.innerWidth * 100}%`;
			}

			if ((e.pageY - shiftY + calculator.clientHeight) > window.innerHeight) {
				calculator.style.top = `${(window.innerHeight - calculator.clientHeight) / window.innerHeight * 100}%`;
			} else {
				calculator.style.top = `${(e.pageY - shiftY) / window.innerHeight * 100}%`;
			}

			if ((e.pageY - shiftY) <= 0) {
				calculator.style.top = 0;
			}

			if ((e.pageX - shiftX) <= 0) {
				calculator.style.left = 0;
			}

			this.sendToLocalStorage.x = calculator.style.left;
			this.sendToLocalStorage.y = calculator.style.top;

			if (this.localStorage.dataset.mode === CALC_MODES.DEFAULT) {
				this.sendToLocalStorage.mode = CALC_MODES.STANDART;
			}

			this.localStorage.dataset = this.sendToLocalStorage;
		};

		calculator.style.position = 'absolute';
		calculator.style.bottom = 'auto';
		calculator.style.right = 'auto';
		document.body.appendChild(calculator);
		this.tagForInsert.innerHTML = '';
		let shiftX = e.pageX - calculator.offsetLeft;
		let shiftY = e.pageY - calculator.offsetTop;
		moveAt(e);
		calculator.style.zIndex = 1000;

		document.onmousemove = function (e) {
			if (window.innerWidth < 350) {
				return false;
			}
			moveAt(e);
		};

		calculator.onmouseup = function () {
			document.onmousemove = null;
			calculator.onmouseup = null;
		};
	}

	calculatorDragStart = () => {
		return false;
	}

	resultButton = () => {
		this.result();
	}

	buttonaddPoint = () => {
		this.disp.smallDisplay.style.removeProperty('left');
		this.disp.smallDisplay.style.right = 0;
		this.disp.addPoint();
	}

	buttonClear = () => {
		this.clear();
	}

	buttonBackspace = () => {
		this.operationsDisabled = false;
		this.disp.backspace();
	}

	buttonReverse = () => {
		this.singleOperation(OPERATIONS.NEGATE);
	}

	buttonPow = () => {
		this.singleOperation(OPERATIONS.POW);
	}

	buttonFrac = () => {
		this.singleOperation(OPERATIONS.FRAC);
	}

	buttonSqrt = () => {
		this.singleOperation(OPERATIONS.SQRT);
	}

	buttonPercent = () => {
		this.singleOperation(OPERATIONS.PERCENT);
	}

	buttonLeft = () => {
		if (this.disp.smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
			this.disp.smallDisplay.style.removeProperty('right');
			this.disp.smallDisplay.style.left = 0;
			this.disp.smallDisplay.style.textAlign = 'left';
		}
	}

	buttonRight = () => {
		if (this.disp.smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
			this.disp.smallDisplay.style.removeProperty('left');
			this.disp.smallDisplay.style.right = 0;
			this.disp.smallDisplay.style.textAlign = 'right';
		}
	}

	buttonMemorySave = () => {
		if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
			return;
		}

		let buttonMemoryClear = document.querySelector('.js-calc-add__button_memory-clear'),
			buttonMemoryRead = document.querySelector('.js-calc-add__button_read'),
			buttonMemoryOpen = document.querySelector('.js-calc-add__button_memory');

		this.memory.isActivatedMemoryButtons = true;
		this.sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
		this.localStorage.dataset = this.sendToLocalStorage;

		buttonMemoryRead.classList.remove('calc-add__button_disabled');
		buttonMemoryClear.classList.remove('calc-add__button_disabled');
		buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		this.memory.addToMemory(this.disp.text, this.disp.display);
		this.sendToLocalStorage.memoryValues = this.memory.memoryValues;
		this.localStorage.dataset = this.sendToLocalStorage;
	}

	buttonMemoryOpen = () => {
		if (!this.memory.isActivatedMemoryButtons) {
			return;
		}

		let memoryBoard = document.querySelector('.js-memory'),
			buttonMemoryClear = document.querySelector('.js-calc-add__button_memory-clear'),
			buttonMemoryRead = document.querySelector('.js-calc-add__button_read'),
			buttonMemoryPlus = document.querySelector('.js-calc-add__button_plus'),
			buttonMemoryMinus = document.querySelector('.js-calc-add__button_minus'),
			buttonMemorySave = document.querySelector('.js-calc-add__button_ms'),
			buttonMemoryOpen = document.querySelector('.js-calc-add__button_memory');

		memoryBoard.classList.toggle('visibility');
		buttonMemoryClear.classList.toggle('calc-add__button_disabled');
		buttonMemoryRead.classList.toggle('calc-add__button_disabled');
		buttonMemoryPlus.classList.toggle('calc-add__button_disabled');
		buttonMemoryMinus.classList.toggle('calc-add__button_disabled');
		buttonMemorySave.classList.toggle('calc-add__button_disabled');

		if (this.memory.isEmpty()) {
			this.memory.isActivatedMemoryButtons = false;
			buttonMemoryRead.classList.add('calc-add__button_disabled');
			buttonMemoryClear.classList.add('calc-add__button_disabled');
			buttonMemoryOpen.classList.add('calc-add__button_disabled');
			this.memory.isActivatedMemoryButtons = false;
			this.sendToLocalStorage.isActivatedMemoryButtons = '0';
			this.memory.memoryValues = {};
			this.memory.storageMemoryData = {};
			this.sendToLocalStorage.memoryValues = this.memory.memoryValues;

			this.localStorage.dataset = this.sendToLocalStorage;
		}

		if (this.memory.isOpenMemoryWindow) {
			this.memory.isOpenMemoryWindow = false;
			return;
		}

		this.memory.isOpenMemoryWindow = true;
	}

	buttonMemoryPlus = () => {
		if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
			return;
		}

		let buttonMemoryClear = document.querySelector('.js-calc-add__button_memory-clear'),
			buttonMemoryRead = document.querySelector('.js-calc-add__button_read'),
			buttonMemoryOpen = document.querySelector('.js-calc-add__button_memory');

		this.memory.isActivatedMemoryButtons = true;
		this.sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
		this.localStorage.dataset = this.sendToLocalStorage;

		buttonMemoryRead.classList.remove('calc-add__button_disabled');
		buttonMemoryClear.classList.remove('calc-add__button_disabled');
		buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		if (this.memory.isEmpty()) {
			this.memory.addToMemory(this.disp.text, this.disp.display);
		} else {
			let value = document.querySelector('.memory__block').childNodes[0].innerHTML;
			let displayValue = this.disp.text;
			let position = document.querySelector('.memory__block').dataset.position;

			this.memory.plus(value, displayValue, position);

			document.querySelector('.memory__block').childNodes[0].innerHTML = this.memory.memoryValues[position];
		}

		this.sendToLocalStorage.memoryValues = this.memory.memoryValues;
		this.localStorage.dataset = this.sendToLocalStorage;
	}

	buttonMemoryMinus = () => {
		if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
			return;
		}

		let buttonMemoryClear = document.querySelector('.js-calc-add__button_memory-clear'),
			buttonMemoryRead = document.querySelector('.js-calc-add__button_read'),
			buttonMemoryOpen = document.querySelector('.js-calc-add__button_memory');

		this.memory.isActivatedMemoryButtons = true;
		this.sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
		this.localStorage.dataset = this.sendToLocalStorage;

		buttonMemoryRead.classList.remove('calc-add__button_disabled');
		buttonMemoryClear.classList.remove('calc-add__button_disabled');
		buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		if (this.memory.isEmpty()) {
			this.memory.addToMemory(this.disp.text);
		} else {
			let value = document.querySelector('.memory__block').childNodes[0].innerHTML;
			let displayValue = this.disp.text;
			let position = document.querySelector('.memory__block').dataset.position;

			this.memory.minus(value, displayValue, position);

			document.querySelector('.memory__block').childNodes[0].innerHTML = this.memory.memoryValues[position];
		}

		this.sendToLocalStorage.memoryValues = this.memory.memoryValues;
		this.localStorage.dataset = this.sendToLocalStorage;
	}

	buttonMemoryRead = () => {
		if (!this.memory.isActivatedMemoryButtons || this.memory.isOpenMemoryWindow) {
			return;
		}

		let position = document.querySelector('.memory__block').dataset.position;

		this.disp.text = this.memory.memoryValues[position];
		this.enteredNewValue = true;
	}

	buttonMemoryClear = () => {
		if (!this.memory.isActivatedMemoryButtons || this.memory.isOpenMemoryWindow) {
			return;
		}

		let memoryBoard = document.querySelector('.js-memory'),
			buttonMemoryClear = document.querySelector('.js-calc-add__button_memory-clear'),
			buttonMemoryRead = document.querySelector('.js-calc-add__button_read'),
			buttonMemoryOpen = document.querySelector('.js-calc-add__button_memory');

		this.memory.isActivatedMemoryButtons = false;
		this.sendToLocalStorage.isActivatedMemoryButtons = '0';

		buttonMemoryRead.classList.add('calc-add__button_disabled');
		buttonMemoryClear.classList.add('calc-add__button_disabled');
		buttonMemoryOpen.classList.add('calc-add__button_disabled');
		memoryBoard.innerHTML = '';

		this.memory.memoryValues = {};
		this.memory.storageMemoryData = {};
		this.sendToLocalStorage.memoryValues = this.memory.memoryValues;

		this.localStorage.dataset = this.sendToLocalStorage;
	}

	buttonTrey = () => {
		this.sendToLocalStorage.mode = CALC_MODES.MINIMIZED;
		this.localStorage.dataset = this.sendToLocalStorage;
		this.manage(CALC_MODES.MINIMIZED);
	}

	buttonOpen = () => {
		this.sendToLocalStorage.mode = CALC_MODES.STANDART;
		this.localStorage.dataset = this.sendToLocalStorage;
		this.manage(CALC_MODES.STANDART);
	}

	buttonClose = () => {
		this.manage(CALC_MODES.CLOSED);
		this.sendToLocalStorage.mode = CALC_MODES.CLOSED;
		this.localStorage.dataset = this.sendToLocalStorage;
		this.sendToRecycle();
	}

	buttonOpenCalculator = () => {
		this.init(this.tagForInsert);
		this.manage(CALC_MODES.DEFAULT);
		this.sendToLocalStorage.mode = CALC_MODES.DEFAULT;
		this.localStorage.dataset = this.sendToLocalStorage;
	}

	addEvents() {
		let buttonOpen = document.querySelector('.js-index-menu__button_open'),
			buttonTrey = document.querySelector('.js-index-menu__button_trey'),
			buttonClose = document.querySelector('.js-index-menu__button_close'),
			buttonOpenCalculator = document.querySelector('.js-open-calculator'),
			calculator = document.querySelector('.js-calculator'),
			forDrag = document.querySelector('.js-index-menu__title'),
			buttonLeft = document.querySelector('.small-display__button_left'),
			buttonRight = document.querySelector('.small-display__button_right'),
			buttons = document.querySelector('.js-button-area');

		buttons.addEventListener('click', this.buttonsEventSwitcher);
		window.addEventListener('resize', this.calcPosOnResize);
		forDrag.addEventListener('mousedown', this.calculatorDragAndDrop);
		calculator.addEventListener('dragstart', this.calculatorDragStart);
		buttonTrey.addEventListener('click', this.buttonTrey);
		buttonOpen.addEventListener('click', this.buttonOpen);
		buttonClose.addEventListener('click', this.buttonClose.bind(this));
		buttonOpenCalculator.addEventListener('click', this.buttonOpenCalculator.bind(this));
		buttonLeft.addEventListener('click', this.buttonLeft);
		buttonRight.addEventListener('click', this.buttonRight);
	}

	sendToRecycle() {
		let buttonOpen = document.querySelector('.js-index-menu__button_open'),
			buttonTrey = document.querySelector('.js-index-menu__button_trey'),
			buttonClose = document.querySelector('.js-index-menu__button_close'),
			calculator = document.querySelector('.js-calculator'),
			forDrag = document.querySelector('.js-index-menu__title'),
			buttonLeft = document.querySelector('.small-display__button_left'),
			buttonRight = document.querySelector('.small-display__button_right'),
			buttons = document.querySelector('.js-button-area');

		buttons.removeEventListener('click', this.buttonsEventSwitcher);

		window.removeEventListener('resize', this.calcPosOnResize);
		forDrag.removeEventListener('mousedown', this.calculatorDragAndDrop);
		calculator.removeEventListener('dragstart', this.calculatorDragStart);
		buttonTrey.removeEventListener('click', this.buttonTrey);
		buttonOpen.removeEventListener('click', this.buttonOpen);
		buttonClose.removeEventListener('click', this.buttonClose);
		buttonLeft.removeEventListener('click', this.buttonLeft);
		buttonRight.removeEventListener('click', this.buttonRight);

		for (let i = 0; i < document.body.children.length; i++) {
			if (document.body.children[i].classList.contains('js-calculator')) {
				document.body.removeChild(document.body.children[i]);
			}
		}

		this.tagForInsert.innerHTML = '';
	}

	toggleVisualStateButtons() {
		let resultButton = document.querySelector('.js-calc__button_get-result'),
			button_Sqrt = document.querySelector('.js-calc__button_sqrt'),
			button_Pow = document.querySelector('.js-calc__button_pow'),
			button_Frac = document.querySelector('.js-calc__button_frac'),
			button_Percent = document.querySelector('.js-calc__button_percent'),
			button_Reverse = document.querySelector('.js-calc__button_reverse'),
			operationList = document.querySelectorAll('.js-calc__button_operation'),
			button_addPoint = document.querySelector('.js-calc__button_add-point');

		button_Reverse.classList.toggle('calc__button_disabled');
		button_Percent.classList.toggle('calc__button_disabled');
		button_Sqrt.classList.toggle('calc__button_disabled');
		button_Pow.classList.toggle('calc__button_disabled');
		button_Frac.classList.toggle('calc__button_disabled');
		button_addPoint.classList.toggle('calc__button_disabled');
		resultButton.classList.toggle('calc__button_disabled');
		operationList.forEach((element) => {
			element.classList.toggle('calc__button_disabled');
		});
	}
}

export default Calculator;