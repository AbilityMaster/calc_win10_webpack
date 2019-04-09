import Display from './display';
import Operations from './operations';
import Memory from './memory';
import Storage from './localStorage';
import CalcLoader from './calcLoader';
import {MAX_WIDTH_DISPLAY, STYLES, OPERATIONS, CALC_MODES} from './const';

class Calc {
	constructor() {
		this.disp = new Display();		
		this.operations = new Operations();
		this.memory = new Memory();
		this.storage = new Storage();
		this.isResultPressed = false;
		this.isOperationPressed = false;
		this.isNeedValueForProgressive = false;
		this.isEnteredNewValue = false;
		this.typeOperation = '';
		this.currentValue = null;
		this.a = '';
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
		this.typeOperation = '';
		this.a = '';		
		this.currentValue = null;
		this.operations.currentValue = null;
	}

	singleOperation(operation) {
		if (this.operationsDisabled) {
			return;
		}

		if (operation === OPERATIONS.PERCENT && this.operations.currentValue === null) { 
			return;
		}

		this.disp.sendToStatusDisplay(OPERATIONS.LABEL_SINGLE_OPERATION, operation);
		this.disp.isPressedSingleOperation = true;
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
		this.disp.isPressedSingleOperation = false;
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
						<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation" data-operation="${OPERATIONS.MULTIPLY}">÷</div>
					</div>
					<div class="calc">
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="7">7</div>
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="8">8</div>
						<div class="calc__button calc__button_enabled calc__button_number js_calc__button_number" data-value="9">9</div>
						<div class="calc__button calc__button_enabled calc__button_operation js_calc__button_operation" data-operation="${OPERATIONS.DIVIDE}">*</div>
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

	addEvent() {
		this.disp.display = this.operations.display = this.memory.display = document.querySelector('.js_display');
		this.disp.arrowLeft = document.querySelector('.js_small-display__button_left');
		this.disp.arrowRight = document.querySelector('.js_small-display__button_right');
		this.disp.smallDisplay = document.querySelector('.js_small-display__block');
		this.disp.hiddenDisplay = document.querySelector('.js_small-display__add');
		this.memory.memory = document.querySelector('.js_memory');

		this.calcLoader.init();

		let	buttonOpen = document.querySelector('.js_index-menu__button_open'),
		buttonTrey = document.querySelector('.js_index-menu__button_trey'),
		buttonClose = document.querySelector('.js_index-menu__button_close'),
		buttonOpenCalculator = document.querySelector('.js_open-calculator'),
		calculator = document.querySelector('.js_calculator'),
		forDrag = document.querySelector('.js_index-menu__title'),
		memoryBoard = document.querySelector('.js_memory'),
		buttonMemoryClear = document.querySelector('.js_calc-add__button_memory-clear'),
		buttonMemoryRead = document.querySelector('.js_calc-add__button_read'),
		buttonMemoryPlus = document.querySelector('.js_calc-add__button_plus'),
		buttonMemoryMinus = document.querySelector('.js_calc-add__button_minus'),
		buttonMemorySave = document.querySelector('.js_calc-add__button_ms'),
		buttonMemoryOpen = document.querySelector('.js_calc-add__button_memory'),
		buttonLeft = document.querySelector('.small-display__button_left'),
		buttonRight = document.querySelector('.small-display__button_right'),	
		buttons = document.querySelector('.js_button-area');	

		let sendToLocalStorage = {}; 
	
		this.functionsEvent = {
			addFunctionSwitcher: () => {
				switch(event.target.dataset.add) {
					case '±': {
						this.functionsEvent.buttonReverse();
						break;
					}
					case OPERATIONS.ADD.PERCENT: {
						this.functionsEvent.buttonPercent();
						break;
					}
					case OPERATIONS.ADD.SQRT: {
						this.functionsEvent.buttonSqrt();
						break;
					}
					case OPERATIONS.ADD.POW: {
						this.functionsEvent.buttonPow();
						break;
					}
					case OPERATIONS.ADD.FRAC: {
						this.functionsEvent.buttonFrac();
						break;
					}
					case OPERATIONS.ADD.CLEAR: {
						this.functionsEvent.buttonClear();
						break;
					}
					case OPERATIONS.ADD.BACKSPACE: {
						this.functionsEvent.buttonBackspace();
						break;
					}
					case OPERATIONS.ADD.REVERSE: {
						this.functionsEvent.buttonReverse();
						break;
					}
					case OPERATIONS.ADD.POINT: {
						this.functionsEvent.buttonaddPoint();
						break;
					}
					case OPERATIONS.ADD.RESULT: {
						this.functionsEvent.resultButton();
						break;
					}
					case OPERATIONS.ADD.MCLEAR: {
						this.functionsEvent.buttonMemoryClear();
						break;
					}
					case OPERATIONS.ADD.MREAD: {
						this.functionsEvent.buttonMemoryRead();
						break;
					}
					case OPERATIONS.ADD.MPLUS: {
						this.functionsEvent.buttonMemoryPlus();
						break;
					}
					case OPERATIONS.ADD.MMINUS: {
						this.functionsEvent.buttonMemoryMinus();
						break;
					}
					case OPERATIONS.ADD.MSAVE: {
						this.functionsEvent.buttonMemorySave();
						break;
					}
					case OPERATIONS.ADD.MEMORY: {
						this.functionsEvent.buttonMemoryOpen();
						break;
					}
				}
			},
			buttonsEventSwitcher: (event) => {
				for (var key in event.target.dataset) {
					switch(key) {
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
							this.functionsEvent.addFunctionSwitcher();
							break;
						}
					}
				}
			},
			calcPosOnResize: () => {
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
			},
			calculatorDragAndDrop: (e) => {
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
				};

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
			},
			calculatorDragStart: () => {
				return false;
			},
			resultButton: () => {
				this.result();
			},
			buttonaddPoint: () => {
				this.disp.smallDisplay.style.removeProperty('left');
				this.disp.smallDisplay.style.right = 0;
				this.disp.addPoint();
			},
			buttonClear: () => {
				this.clear();
			},
			buttonBackspace: () => {
				this.operationsDisabled = false;
				this.disp.backspace();
			},
			buttonReverse: () => {
				this.disp.smallDisplay.style.removeProperty('left');
				this.disp.smallDisplay.style.right = 0;
				this.singleOperation('NEGATE');
			},
			buttonPow: () => {		
				this.disp.smallDisplay.style.removeProperty('left');
				this.disp.smallDisplay.style.right = 0;
				this.singleOperation('POW');
			},
			buttonFrac: () => {
				this.singleOperation('FRAC');
				this.disp.smallDisplay.style.removeProperty('left');
				this.disp.smallDisplay.style.right = 0;
			},
			buttonSqrt: () => {
				this.singleOperation('SQRT');
				this.disp.smallDisplay.style.removeProperty('left');
				this.disp.smallDisplay.style.right = 0;
			},
			buttonPercent: () => {
				this.singleOperation('PERCENT');
				this.disp.smallDisplay.style.removeProperty('left');
				this.disp.smallDisplay.style.right = 0;
			},
			buttonLeft: () => {
				if (this.disp.smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
					this.disp.smallDisplay.style.removeProperty('right');
					this.disp.smallDisplay.style.left = 0;
					this.disp.smallDisplay.style.textAlign = 'left';
				}
			},
			buttonRight: () => {
				if (this.disp.smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
					this.disp.smallDisplay.style.removeProperty('left');
					this.disp.smallDisplay.style.right = 0;
					this.disp.smallDisplay.style.textAlign = 'right';
				} 
			},
			buttonMemorySave: () => {
				if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
					return;
				}

				this.memory.isActivatedMemoryButtons = true;
				sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
				this.storage.dataset = sendToLocalStorage;

				buttonMemoryRead.classList.remove('calc-add__button_disabled');
				buttonMemoryClear.classList.remove('calc-add__button_disabled');
				buttonMemoryOpen.classList.remove('calc-add__button_disabled');

				this.memory.addToMemory(this.disp.text, this.disp.display);

				sendToLocalStorage.memoryValues = this.memory.memoryValues;
				this.storage.dataset = sendToLocalStorage;
			},
			buttonMemoryOpen: () => {
				if (!this.memory.isActivatedMemoryButtons) {
					return;
				}

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
			},
			buttonMemoryPlus: () => {
				if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
					return;
				}

