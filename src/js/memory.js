import { OPERATIONS } from './const';

class Memory {
	constructor(props) {
		this.calc = props;
		this.isActivatedMemoryButtons = false;
		this.isOpenMemoryWindow = false;
		this.positionAttribute = 0;
		this.memoryValues = {};
		this.storageMemoryData = {};
		this.$buttonMemoryClear = null;
		this.$buttonMemoryRead = null;
		this.$buttonMemoryOpen = null;
		this.$memoryBoard = null;
		this.$buttonMemoryPlus = null;
		this.$buttonMemoryMinus = null;
		this.$buttonMemorySave = null;
		this.$buttonMemoryOpen = null;
		this.$btns = null;
	}

	get template() {
		return {
			buttons: ` 
			<div class="calc calc-add">
				<div class="calc-add__button calc-add__button_memory-clear js-calc-add__button_memory-clear calc-add__button_disabled" data-memory="${OPERATIONS.ADDITIONAL.MCLEAR}">MC</div>
				<div class="calc-add__button calc-add__button_read js-calc-add__button_read calc-add__button_disabled" data-memory="${OPERATIONS.ADDITIONAL.MREAD}">MR</div>
				<div class="calc-add__button calc-add__button_plus js-calc-add__button_plus" data-memory="${OPERATIONS.ADDITIONAL.MPLUS}">M<span>+</span></div>
				<div class="calc-add__button calc-add__button_minus js-calc-add__button_minus" data-memory="${OPERATIONS.ADDITIONAL.MMINUS}">M<span>-</span></div>
				<div class="calc-add__button calc-add__button_ms js-calc-add__button_ms" data-memory="${OPERATIONS.ADDITIONAL.MSAVE}">MS</div>
				<div class="calc-add__button calc-add__button_memory js-calc-add__button_memory calc-add__button_disabled" data-memory="${OPERATIONS.ADDITIONAL.MEMORY}">M</div>
			</div> 
			`,
			memoryArea: '<div class="memory js-memory">'
		};
	}

	init() {
		this.$buttonMemoryClear = document.querySelector('.js-calc-add__button_memory-clear');
		this.$buttonMemoryRead = document.querySelector('.js-calc-add__button_read');
		this.$buttonMemoryOpen = document.querySelector('.js-calc-add__button_memory');
		this.$memoryBoard = document.querySelector('.js-memory');
		this.$buttonMemoryPlus = document.querySelector('.js-calc-add__button_plus');
		this.$buttonMemoryMinus = document.querySelector('.js-calc-add__button_minus');
		this.$buttonMemorySave = document.querySelector('.js-calc-add__button_ms');
		this.$buttonMemoryOpen = document.querySelector('.js-calc-add__button_memory');
		this.$btns = document.querySelector('.calc-add');
		this.addEvents();
	}

	addEvents() {
		this.$btns.addEventListener('click', this.buttonsEventSwitcher);
	}

	sendToRecycle() {
		this.$btns.removeEventListener('click', this.buttonsEventSwitcher);
		this.isActivatedMemoryButtons = false;
		this.isOpenMemoryWindow = false;
		this.positionAttribute = 0;
		this.memoryValues = {};
		this.storageMemoryData = {};
		this.$buttonMemoryClear = null;
		this.$buttonMemoryRead = null;
		this.$buttonMemoryOpen = null;
		this.$memoryBoard = null;
		this.$buttonMemoryPlus = null;
		this.$buttonMemoryMinus = null;
		this.$buttonMemorySave = null;
		this.$buttonMemoryOpen = null;
		this.$btns = null;
	}

