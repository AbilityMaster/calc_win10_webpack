import calc from './calculator';

class Memory {
	constructor() {
		this.isActivatedMemoryButtons = false;
		this.isOpenMemoryWindow = false;
		this.positionAttribute = 0;
		this.memoryValues = {};
		this.storageMemoryData = {};
	}

	addToMemory(data) {
		this.memoryValues[this.positionAttribute] = data;

		this.needNewValue = true;

		let memory__block = document.createElement('div');

		memory__block.className = 'memory__block';
		memory__block.setAttribute('data-position', this.positionAttribute);
		this.memory.insertBefore(memory__block, this.memory.children[0]);

		let memoryValue = document.createElement('div');

		memoryValue.className = 'memory__data';
		memoryValue.innerHTML = String(data);
		memory__block.appendChild(memoryValue);

		let btn_mc = document.createElement('div');

		btn_mc.className = 'memory__btn memory__btn_mc';
		btn_mc.innerHTML = 'MC';
		memory__block.appendChild(btn_mc);
		btn_mc.addEventListener('click', (event) => {
			this.clear(event.target.parentElement);
			this.storageMemoryData.memoryValues = this.memoryValues;
			calc.storage.dataset = this.storageMemoryData;			
		});

		let btn_m_plus = document.createElement('div');

		btn_m_plus.className = 'memory__btn memory__btn_m_plus';
		btn_m_plus.innerHTML = 'M+';
		memory__block.appendChild(btn_m_plus);

		btn_m_plus.addEventListener('click', (event) => {
			let value = event.target.parentElement.childNodes[0].innerHTML;
			let displayValue = this.display.innerHTML;
			let position = event.target.parentElement.dataset.position;

			this.plus(value, displayValue, position);
			this.storageMemoryData.memoryValues = this.memoryValues;
			calc.storage.dataset = this.storageMemoryData;
			event.target.parentElement.childNodes[0].innerHTML = this.memoryValues[position];
		});

		let btn_m_minus = document.createElement('div');

		btn_m_minus.className = 'memory__btn memory__btn_m_minus';
		btn_m_minus.innerHTML = 'M-';
		memory__block.appendChild(btn_m_minus);

		btn_m_minus.addEventListener('click', (event) => {
			let value = event.target.parentElement.childNodes[0].innerHTML;
			let displayValue = this.display.innerHTML;
			let position = event.target.parentElement.dataset.position;

			this.minus(value, displayValue, position);
			this.storageMemoryData.memoryValues = this.memoryValues;
			calc.storage.dataset = this.storageMemoryData;
			event.target.parentElement.childNodes[0].innerHTML = this.memoryValues[position];
		});

		this.positionAttribute++;
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
		return (Object.keys(this.memoryValues).length === 0) ? true : false;		
	}
}

export default Memory;