				this.memory.isActivatedMemoryButtons = true;
				sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
				this.storage.dataset = sendToLocalStorage;

				buttonMemoryRead.classList.remove('calc-add__button_disabled');
				buttonMemoryClear.classList.remove('calc-add__button_disabled');
				buttonMemoryOpen.classList.remove('calc-add__button_disabled');

				if (this.memory.isEmpty()) {
					this.memory.addToMemory(this.disp.text, this.disp.display);
				} else {
					let value =	document.querySelector('.memory__block').childNodes[0].innerHTML;
					let displayValue = this.disp.text;
					let position = document.querySelector('.memory__block').dataset.position;

					this.memory.plus(value, displayValue, position);

					document.querySelector('.memory__block').childNodes[0].innerHTML = this.memory.memoryValues[position];
				}

				sendToLocalStorage.memoryValues = this.memory.memoryValues;
				this.storage.dataset = sendToLocalStorage;
			},
			buttonMemoryMinus: () => {
				if (this.memory.isOpenMemoryWindow || !isFinite(this.disp.text)) {
					return;
				}

				this.memory.isActivatedMemoryButtons = true;
				sendToLocalStorage.isActivatedMemoryButtons = this.memory.isActivatedMemoryButtons;
				this.storage.dataset = sendToLocalStorage;

				buttonMemoryRead.classList.remove('calc-add__button_disabled');
				buttonMemoryClear.classList.remove('calc-add__button_disabled');
				buttonMemoryOpen.classList.remove('calc-add__button_disabled');

				if (this.memory.isEmpty()) {
					this.memory.addToMemory(this.disp.text);
				} else {
					let value =	document.querySelector('.memory__block').childNodes[0].innerHTML;
					let displayValue = this.disp.text;
					let position = document.querySelector('.memory__block').dataset.position;

					this.memory.minus(value, displayValue, position);

					document.querySelector('.memory__block').childNodes[0].innerHTML = this.memory.memoryValues[position];
				}

				sendToLocalStorage.memoryValues = this.memory.memoryValues;
				this.storage.dataset = sendToLocalStorage;
			},
			buttonMemoryRead: () => {
				if (!this.memory.isActivatedMemoryButtons || this.memory.isOpenMemoryWindow) {
					return;
				}

				let position = document.querySelector('.memory__block').dataset.position;

				this.disp.text = this.memory.memoryValues[position];
				this.enteredNewValue = true;
			},
			buttonMemoryClear: () => {
				if (!this.memory.isActivatedMemoryButtons || this.memory.isOpenMemoryWindow) {
					return;
				}

				this.memory.isActivatedMemoryButtons = false;
				sendToLocalStorage.isActivatedMemoryButtons = '0';

				buttonMemoryRead.classList.add('calc-add__button_disabled');
				buttonMemoryClear.classList.add('calc-add__button_disabled');
				buttonMemoryOpen.classList.add('calc-add__button_disabled');
				memoryBoard.innerHTML = '';

				this.memory.memoryValues = {};
				this.memory.storageMemoryData = {};
				sendToLocalStorage.memoryValues = this.memory.memoryValues;

				this.storage.dataset = sendToLocalStorage;
			},
			buttonTrey: () => {
				sendToLocalStorage.mode = CALC_MODES.MINIMIZED;
				this.storage.dataset = sendToLocalStorage;
				this.calcLoader.manage(CALC_MODES.MINIMIZED);
			},
			buttonOpen: () => {
				sendToLocalStorage.mode = CALC_MODES.STANDART;
				this.storage.dataset = sendToLocalStorage;
				this.calcLoader.manage(CALC_MODES.STANDART);
			},
			buttonClose: () => {
				this.calcLoader.manage(CALC_MODES.CLOSED);		
				sendToLocalStorage.mode = CALC_MODES.CLOSED;
				this.storage.dataset = sendToLocalStorage;				
				this.sendToRecycle();
			},
			buttonOpenCalculator: () => {
				this.template(this.tagForInsert);
				this.calcLoader.manage(CALC_MODES.DEFAULT);
				sendToLocalStorage.mode = CALC_MODES.DEFAULT;		
				this.storage.dataset = sendToLocalStorage;	
			}
		};

		buttons.addEventListener('click', this.functionsEvent.buttonsEventSwitcher);
		window.addEventListener('resize', this.functionsEvent.calcPosOnResize);
		forDrag.addEventListener('mousedown', this.functionsEvent.calculatorDragAndDrop);
		calculator.addEventListener('dragstart', this.functionsEvent.calculatorDragStart);
		buttonTrey.addEventListener('click', this.functionsEvent.buttonTrey);
		buttonOpen.addEventListener('click', this.functionsEvent.buttonOpen);
		buttonClose.addEventListener('click', this.functionsEvent.buttonClose);
		buttonOpenCalculator.addEventListener('click', this.functionsEvent.buttonOpenCalculator);
		buttonLeft.addEventListener('click', this.functionsEvent.buttonLeft);
		buttonRight.addEventListener('click', this.functionsEvent.buttonRight);
	}

	sendToRecycle() {
		let	buttonOpen = document.querySelector('.js_index-menu__button_open'),
		buttonTrey = document.querySelector('.js_index-menu__button_trey'),
		buttonClose = document.querySelector('.js_index-menu__button_close'),
		calculator = document.querySelector('.js_calculator'),
		forDrag = document.querySelector('.js_index-menu__title'),
		buttonLeft = document.querySelector('.small-display__button_left'),
		buttonRight = document.querySelector('.small-display__button_right'),
		buttons = document.querySelector('.js_button-area');	

		buttons.removeEventListener('click', this.functionsEvent.buttonsEventSwitcher);
		window.removeEventListener('resize', this.functionsEvent.calcPosOnResize);
		forDrag.removeEventListener('mousedown', this.functionsEvent.calculatorDragAndDrop);
		calculator.removeEventListener('dragstart', this.functionsEvent.calculatorDragStart);
		buttonTrey.removeEventListener('click', this.functionsEvent.buttonTrey);
		buttonOpen.removeEventListener('click', this.functionsEvent.buttonOpen);
		buttonClose.removeEventListener('click', this.functionsEvent.buttonClose);
		buttonLeft.removeEventListener('click', this.functionsEvent.buttonLeft);
		buttonRight.removeEventListener('click', this.functionsEvent.buttonRight);

		this.tagForInsert.innerHTML = '';
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