import Display from './display';
import Operations from './operations';
import Memory from './memory';
import Storage from './localStorage';
import CalcLoader from './calcLoader';
import { MAX_WIDTH_DISPLAY, MAX_LENGTH_DISPLAY, STYLES, OPERATIONS, CALC_MODES, MESSAGES } from './const';

class Calc {
	constructor() {
		this.disp = new Display();
		this.operations = new Operations();
		this.memory = new Memory();
		this.storage = new Storage();
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
			this.activateButtons();
		}

		this.disp.displayClear();
		this.isResultPressed = false;
		this.isOperationPressed = false;
		this.isNeedValueForProgressive = false,
			this.isEnteredNewValue = false;
		this.typeOperation = '';
		this.a = '';
		this.currentValue = null;
		this.operations.currentValue = null;
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
			this.disableButtons();
			this.disp.display.style.fontSize = STYLES.SMALL;
			console.log('+');
			this.disp.text = MESSAGES.OVERFLOW;
			this.operationsDisabled = true;

			return false;
		} else {
			return true;
		}
	}

	singleOperation(operation) {
		if (this.operationsDisabled) {
			return;
		}

		if (operation === OPERATIONS.PERCENT && this.currentValue === null) {
			return;
		}

		this.disp.sendToStatusDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation);
		this.disp.isPressedSingleOperation = true;
		this.disp.needNewValue = true;

		this.disp.isEnteredNewValue = this.isEnteredNewValue = true;

		if (operation === OPERATIONS.PERCENT) {
			let result = this.operations.percent(this.currentValue, this.disp.text);
			if (this.checkForFinite(result)) {
				this.disp.text = this.trimmer(result);
			}

			return;
		}
		console.log(this.disp.text);
		if (this.checkForFinite(this.operations.sendOperation(operation, this.disp.text))) {
			this.disp.text = this.trimmer(this.operations.sendOperation(operation, this.disp.text));
		}
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
			this.valueForProgressive = this.disp.text;
			this.isNeedValueForProgressive = false;
		}

		if ((this.isOperationPressed || this.isResultPressed) && this.currentValue !== undefined) {
			let result = this.operations.sendOperation(this.typeOperation, this.currentValue, this.valueForProgressive);
			if (this.checkForFinite(result)) {
				this.currentValue = this.disp.text = this.trimmer(result);
			}
		}

	}

	checkException(operation) {
		switch (operation) {
			case OPERATIONS.DIVIDE: {
				if (this.valueForProgressive === 0 || this.disp.text === 0) {
					this.operationsDisabled = true;
					this.disableButtons();
					this.display.style.fontSize = STYLES.SMALL;
					this.display.innerHTML = MESSAGES.DIVIDE_BY_ZERO;

					return;
				}
				break;
			}
			case OPERATIONS.FRAC: {
				if (parseFloat(this.display.innerHTML) === 0) {
					this.operationsDisabled = true;
					this.disableButtons();
					this.display.style.fontSize = STYLES.SMALL;
					this.display.innerHTML = MESSAGES.DIVIDE_BY_ZERO;

					return;
				}
				break;
			}
			case OPERATIONS.SQRT: {
				if (parseFloat(this.display.innerHTML) < 0) {
					this.disableButtons();
					this.display.style.fontSize = STYLES.SMALL;
					this.display.innerHTML = MESSAGES.UNCORRECT_DATA;
					this.operationsDisabled = true;

					return;
				}
				break;
			}
		}
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
				this.checkException(operation);
				if (this.isResultPressed) {
					let result = this.operations.sendOperation(this.typeOperation, this.currentValue, this.valueForProgressive);
					if (this.checkForFinite(result)) {
						this.disp.text = this.currentValue = this.trimmer(result);
					}
				} else {
					let result = this.operations.sendOperation(this.typeOperation, this.currentValue, this.disp.text);
					if (this.checkForFinite(result)) {
						this.disp.text = this.currentValue = this.trimmer(result);
					}
				}
				/* */
				//this.currentValue = this.disp.text;
				/* */
				//console.log(this.currentValue);
				//this.currentValue = this.disp.text = this.operations.sendOperation(this.typeOperation, this.isResultPressed, this.currentValue, this.valueForProgressive, this.disp.text);
				this.isEnteredNewValue = this.disp.isEnteredNewValue = false;
			}
			this.typeOperation = operation;
		} else {
			this.currentValue = this.disp.text;
			this.typeOperation = operation;
			this.isOperationPressed = true;
			this.isEnteredNewValue = this.disp.isEnteredNewValue = false;
		}

		this.disp.needNewValue = true;
	}

	manage(mode) {
		let optionMenu = document.querySelector('.js_option-menu'),
			buttonArea = document.querySelector('.js_button-area'),
			groupSmallDisplay = document.querySelector('.js_group-small-display'),
			openCalc = document.querySelector('.js_open-calculator'),
			display = document.querySelector('.js_display'),
			calculator = document.querySelector('.js_calculator');

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
				//	optionMenu.style.display = 'flex';
				//	groupSmallDisplay.style.display = 'flex';
				//	display.style.display = 'block';
				//	calculator.style.height = '540px';
				///	calculator.style.left = this.defaultSettings.x;
				//	calculator.style.top = this.defaultSettings.y;		

				//	console.log(calculator);
				//	calculator.style.display = 'none';
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

	init(tag) {
		this.tagForInsert = tag;

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
						<div class="calc-add__button calc-add__button_memory-clear js_calc-add__button_memory-clear calc-add__button_disabled" data-add="${OPERATIONS.ADD.MCLEAR}">MC</div>
						<div class="calc-add__button calc-add__button_read js_calc-add__button_read calc-add__button_disabled" data-add="${OPERATIONS.ADD.MREAD}">MR</div>
						<div class="calc-add__button calc-add__button_plus js_calc-add__button_plus" data-add="${OPERATIONS.ADD.MPLUS}">M<span>+</span></div>
						<div class="calc-add__button calc-add__button_minus js_calc-add__button_minus" data-add="${OPERATIONS.ADD.MMINUS}">M<span>-</span></div>
						<div class="calc-add__button calc-add__button_ms js_calc-add__button_ms" data-add="${OPERATIONS.ADD.MSAVE}">MS</div>
						<div class="calc-add__button calc-add__button_memory js_calc-add__button_memory calc-add__button_disabled" data-add="${OPERATIONS.ADD.MEMORY}">M</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_enabled calc__button_percent js_calc__button_percent" data-add="${OPERATIONS.ADD.PERCENT}">%</div>
						<div class="calc__button calc__button_enabled calc__button_sqrt js_calc__button_sqrt" data-add="${OPERATIONS.ADD.SQRT}">√</div>
						<div class="calc__button calc__button_enabled calc__button_pow js_calc__button_pow" data-add="${OPERATIONS.ADD.POW}"><span class="span">x</span></div>
						<div class="calc__button calc__button_enabled calc__button_frac js_calc__button_frac" data-add="${OPERATIONS.ADD.FRAC}"><span class="span">/</span></div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_disabled">CE</div>
						<div class="calc__button calc__button_enabled calc__button_clear js_calc__button_clear" data-add="${OPERATIONS.ADD.CLEAR}">C</div>
						<div class="calc__button calc__button_enabled calc__button_backspace js_calc__button_backspace" data-add="${OPERATIONS.ADD.BACKSPACE}"><-</div>
						<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation" data-operation="${OPERATIONS.DIVIDE}">÷</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="7">7</div>
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="8">8</div>
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="9">9</div>
						<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation" data-operation="${OPERATIONS.MULTIPLY}">*</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="4">4</div>
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="5">5</div>
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="6">6</div>
						<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation" data-operation="${OPERATIONS.MINUS}">-</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="1">1</div>
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="2">2</div>
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="3">3</div>
						<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation" data-operation="${OPERATIONS.PLUS}">+</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_enabled calc__button_reverse js_calc__button_reverse" data-add="${OPERATIONS.ADD.REVERSE}">±</div>
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="0">0</div>
						<div class="calc__button calc__button_enabled calc__button_add-point js_calc__button_add-point" data-add="${OPERATIONS.ADD.POINT}">,</div>
						<div class="calc__button calc__button_enabled calc__button_get-result js_calc__button_get-result" data-add="${OPERATIONS.ADD.RESULT}">=</div>
					</div>
					<div class="memory js_memory">
					</div>
				</div>
			</div> `;

		tag.innerHTML = data;
		this.calcLoader = new CalcLoader();
		this.addEvent();
	}


	addFunctionSwitcher = () => {
		switch (event.target.dataset.add) {
			case '±': {
				this.buttonReverse();
				break;
			}
			case OPERATIONS.ADD.PERCENT: {
				this.buttonPercent();
				break;
			}
			case OPERATIONS.ADD.SQRT: {
				this.buttonSqrt();
				break;
			}
			case OPERATIONS.ADD.POW: {
				this.buttonPow();
				break;
			}
			case OPERATIONS.ADD.FRAC: {
				this.buttonFrac();
				break;
			}
			case OPERATIONS.ADD.CLEAR: {
				this.buttonClear();
				break;
			}
			case OPERATIONS.ADD.BACKSPACE: {
				this.buttonBackspace();
				break;
			}
			case OPERATIONS.ADD.REVERSE: {
				this.buttonReverse();
				break;
			}
			case OPERATIONS.ADD.POINT: {
				this.buttonaddPoint();
				break;
			}
			case OPERATIONS.ADD.RESULT: {
				this.resultButton();
				break;
			}
			case OPERATIONS.ADD.MCLEAR: {
				this.buttonMemoryClear();
				break;
			}
			case OPERATIONS.ADD.MREAD: {
				this.buttonMemoryRead();
				break;
			}
			case OPERATIONS.ADD.MPLUS: {
				this.buttonMemoryPlus();
				break;
			}
			case OPERATIONS.ADD.MMINUS: {
				this.buttonMemoryMinus();
				break;
			}
			case OPERATIONS.ADD.MSAVE: {
				this.buttonMemorySave();
				break;
			}
			case OPERATIONS.ADD.MEMORY: {
				this.buttonMemoryOpen();
				break;
			}
		}
	}

	buttonsEventSwitcher = (event) => {
		for (var key in event.target.dataset) {
			switch (key) {
				case 'value': {
					this.disp.smallDisplay.style.removeProperty('left');
					this.disp.smallDisplay.style.right = 0;
					this.disp.numberPress(event.target.dataset.value);
					this.isEnteredNewValue = true;
					this.disp.isPressedSingleOperation = false;
					break;
				}
				case 'operation': {
					this.operation(event.target.dataset.operation);
					this.disp.smallDisplay.style.removeProperty('left');
					this.disp.smallDisplay.style.right = 0;
					break;
				}
				case 'add': {
					this.addFunctionSwitcher();
					break;
				}
			}
		}
	}

	calcPosOnResize = () => {
		let calculator = document.querySelector('.js_calculator');

		if ((calculator.offsetLeft + calculator.clientWidth) > window.innerWidth) {
			this.sendToLocalStorage.x = (window.innerWidth - calculator.clientWidth) / window.innerWidth * 100 + '%';
			calculator.style.left = this.sendToLocalStorage.x;
		}
		if ((calculator.offsetTop + calculator.clientHeight) > window.innerHeight) {
			this.sendToLocalStorage.y = (window.innerHeight - calculator.clientHeight) / window.innerHeight * 100 + '%';
			calculator.style.top = this.sendToLocalStorage.y;
		}
		if (calculator.offsetLeft < 0) {
			this.sendToLocalStorage.x = 0 + '%';
			calculator.style.left = this.sendToLocalStorage.x;
		}
		if (calculator.offsetTop < 0) {
			this.sendToLocalStorage.y = 0 + '%';
			calculator.style.top = this.sendToLocalStorage.y;
		}
		this.storage.dataset = this.sendToLocalStorage;
	}
	
	calculatorDragAndDrop = (e) => {
		let calculator = document.querySelector('.js_calculator');

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

			this.sendToLocalStorage.x = calculator.style.left;
			this.sendToLocalStorage.y = calculator.style.top;

			if (this.storage.dataset.mode === CALC_MODES.DEFAULT) {
				this.sendToLocalStorage.mode = CALC_MODES.STANDART;
			}

			this.storage.dataset = this.sendToLocalStorage;
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
		this.disp.smallDisplay.style.removeProperty('left');
		this.disp.smallDisplay.style.right = 0;
		this.singleOperation('NEGATE');
	}

	buttonPow = () => {
		this.disp.smallDisplay.style.removeProperty('left');
		this.disp.smallDisplay.style.right = 0;
		this.singleOperation('POW');
	}

	buttonFrac = () => {
		this.singleOperation('FRAC');
		this.disp.smallDisplay.style.removeProperty('left');
		this.disp.smallDisplay.style.right = 0;
	}

	buttonSqrt = () => {
		this.singleOperation('SQRT');
		this.disp.smallDisplay.style.removeProperty('left');
		this.disp.smallDisplay.style.right = 0;
	}

	buttonPercent = () => {
		this.singleOperation('PERCENT');
		this.disp.smallDisplay.style.removeProperty('left');
		this.disp.smallDisplay.style.right = 0;
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

		let	buttonMemoryClear = document.querySelector('.js_calc-add__button_memory-clear'),
		buttonMemoryRead = document.querySelector('.js_calc-add__button_read'),
		buttonMemoryOpen = document.querySelector('.js_calc-add__button_memory');

		this.memory.isActivatedMemoryButtons = true;
		this.sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
		this.storage.dataset = this.sendToLocalStorage;

		buttonMemoryRead.classList.remove('calc-add__button_disabled');
		buttonMemoryClear.classList.remove('calc-add__button_disabled');
		buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		this.memory.addToMemory(this.disp.text, this.disp.display);
		this.
		this.sendToLocalStorage.memoryValues = this.memory.memoryValues;
		this.storage.dataset = this.sendToLocalStorage;
	}

	buttonMemoryOpen = () => {
		if (!this.memory.isActivatedMemoryButtons) {
			return;
		}

		let memoryBoard = document.querySelector('.js_memory'),
		buttonMemoryClear = document.querySelector('.js_calc-add__button_memory-clear'),
		buttonMemoryRead = document.querySelector('.js_calc-add__button_read'),
		buttonMemoryPlus = document.querySelector('.js_calc-add__button_plus'),
		buttonMemoryMinus = document.querySelector('.js_calc-add__button_minus'),
		buttonMemorySave = document.querySelector('.js_calc-add__button_ms'),
		buttonMemoryOpen = document.querySelector('.js_calc-add__button_memory');

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

			this.storage.dataset = this.sendToLocalStorage;
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

		let	buttonMemoryClear = document.querySelector('.js_calc-add__button_memory-clear'),
		buttonMemoryRead = document.querySelector('.js_calc-add__button_read'),
		buttonMemoryOpen = document.querySelector('.js_calc-add__button_memory');

		this.memory.isActivatedMemoryButtons = true;
		this.sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
		this.storage.dataset = this.sendToLocalStorage;

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
		this.storage.dataset = this.sendToLocalStorage;
	}

	buttonMemoryMinus = () => {
		if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
			return;
		}

		let	buttonMemoryClear = document.querySelector('.js_calc-add__button_memory-clear'),
		buttonMemoryRead = document.querySelector('.js_calc-add__button_read'),
		buttonMemoryOpen = document.querySelector('.js_calc-add__button_memory');

		this.memory.isActivatedMemoryButtons = true;
		this.sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
		this.storage.dataset = this.sendToLocalStorage;

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
		this.storage.dataset = this.sendToLocalStorage;
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

		let memoryBoard = document.querySelector('.js_memory'),
		buttonMemoryClear = document.querySelector('.js_calc-add__button_memory-clear'),
		buttonMemoryRead = document.querySelector('.js_calc-add__button_read'),
		buttonMemoryOpen = document.querySelector('.js_calc-add__button_memory');

		this.memory.isActivatedMemoryButtons = false;
		this.sendToLocalStorage.isActivatedMemoryButtons = '0';

		buttonMemoryRead.classList.add('calc-add__button_disabled');
		buttonMemoryClear.classList.add('calc-add__button_disabled');
		buttonMemoryOpen.classList.add('calc-add__button_disabled');
		memoryBoard.innerHTML = '';

		this.memory.memoryValues = {};
		this.memory.storageMemoryData = {};
		this.sendToLocalStorage.memoryValues = this.memory.memoryValues;

		this.storage.dataset = this.sendToLocalStorage;
	}

	buttonTrey = () => {
		this.sendToLocalStorage.mode = CALC_MODES.MINIMIZED;
		this.storage.dataset = this.sendToLocalStorage;
		this.calcLoader.manage(CALC_MODES.MINIMIZED);
	}

	buttonOpen = () => {
		this.sendToLocalStorage.mode = CALC_MODES.STANDART;
		this.storage.dataset = this.sendToLocalStorage;
		this.calcLoader.manage(CALC_MODES.STANDART);
	}

	buttonClose = () => {
		this.manage(CALC_MODES.CLOSED);
		this.sendToLocalStorage.mode = CALC_MODES.CLOSED;
		this.storage.dataset = this.sendToLocalStorage;
		this.sendToRecycle();
	}

	buttonOpenCalculator = () => {
		this.init(this.tagForInsert);
		this.calcLoader.manage(CALC_MODES.DEFAULT);
		this.sendToLocalStorage.mode = CALC_MODES.DEFAULT;
		this.storage.dataset = this.sendToLocalStorage;
	}

	addEvent() {
		this.disp.display = this.operations.display = this.memory.display = document.querySelector('.js_display');
		this.disp.arrowLeft = document.querySelector('.js_small-display__button_left');
		this.disp.arrowRight = document.querySelector('.js_small-display__button_right');
		this.disp.smallDisplay = document.querySelector('.js_small-display__block');
		this.disp.hiddenDisplay = document.querySelector('.js_small-display__add');
		this.memory.memory = document.querySelector('.js_memory');

		this.calcLoader.init();

		let buttonOpen = document.querySelector('.js_index-menu__button_open'),
			buttonTrey = document.querySelector('.js_index-menu__button_trey'),
			buttonClose = document.querySelector('.js_index-menu__button_close'),
			buttonOpenCalculator = document.querySelector('.js_open-calculator'),
			calculator = document.querySelector('.js_calculator'),
			forDrag = document.querySelector('.js_index-menu__title'),
			buttonLeft = document.querySelector('.small-display__button_left'),
			buttonRight = document.querySelector('.small-display__button_right'),
			buttons = document.querySelector('.js_button-area');

		this.sendToLocalStorage = {};

		buttons.addEventListener('click', this.buttonsEventSwitcher);
		window.addEventListener('resize', this.calcPosOnResize);
		forDrag.addEventListener('mousedown', this.calculatorDragAndDrop);
		calculator.addEventListener('dragstart',this.calculatorDragStart);
		buttonTrey.addEventListener('click', this.buttonTrey);
		buttonOpen.addEventListener('click', this.buttonOpen);
		buttonClose.addEventListener('click', this.buttonClose.bind(this));
		buttonOpenCalculator.addEventListener('click', this.buttonOpenCalculator.bind(this));
		buttonLeft.addEventListener('click', this.buttonLeft);
		buttonRight.addEventListener('click', this.buttonRight);
	}

	sendToRecycle() {
		let buttonOpen = document.querySelector('.js_index-menu__button_open'),
			buttonTrey = document.querySelector('.js_index-menu__button_trey'),
			buttonClose = document.querySelector('.js_index-menu__button_close'),
			calculator = document.querySelector('.js_calculator'),
			forDrag = document.querySelector('.js_index-menu__title'),
			buttonLeft = document.querySelector('.small-display__button_left'),
			buttonRight = document.querySelector('.small-display__button_right'),
			buttons = document.querySelector('.js_button-area');

		buttons.removeEventListener('click', this.buttonsEventSwitcher);

		window.removeEventListener('resize', this.calcPosOnResize);
		forDrag.removeEventListener('mousedown', this.calculatorDragAndDrop);
		calculator.removeEventListener('dragstart',this.calculatorDragStart);
		buttonTrey.removeEventListener('click', this.buttonTrey);
		buttonOpen.removeEventListener('click', this.buttonOpen);
		buttonClose.removeEventListener('click', this.buttonClose);
		buttonLeft.removeEventListener('click', this.buttonLeft);
		buttonRight.removeEventListener('click', this.buttonRight);

		for (let i = 0; i < document.body.children.length; i++) {
			if (document.body.children[i].classList.contains('js_calculator')) {
				document.body.removeChild(document.body.children[i]);
			}
		}

		this.tagForInsert.innerHTML = '';
	}

	disableButtons() {
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


	activateButtons() {
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

}

export default new Calc();