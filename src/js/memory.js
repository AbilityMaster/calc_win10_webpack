let memory = document.querySelector('.memory'),
display = document.querySelector('.display');

class Memory {
	constructor() {
		this.MemoryActivatedButtons = false;
		this.openWindow = false;
	}

	addToMemory(data) {
		let self = this;

		this.needNewValue = true;

		let memory__block = document.createElement('div');

		memory__block.className = "memory__block";
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
			self.m_clear(this.parentElement);
		});

		let btn_m_plus = document.createElement('div');

		btn_m_plus.className = "memory__btn memory__btn_m_plus";
		btn_m_plus.innerHTML = 'M+';
		memory__block.appendChild(btn_m_plus);

		btn_m_plus.addEventListener('click', function() {
			let value = this.parentElement.childNodes[0].innerHTML;
			let displayValue = display.innerHTML;
			this.parentElement.childNodes[0].innerHTML = self.m_plus(value, displayValue);
		});

		let btn_m_minus = document.createElement('div');

		btn_m_minus.className = "memory__btn memory__btn_m_minus";
		btn_m_minus.innerHTML = 'M-';
		memory__block.appendChild(btn_m_minus);

		btn_m_minus.addEventListener('click', function() {
			let value = this.parentElement.childNodes[0].innerHTML;
			let displayValue = display.innerHTML;
			this.parentElement.childNodes[0].innerHTML = self.m_minus(value, displayValue);
		});

	}

	m_plus(value, displayValue) {
		return parseFloat(value) + parseFloat(displayValue); 
	}
	m_minus(value, displayValue) {
		return parseFloat(value) - parseFloat(displayValue); 
	}

	m_clear(elem) {
		elem.remove(elem);
	}
}

export default Memory;