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

		calc.needNewValue = true;

		let memory = document.querySelector('.js_memory');
		let memoryBlock = document.createElement('div');
		
		memoryBlock.className = 'memory__block';
		memoryBlock.setAttribute('data-position', this.positionAttribute);
		memory.insertBefore(memoryBlock, memory.children[0]);

		let memoryValue = document.createElement('div');

		memoryValue.className = 'memory__data';
		memoryValue.innerHTML = String(data);
		memoryBlock.appendChild(memoryValue);

		let btnMc = document.createElement('div');

		btnMc.className = 'memory__btn memory__btn_mc';
		btnMc.innerHTML = 'MC';
		memoryBlock.appendChild(btnMc);
		btnMc.addEventListener('click', (event) => {
			this.clear(event.target.parentElement);
			this.storageMemoryData.memoryValues = this.memoryValues;
			calc.localStorage.dataset = this.storageMemoryData;			
		});

		let btnMemoryPlus = document.createElement('div');

		btnMemoryPlus.className = 'memory__btn memory__btn_m_plus';
		btnMemoryPlus.innerHTML = 'M+';
		memoryBlock.appendChild(btnMemoryPlus);

		btnMemoryPlus.addEventListener('click', (event) => {
			let value = event.target.parentElement.childNodes[0].innerHTML;
			let displayValue = calc.disp.text;
			let position = event.target.parentElement.dataset.position;

			this.plus(value, displayValue, position);
			this.storageMemoryData.memoryValues = this.memoryValues;
			calc.localStorage.dataset = this.storageMemoryData;
			event.target.parentElement.childNodes[0].innerHTML = this.memoryValues[position];
		});

		let btnMemoryMinus = document.createElement('div');

		btnMemoryMinus.className = 'memory__btn memory__btn_m_minus';
		btnMemoryMinus.innerHTML = 'M-';
		memoryBlock.appendChild(btnMemoryMinus);

		btnMemoryMinus.addEventListener('click', (event) => {
			let value = event.target.parentElement.childNodes[0].innerHTML;
			let displayValue = calc.disp.text;
			let position = event.target.parentElement.dataset.position;

			this.minus(value, displayValue, position);
			this.storageMemoryData.memoryValues = this.memoryValues;
			calc.localStorage.dataset = this.storageMemoryData;
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
		return (Object.keys(this.memoryValues).length === 0);		
	}
}

export default Memory;