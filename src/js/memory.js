import { calc } from './index';
import { OPERATIONS } from './const';

class Memory {
	constructor() {
		this.isActivatedMemoryButtons = false;
		this.isOpenMemoryWindow = false;
		this.positionAttribute = 0;
		this.memoryValues = {};
		this.storageMemoryData = {};
	}

	get template() {
		return {
			buttons: ` 
			<div class="calc calc-add">
				<div class="calc-add__button calc-add__button_memory-clear js-calc-add__button_memory-clear calc-add__button_disabled" data-add="${OPERATIONS.ADDITIONAL.MCLEAR}">MC</div>
				<div class="calc-add__button calc-add__button_read js-calc-add__button_read calc-add__button_disabled" data-add="${OPERATIONS.ADDITIONAL.MREAD}">MR</div>
				<div class="calc-add__button calc-add__button_plus js-calc-add__button_plus" data-add="${OPERATIONS.ADDITIONAL.MPLUS}">M<span>+</span></div>
				<div class="calc-add__button calc-add__button_minus js-calc-add__button_minus" data-add="${OPERATIONS.ADDITIONAL.MMINUS}">M<span>-</span></div>
				<div class="calc-add__button calc-add__button_ms js-calc-add__button_ms" data-add="${OPERATIONS.ADDITIONAL.MSAVE}">MS</div>
				<div class="calc-add__button calc-add__button_memory js-calc-add__button_memory calc-add__button_disabled" data-add="${OPERATIONS.ADDITIONAL.MEMORY}">M</div>
			</div> 
			`,
			memoryArea: '<div class="memory js-memory">'
		};
	}

	addToMemory(data) {
		this.memoryValues[this.positionAttribute] = data;

		calc.needNewValue = true;

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
			this.clear(event.target.parentElement);
			this.storageMemoryData.memoryValues = this.memoryValues;
			calc.localStorage.dataset = this.storageMemoryData;
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
		let displayValue = calc.disp.text;
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
		calc.localStorage.dataset = this.storageMemoryData;
		event.target.parentElement.childNodes[0].innerHTML = this.memoryValues[position];
	}


	plus(value, displayValue, position) {
		this.memoryValues[position] = String(parseFloat(value) + parseFloat(displayValue));
	}

	minus(value, displayValue, position) {
		this.memoryValues[position] = String(parseFloat(value) - parseFloat(displayValue));
	}

	clear(elem) {
		elem.remove(elem);
		delete this.memoryValues[elem.dataset.position];
	}

	isEmpty() {
		return (Object.keys(this.memoryValues).length === 0);
	}
}

export default Memory;