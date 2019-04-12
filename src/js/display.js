import { MAX_WIDTH_DISPLAY, MAX_LENGTH_DISPLAY, NAME_FOR_DISPLAY, OPERATIONS, MESSAGES, STYLES } from './const';

class Display {
  constructor(props) {
    this.calc = props;
    this.valueArray = [];
    this.needNewValue = false;
    this.maxLength = MAX_LENGTH_DISPLAY;
    this.isPressedSingleOperation = false;
    this.$display = null;
    this.$smallDisplay = null;
    this.$hiddenDisplay = null;
    this.$buttonMoveLeft = null;
    this.$buttonMoveRight = null;
  }

  clear() {
    this.valueArray = [];
    this.needNewValue = false;
    this.$display.innerHTML = '0';
    this.$smallDisplay.innerHTML = '';
    this.$smallDisplay.style.width = '';
    this.$hiddenDisplay.innerHTML = '';
    this.$hiddenDisplay.style.width = '';
    this.$buttonMoveLeft.style.visibility = 'hidden';
    this.$buttonMoveRight.style.visibility = 'hidden';
    this.isEnteredNewValue = false;
    this.isPressedSingleOperation = false;
  }

  numberPress(number) {
    if (this.isPressedSingleOperation && !this.calc.getOperationPressed()) {
      this.$smallDisplay.innerHTML = '';
      this.valueArray = [];
    }

    if (this.isPressedSingleOperation && this.calc.getOperationPressed()) {
      this.$smallDisplay.innerHTML = '';
      this.valueArray.pop();
      for( let i = 0; i < this.valueArray.length; i++) {
        this.$smallDisplay.innerHTML += this.valueArray[i];
      }
      this.valueArray = [];
    }

    this.isEnteredNewValue = true;
    this.$display.style.fontSize = STYLES.NORMAL;   

    if (this.$display.innerHTML === '0.') {
      this.$display.innerHTML += number;
      this.needNewValue = false;
      this.resultPressed = false;

      return;
    }

    if ((this.$display.innerHTML === '0' || (this.needNewValue) || (this.resultPressed) || this.$display.innerHTML === MESSAGES.DIVIDE_BY_ZERO)) {
      this.$display.innerHTML = number;
      this.needNewValue = false;
      this.resultPressed = false;
      this.isPressedSingleOperation = false;

      return;
    }

    if (String(this.text).length >= this.maxLength) {
      return;
    }

    this.text += number;
  }

  formatText(data) {
    if (String(data).indexOf(',') === -1 && String(data).indexOf('.') === -1 && !isNaN(data)) {
      let formatter = new Intl.NumberFormat('ru');

      return formatter.format(data);
    }

    return data;
  }

  set text(data) {
    this.$display.innerHTML = this.formatText(data);
  }

  get text() {
    let data = this.$display.innerHTML;
    data = data.replace(/\&nbsp\;/g, "\xa0");
    data = data.replace(/\s+/g, '');
    data = data.replace(',', '.');

    return data;
  }

  get template() {
    return `
		<div class="group-small-display js-group-small-display">
		  <div class="small-display__button small-display__button_left js-small-display__button_left"></div>
		  <div class="small-display">
		    <div class="small-display__block js-small-display__block"></div>
		    <div class="small-display__add js-small-display__add"></div>
		  </div>
		  <div class="small-display__button small-display__button_right js-small-display__button_right"></div>
		</div>
		<div class="display js-display">0</div> `;
  }

  init() {
    this.$display = document.querySelector('.js-display');
    this.$smallDisplay = document.querySelector('.js-small-display__block');
    this.$hiddenDisplay = document.querySelector('.js-small-display__add');
    this.$buttonMoveLeft = document.querySelector('.small-display__button_left');
    this.$buttonMoveRight = document.querySelector('.small-display__button_right');
    this.$smallDisplay.style.left = 0;
    this.addEvents();
  }

  addEvents() {
    this.$buttonMoveLeft.addEventListener('click', this.buttonMoveLeft);
    this.$buttonMoveRight.addEventListener('click', this.buttonMoveRight);
  }

  sendToRecycle() {
    this.$buttonMoveLeft.removeEventListener('click', this.buttonMoveLeft);
    this.$buttonMoveRight.removeEventListener('click', this.buttonMoveRight);
  }

  buttonMoveLeft = () => {
    if (this.$smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
      this.$smallDisplay.style.removeProperty('right');
      this.$smallDisplay.style.left = 0;
      this.$smallDisplay.style.textAlign = 'left';
    }
  };

  buttonMoveRight = () => {
    if (this.$smallDisplay.clientWidth > MAX_WIDTH_DISPLAY) {
      this.$smallDisplay.style.removeProperty('left');
      this.$smallDisplay.style.right = 0;
      this.$smallDisplay.style.textAlign = 'right';
    }
  };

  addPoint() {
    this.$smallDisplay.style.removeProperty('left');
    this.$smallDisplay.style.right = 0;

    if (this.isPressedSingleOperation && !this.calc.getOperationPressed()) {
      this.$smallDisplay.innerHTML = '';
      this.valueArray = [];
    }

    if (this.isPressedSingleOperation && this.calc.getOperationPressed()) {
      this.$smallDisplay.innerHTML = '';
      this.valueArray.pop();
      for( let i = 0; i < this.valueArray.length; i++) {
        this.$smallDisplay.innerHTML += this.valueArray[i];
      }
      this.valueArray = [];
    }

    if (this.$display.innerHTML.indexOf('.') === -1 && this.needNewValue ||
      this.$display.innerHTML.indexOf('.') === -1 && this.resultPressed ||
      this.$display.innerHTML.indexOf('.') !== -1 && this.needNewValue ||
      this.$display.innerHTML.indexOf('.') !== -1 && this.resultPressed) {
        
      this.$display.innerHTML = '0.';
      this.needNewValue = false;

      return;
    }

    if (this.$display.innerHTML.indexOf('.') === -1) {
      this.$display.innerHTML += '.';
    }
  }

