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
    this.displayValueNow = null;
    this.isEnteredNewValue = true;
    this.values = [];
  }

  clear() {
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
    this.values = [];
  }

  updateSmallDisplay() {
    if (this.isPressedSingleOperation && !this.calc.getOperationPressed()) {
      this.$smallDisplay.innerHTML = '';
      this.values = [];
    }   

    if (this.isPressedSingleOperation && this.calc.getOperationPressed()) {
      this.$smallDisplay.innerHTML = '';
      this.values.pop();
      for (let i = 0; i < this.values.length; i++) {
        this.$hiddenDisplay.innerHTML += this.values[i];
        this.$smallDisplay.innerHTML += this.values[i];
      }
    }
  }

  numberPress(number) {
    this.updateSmallDisplay();

    this.isEnteredNewValue = true;
    this.$display.style.fontSize = STYLES.NORMAL;

       console.log(this.resultPressed);
    if ((this.$display.innerHTML === '0' || (this.needNewValue) || (this.resultPressed) || this.$display.innerHTML === MESSAGES.DIVIDE_BY_ZERO)) {
      this.$display.innerHTML = number;
      this.needNewValue = false;
      this.resultPressed = false;
      this.isPressedSingleOperation = false;

      return;
    }

    if (this.$display.innerHTML === '0.' && !this.needNewValue) {
      this.$display.innerHTML += number;
      this.resultPressed = false;

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
    this.updateSmallDisplay();

    if (this.resultPressed ||
      this.$display.innerHTML.indexOf('.') === -1 && this.needNewValue ||
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

  sendToSmallDisplay(type, operation) {
    this.needNewValue = true;
    this.$smallDisplay.style.removeProperty('left');
    this.$smallDisplay.style.right = 0;
    this.$smallDisplay.style.textAlign = 'right';

    switch (type) {
      case OPERATIONS.PERCENT: {
        if (!this.isPressedSingleOperation) {
          this.values.push(parseFloat(this.text));
          this.updateWitdhDisplay(type);
          this.sendData();
          this.isPressedSingleOperation = true;

          return;
        }

        this.values[this.values.length - 1] = parseFloat(this.text);
        this.updateWitdhDisplay(type);
        this.sendData();

        break;
      }
      case OPERATIONS.LABEL_SINGLE_OPERATION: {
        this.needNewValue = true;
        this.isEnteredNewValue = true;

        if (!this.isPressedSingleOperation) {
          this.values.push(`${NAME_FOR_DISPLAY[operation]}(${this.text})`);
          this.updateWitdhDisplay(type);
          this.sendData();
          this.isPressedSingleOperation = true;

          return;
        }

        this.values[this.values.length - 1] = `${NAME_FOR_DISPLAY[operation]}(${this.values[this.values.length - 1]})`;
        this.updateWitdhDisplay();
        this.sendData();

        break;
      }
      case OPERATIONS.LABEL_DEFAULT_OPERATION: {
        if (this.isPressedSingleOperation) {
          this.values.push(`&nbsp;${operation}&nbsp;`);
          this.updateWitdhDisplay(type);
          this.sendData();
          this.isPressedSingleOperation = false;

          return;
        }

        if (this.isEnteredNewValue) {
          this.values.push(parseFloat(this.text));
          this.values.push(`&nbsp;${operation}&nbsp;`);
          this.updateWitdhDisplay(type);
          this.sendData();

          return;
        }

        this.values[this.values.length - 1] = `&nbsp;${operation}&nbsp;`;
        this.updateWitdhDisplay(type);
        this.sendData();

        break;
      }
    }
  }

  sendData() {
    this.$smallDisplay.innerHTML = '';
    for (let i = 0; i < this.values.length; i++) {
      this.$smallDisplay.innerHTML += this.values[i];
    }
  }

  updateWitdhDisplay(type) {
    if (type === OPERATIONS.LABEL_DEFAULT_OPERATION && !this.isPressedSingleOperation) {
      this.$hiddenDisplay.innerHTML = `${this.values[this.values.length - 2]}${this.values[this.values.length - 1]}`;
    } else {      
      this.$hiddenDisplay.innerHTML = this.values[this.values.length - 1];
    }
    let width = this.$smallDisplay.clientWidth;
    if (this.values.length === 1) {
      width = 0;
    }
    if ((width + this.$hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
      this.$buttonMoveLeft.style.visibility = 'visible';
      this.$buttonMoveRight.style.visibility = 'visible';
      this.$smallDisplay.style.left = '';
      this.$smallDisplay.style.width = width + this.$hiddenDisplay.clientWidth;
    }
  }

}

export default Display;