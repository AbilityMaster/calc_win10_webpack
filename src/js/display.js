import {MAX_WIDTH_DISPLAY, MAX_LENGTH_DISPLAY, NAME_FOR_DISPLAY, OPERATIONS, MESSAGES, STYLES} from './const';
import calc from './calculator';
import { strict } from 'assert';

class Display {
  constructor() {
    this.valueArray = [];
    this.needNewValue = false;
    this.maxLength = MAX_LENGTH_DISPLAY;
    this.isPressedSingleOperation = false;
  }

  displayClear() {
    this.valueArray = [];
    this.needNewValue = false;
    this.display.innerHTML = '0';
    this.smallDisplay.innerHTML = '';
    this.smallDisplay.style.width = '';
    this.hiddenDisplay.innerHTML = '';
    this.hiddenDisplay.style.width = '';
    this.arrowLeft.style.visibility = 'hidden';
    this.arrowRight.style.visibility = 'hidden';
    this.isEnteredNewValue = false;
    this.isPressedSingleOperation = false;
  }

  numberPress(number) {
    if (calc.operationsDisabled) {
      calc.operationsDisabled = false;
      this.displayClear();
      calc.activateButtons();
    }


    this.isEnteredNewValue = true;
    this.display.style.fontSize = STYLES.NORMAL;

    if (this.display.innerHTML === '0.') {
      this.display.innerHTML += number;
      this.needNewValue = false;
      this.resultPressed = false;

      return;
    }

    if ((this.display.innerHTML === '0' || (this.needNewValue) || (this.resultPressed) || this.display.innerHTML === MESSAGES.DIVIDE_BY_ZERO)) {
			
      this.display.innerHTML = number;
      this.needNewValue = false;
      this.resultPressed = false;
      this.isPressedSingleOperation = false;
    } else {
      if (String(this.text).length >= this.maxLength) {
        return;
      }
      let a = this.text;
      a += number;
      this.text = a;

    }
  }

  set text(data) {
    let formatter = new Intl.NumberFormat('ru');    
    this.display.innerHTML = formatter.format(data);
  }

  get text() {
    let data = this.display.innerHTML;
    data = data.replace(/\&nbsp\;/g,"\xa0");
    data = data.replace(/\s+/g, '');
    return parseFloat(data);
  }

  get template() {
    return `
		<div class="group-small-display js_group-small-display">
		<div class="small-display__button small-display__button_left js_small-display__button_left"></div>
		<div class="small-display">
		<div class="small-display__block js_small-display__block"></div>
		<div class="small-display__add js_small-display__add"></div>
		</div>
		<div class="small-display__button small-display__button_right js_small-display__button_right"></div>
		</div>
		<div class="display js_display">0</div> `;
  }

  addPoint() {
    if (calc.operationsDisabled) {
      return;
    }

    if (this.display.innerHTML.indexOf('.') === -1 && this.needNewValue || this.display.innerHTML.indexOf('.') === -1 && this.resultPressed || this.display.innerHTML.indexOf('.') !== -1 && this.needNewValue ||		this.display.innerHTML.indexOf('.') !== -1 && this.resultPressed) {
      this.display.innerHTML = '0.';
      this.needNewValue = false;
			
      return;
    } 

    if (this.display.innerHTML.indexOf('.') === -1) {
      this.display.innerHTML += '.';
    }
  }

  backspace() {
    let length = String(this.text).length;
    if (length === 2 && String(this.text)[0] === '-' || length === 1) {
      this.text = '0';

      return;
    }

    if (this.text === MESSAGES.DIVIDE_BY_ZERO || this.text === MESSAGES.OVERFLOW || this.text === MESSAGES.UNCORRECT_DATA) {
      this.smallDisplay.innerHTML = '';
      this.display.style.fontSize = STYLES.NORMAL;
      calc.operationsDisabled = false;
      this.text = '0';
      calc.activateButtons();

      return;
    }

    this.text = String(this.text).slice(0,length-1);	
  }

  sendToStatusDisplay(typeOperation, operation) {
    switch (typeOperation) {
      case OPERATIONS.LABEL_SINGLE_OPERATION: {
        if (!this.isPressedSingleOperation) {
          this.data = this.smallDisplay.innerHTML;
          this.dataWidth = this.smallDisplay.clientWidth;

          if (operation === OPERATIONS.PERCENT) {
            this.valueArray.push(calc.operations.percent());
            this.smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
          } else {
            this.valueArray.push(`${NAME_FOR_DISPLAY[operation]}(${this.text})`);
            this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}&nbsp;`;

            if ((this.dataWidth + this.hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
              this.arrowLeft.style.visibility = 'visible';
              this.arrowRight.style.visibility = 'visible';
              this.smallDisplay.style.left = '';
              this.smallDisplay.style.width = this.dataWidth + this.hiddenDisplay.clientWidth;
            }

            this.smallDisplay.innerHTML += `&nbsp;${NAME_FOR_DISPLAY[operation]}(${this.text})&nbsp;`;
          }
        }
        if (this.isPressedSingleOperation) {
          if (operation ===  OPERATIONS.PERCENT) {
            this.valueArray[this.valueArray.length-1] = calc.operations.percent();
            this.smallDisplay.innerHTML = `${this.data}&nbsp;${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
          } else {
            this.valueArray[this.valueArray.length-1] = `${NAME_FOR_DISPLAY[operation]}(${this.valueArray[this.valueArray.length - 1]})`;
            this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}&nbsp;`;

            if ((this.dataWidth + this.hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
              this.arrowLeft.style.visibility = 'visible';
              this.arrowRight.style.visibility = 'visible';
              this.smallDisplay.style.left = '';
              this.smallDisplay.style.width = this.dataWidth + this.hiddenDisplay.clientWidth;
            }

            this.smallDisplay.innerHTML = `${this.data}&nbsp;${this.valueArray[this.valueArray.length - 1]}&nbsp;`;
          }
        }

        break;
      }
      case OPERATIONS.LABEL_DEFAULT_OPERATION: {
        if (this.isEnteredNewValue && this.isPressedSingleOperation) {
          this.valueArray.push(operation);
          this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
          this.addDisplayWidth();
          this.smallDisplay.innerHTML += this.valueArray[this.valueArray.length-1];
        } else if (this.isEnteredNewValue) {
          this.valueArray.push(this.text);
          this.valueArray.push(operation);
          this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;
          if ((this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
            this.arrowLeft.style.visibility = 'visible';
            this.arrowRight.style.visibility = 'visible';
            this.smallDisplay.style.left = '';
            this.smallDisplay.style.width = this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth;
          }
          this.smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-2]}`;
          this.smallDisplay.innerHTML += `&nbsp;${this.valueArray[this.valueArray.length-1]}`;
        } 

        this.valueArray[this.valueArray.length - 1] = operation;	
        this.hiddenDisplay.innerHTML = `&nbsp;${this.valueArray[this.valueArray.length-2]} ${this.valueArray[this.valueArray.length-1]}`;
        this.smallDisplay.innerHTML = this.smallDisplay.innerHTML.slice(0, this.smallDisplay.innerHTML.length-1) + this.valueArray[this.valueArray.length-1];

        break;
      }
    }
  }

  addDisplayWidth() {
    if ((this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth) >= MAX_WIDTH_DISPLAY) {
      this.arrowLeft.style.visibility = 'visible';
      this.arrowRight.style.visibility = 'visible';
      this.smallDisplay.style.left = '';
      this.smallDisplay.style.width = this.smallDisplay.clientWidth + this.hiddenDisplay.clientWidth;
    }
  }

}

export default Display;