	buttonsEventSwitcher = (event) => {
		switch (event.target.dataset.memory) {
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

	addToMemory(data) {
		this.memoryValues[this.positionAttribute] = data;

		this.calc.isNeedNewValueToDisplay();

		let memory = document.querySelector('.js-memory');
		let memoryBlock = document.createElement('div');

		memoryBlock.className = 'memory__block';
		memoryBlock.setAttribute('data-position', this.positionAttribute);
		memory.insertBefore(memoryBlock, memory.children[0]);

		let memoryValue = document.createElement('div');

		memoryValue.className = 'memory__data';
		memoryValue.innerHTML = String(data);
		memoryBlock.appendChild(memoryValue);

		let btnMemoryClear = document.createElement('div');

		btnMemoryClear.className = 'memory__btn memory__btn_mc';
		btnMemoryClear.innerHTML = 'MC';
		btnMemoryClear.style.opacity = '0';
		memoryBlock.appendChild(btnMemoryClear);
		btnMemoryClear.addEventListener('click', (event) => {
			this.removeItem(event.target.parentElement);
			this.storageMemoryData.memoryValues = this.memoryValues;
			if (this.isEmpty()) {
				this.storageMemoryData.isActivatedMemoryButtons = false;
			}
			this.calc.updateLSData(this.storageMemoryData);
		});

		let btnMemoryPlus = document.createElement('div');

		btnMemoryPlus.className = 'memory__btn memory__btn_m_plus';
		btnMemoryPlus.innerHTML = 'M+';
		btnMemoryPlus.style.opacity = '0';
		memoryBlock.appendChild(btnMemoryPlus);

		btnMemoryPlus.addEventListener('click', (event) => {
			this.clickBtn(OPERATIONS.PLUS, event);
		});

		let btnMemoryMinus = document.createElement('div');

		btnMemoryMinus.className = 'memory__btn memory__btn_m_minus';
		btnMemoryMinus.innerHTML = 'M-';
		btnMemoryMinus.style.opacity = '0';
		memoryBlock.appendChild(btnMemoryMinus);

		btnMemoryMinus.addEventListener('click', (event) => {
			this.clickBtn(OPERATIONS.MINUS, event);
		});

		memoryBlock.addEventListener('mouseover', () => {
			btnMemoryClear.style.opacity = '1';
			btnMemoryClear.style.cursor = 'pointer';
			btnMemoryPlus.style.opacity = '1';
			btnMemoryPlus.style.cursor = 'pointer';
			btnMemoryMinus.style.opacity = '1';
			btnMemoryMinus.style.cursor = 'pointer';
		});

		memoryBlock.addEventListener('mouseout', () => {
			btnMemoryClear.style.opacity = '0';
			btnMemoryPlus.style.opacity = '0';
			btnMemoryMinus.style.opacity = '0';
		});

		this.positionAttribute++;
	}

	clickBtn(type, event) {
		let value = event.target.parentElement.childNodes[0].innerHTML;
		let displayValue = this.calc.getDisplayData();
		let position = event.target.parentElement.dataset.position;
		switch (type) {
			case OPERATIONS.MINUS: {
				this.minus(value, displayValue, position);
				break;
			}
			case OPERATIONS.PLUS: {
				this.plus(value, displayValue, position);
				break;
			}
		}
		this.storageMemoryData.memoryValues = this.memoryValues;
		this.calc.updateLSData(this.storageMemoryData);
		event.target.parentElement.childNodes[0].innerHTML = this.memoryValues[position];
	}


	plus(value, displayValue, position) {
		this.memoryValues[position] = String(parseFloat(value) + parseFloat(displayValue));
	}

	minus(value, displayValue, position) {
		this.memoryValues[position] = String(parseFloat(value) - parseFloat(displayValue));
	}

	clear() {
		this.storageMemoryData.memoryValues = {};
		this.storageMemoryData.isActivatedMemoryButtons = false;
		this.calc.updateLSData(this.storageMemoryData);
	}

	removeItem(elem) {
		elem.remove(elem);
		delete this.memoryValues[elem.dataset.position];
	}

	isEmpty() {
		return (Object.keys(this.memoryValues).length === 0);
	}

	setVisual() {		
		this.memory.isActivatedMemoryButtons = true;
		this.$buttonMemoryRead.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.remove('calc-add__button_disabled');
	}

	setDisabled() {
		this.$buttonMemoryRead.classList.add('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.add('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.add('calc-add__button_disabled');
	}

	buttonMemorySave = () => {
		if (this.isOpenMemoryWindow || !isFinite(parseFloat(this.calc.getDisplayData()))) {
			return;
		}

		this.isActivatedMemoryButtons = true;
		this.storageMemoryData.isActivatedMemoryButtons = this.isActivatedMemoryButtons;
		this.calc.updateLSData(this.storageMemoryData);

		this.$buttonMemoryRead.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		this.addToMemory(this.calc.getDisplayData());
		this.storageMemoryData.memoryValues = this.memoryValues;
		this.calc.updateLSData(this.storageMemoryData);
	};

	buttonMemoryOpen = () => {
		if (!this.isActivatedMemoryButtons) {
			return;
		}

		this.$memoryBoard.classList.toggle('visibility');
		this.$buttonMemoryClear.classList.toggle('calc-add__button_disabled');
		this.$buttonMemoryRead.classList.toggle('calc-add__button_disabled');
		this.$buttonMemoryPlus.classList.toggle('calc-add__button_disabled');
		this.$buttonMemoryMinus.classList.toggle('calc-add__button_disabled');
		this.$buttonMemorySave.classList.toggle('calc-add__button_disabled');

		if (this.isEmpty()) {
			this.isActivatedMemoryButtons = false;
			this.$buttonMemoryRead.classList.add('calc-add__button_disabled');
			this.$buttonMemoryClear.classList.add('calc-add__button_disabled');
			this.$buttonMemoryOpen.classList.add('calc-add__button_disabled');
			this.isActivatedMemoryButtons = false;
			this.storageMemoryData.isActivatedMemoryButtons = false;
			this.storageMemoryData = {};
			this.storageMemoryData.memoryValues = {};
			this.calc.updateLSData(this.storageMemoryData);
		}

		if (this.isOpenMemoryWindow) {
			this.isOpenMemoryWindow = false;
			return;
		}

		this.isOpenMemoryWindow = true;
	};

	buttonMemoryPlus = () => {
		if (this.isOpenMemoryWindow || !isFinite(parseFloat(this.calc.getDisplayData()))) {
			return;
		}

		this.isActivatedMemoryButtons = true;
		this.storageMemoryData.isActivatedMemoryButtons = this.isActivatedMemoryButtons;
		this.calc.updateLSData(this.storageMemoryData);

		this.$buttonMemoryRead.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		if (this.isEmpty()) {
			this.addToMemory(this.calc.getDisplayData());
		} else {
			let memoryBlock = document.querySelector('.memory__block');

			let value = memoryBlock.childNodes[0].innerHTML;
			let displayValue = this.calc.getDisplayData();
			let position = memoryBlock.dataset.position;

			this.plus(value, displayValue, position);

			memoryBlock.childNodes[0].innerHTML = this.memoryValues[position];
		}

		this.storageMemoryData.memoryValues = this.memoryValues;
		this.calc.updateLSData(this.storageMemoryData);
	};

	buttonMemoryMinus = () => {
		if (this.isOpenMemoryWindow || !isFinite(parseFloat(this.calc.getDisplayData()))) {
			return;
		}

		this.isActivatedMemoryButtons = true;
		this.storageMemoryData.isActivatedMemoryButtons = this.isActivatedMemoryButtons;
		this.calc.updateLSData(this.storageMemoryData);

		this.$buttonMemoryRead.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.remove('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.remove('calc-add__button_disabled');

		if (this.isEmpty()) {
			this.addToMemory(this.display.text);
		} else {
			let memoryBlock = document.querySelector('.memory__block');

			let value = memoryBlock.childNodes[0].innerHTML;
			let displayValue = this.calc.getDisplayData();
			let position = memoryBlock.dataset.position;

			
			this.minus(value, displayValue, position);

			memoryBlock.childNodes[0].innerHTML = this.memoryValues[position];
		}

		this.storageMemoryData.memoryValues = this.memoryValues;
		this.calc.updateLSData(this.storageMemoryData);
	};

	buttonMemoryRead = () => {
		if (!this.isActivatedMemoryButtons || this.isOpenMemoryWindow) {
			return;
		}

		let position = document.querySelector('.memory__block').dataset.position;

		this.calc.updateDisplay(this.memoryValues[position]);
		this.calc.updateIsEnteredNewValue();
	};

	buttonMemoryClear = () => {
		if (!this.isActivatedMemoryButtons || this.isOpenMemoryWindow) {
			return;
		}

		this.isActivatedMemoryButtons = false;
		this.$buttonMemoryRead.classList.add('calc-add__button_disabled');
		this.$buttonMemoryClear.classList.add('calc-add__button_disabled');
		this.$buttonMemoryOpen.classList.add('calc-add__button_disabled');
		this.$memoryBoard.innerHTML = '';
		this.clear();
	};

}

export default Memory;