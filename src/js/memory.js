let memory = document.querySelector('.memory'),
display = document.querySelector('.display');

class Memory {
	constructor() {
		this.isActivatedMemoryButtons = false;
		this.isOpenMemoryWindow = false;
		this.positionAttribute = 0;
		this.memoryValues = {};
	}

	addToMemory(data) {
		let self = this;

		this.memoryValues[this.positionAttribute] = data;

		this.needNewValue = true;

		let memory__block = document.createElement('div');

		memory__block.className = "memory__block";
		memory__block.setAttribute('data-position', this.positionAttribute);
		memory.insertBefore(memory__block, memory.children[0]);

		let memoryValue = document.createElement('div');

		memoryValue.className = "memory__data";
		memoryValue.innerHTML = data;
		memory__block.appendChild(memoryValue);

		let btn_mc = document.createElement('div');

		btn_mc.className = "memory__btn memory__btn_mc";
		btn_mc.innerHTML = 'MC';
		memory__block.appendChild(btn_mc);
		btn_mc.addEventListener('click', function() {
			self.clear(this.parentElement);
		});

		let btn_m_plus = document.createElement('div');

		btn_m_plus.className = "memory__btn memory__btn_m_plus";
		btn_m_plus.innerHTML = 'M+';
		memory__block.appendChild(btn_m_plus);

		btn_m_plus.addEventListener('click', function(event) {
			let value = this.parentElement.childNodes[0].innerHTML;
			let displayValue = display.innerHTML;
			self.memoryValues[this.parentElement.dataset.position] = self.plus(value, displayValue);
			this.parentElement.childNodes[0].innerHTML = self.memoryValues[this.parentElement.dataset.position];
		});

		let btn_m_minus = document.createElement('div');

		btn_m_minus.className = "memory__btn memory__btn_m_minus";
		btn_m_minus.innerHTML = 'M-';
		memory__block.appendChild(btn_m_minus);

		btn_m_minus.addEventListener('click', function() {
			let value = this.parentElement.childNodes[0].innerHTML;
			let displayValue = display.innerHTML;
			self.memoryValues[this.parentElement.dataset.position] = self.minus(value, displayValue);
			this.parentElement.childNodes[0].innerHTML = self.memoryValues[this.parentElement.dataset.position];
		});

		this.positionAttribute++;
	}

	plus(value, displayValue) {
		return String(parseFloat(value) + parseFloat(displayValue));
	}
	minus(value, displayValue) {
		return String(parseFloat(value) - parseFloat(displayValue)); 
	}

	clear(elem) {
		elem.remove(elem);
		delete this.memoryValues[elem.dataset.position];
	}

	isEmpty() {
		return (Object.keys(this.memoryValues).length === 0) ? true : false;		
	}
}

export default new Memory();