  backspace() {
    if (this.text.indexOf('e') !== -1 || this.isPressedSingleOperation) {
      return;
    }

    if (this.text.length === 2 && this.text[0] === '-' || this.text.length === 1) {
      this.text = '0';

      return;
    }
  
    if (this.$display.innerHTML === MESSAGES.DIVIDE_BY_ZERO || this.$display.innerHTML === MESSAGES.OVERFLOW || this.$display.innerHTML === MESSAGES.UNCORRECT_DATA) {
      this.$smallDisplay.innerHTML = '';
      this.$display.style.fontSize = STYLES.NORMAL;
      this.text = '0';
      this.calc.updateStateDisabledButtons();

      return;
    }

    this.text = this.text.slice(0, this.text.length - 1);
  }

  sendToStatusDisplay(typeOperation, operation) {    
    this.$smallDisplay.style.removeProperty('left');
    this.$smallDisplay.style.right = 0;
    switch (typeOperation) {
      case OPERATIONS.LABEL_SINGLE_OPERATION: {
        this.sendToStatusDisplaySingleOperation(typeOperation, operation);
        this.isPressedSingleOperation = true;
        this.needNewValue = true;
        this.isEnteredNewValue = true;

        break;
      }
      case OPERATIONS.LABEL_DEFAULT_OPERATION: {
        this.sendToStatusDisplayDefaultOperation(typeOperation, operation);
        this.isPressedSingleOperation = false;
        this.needNewValue = true;

        break;
      }
    }
  }

  detectMaxWidth(typeOperation) {
    switch (typeOperation) {
      case OPERATIONS.LABEL_SINGLE_OPERATION: {
        if ((this.dataWidth + this.$hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
          this.$buttonMoveLeft.style.visibility = 'visible';
          this.$buttonMoveRight.style.visibility = 'visible';
          this.$smallDisplay.style.left = '';
          this.$smallDisplay.style.width = this.dataWidth + this.$hiddenDisplay.clientWidth;
        }

        break;
      }
      case OPERATIONS.LABEL_DEFAULT_OPERATION: {
        if ((this.$smallDisplay.clientWidth + this.$hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
          this.$buttonMoveLeft.style.visibility = 'visible';
          this.$buttonMoveRight.style.visibility = 'visible';
          this.$smallDisplay.style.left = '';
          this.$smallDisplay.style.width = this.$smallDisplay.clientWidth + this.$hiddenDisplay.clientWidth;
        }

        break;
      }
    }
  }

  sendToStatusDisplaySingleOperation(typeOperation, operation) {
    if (!this.isPressedSingleOperation) {
      this.data = this.$smallDisplay.innerHTML;
      this.dataWidth = this.$smallDisplay.clientWidth;

      if (operation === OPERATIONS.PERCENT) {
        this.valueArray.push(this.calc.resultPercentOperation());
        this.$smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length - 1]}`;
      } else {
        this.valueArray.push(`${NAME_FOR_DISPLAY[operation]}(${this.text})`);
        this.$hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
        this.detectMaxWidth(typeOperation);
        this.$smallDisplay.innerHTML += `&nbsp;${NAME_FOR_DISPLAY[operation]}(${this.text})&nbsp;`;
      }
    }
    if (this.isPressedSingleOperation) {
      if (operation === OPERATIONS.PERCENT) {
        this.valueArray[this.valueArray.length - 1] = this.calc.resultPercentOperation();
        this.$smallDisplay.innerHTML = `${this.data}&nbsp;${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
      } else {
        this.valueArray[this.valueArray.length - 1] = `${NAME_FOR_DISPLAY[operation]}(${this.valueArray[this.valueArray.length - 1]})`;
        this.$hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length - 1]}&nbsp;`;

        this.detectMaxWidth(typeOperation);

        this.$smallDisplay.innerHTML = `${this.data}&nbsp;${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
      }
    }
  }

  sendToStatusDisplayDefaultOperation(typeOperation, operation) {
    if (this.isEnteredNewValue && this.isPressedSingleOperation) {
      this.valueArray.push(operation);
      this.$hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length - 1]}`;
      this.addDisplayWidth();
      this.$smallDisplay.innerHTML += this.valueArray[this.valueArray.length - 1];
    } else if (this.isEnteredNewValue) {
      this.valueArray.push(this.text);
      this.valueArray.push(operation);
      this.$hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length - 2]} ${this.valueArray[this.valueArray.length - 1]}`;
      this.detectMaxWidth(typeOperation);
      this.$smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length - 2]}`;
      this.$smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length - 1]}`;
    }

    this.valueArray[this.valueArray.length - 1] = operation;
    this.$hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length - 2]} ${this.valueArray[this.valueArray.length - 1]}`;
    this.$smallDisplay.innerHTML = this.$smallDisplay.innerHTML.slice(0, this.$smallDisplay.innerHTML.length - 1) + this.valueArray[this.valueArray.length - 1];
  }

  addDisplayWidth() {
    if ((this.$smallDisplay.clientWidth + this.$hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
      this.$buttonMoveLeft.style.visibility = 'visible';
      this.$buttonMoveRight.style.visibility = 'visible';
      this.$smallDisplay.style.left = '';
      this.$smallDisplay.style.width = this.$smallDisplay.clientWidth + this.$hiddenDisplay.clientWidth;
    }
  }

}

export default Display;