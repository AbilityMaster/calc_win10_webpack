'use strict';
import calc from './calculator';


if (calc.storage.dataset.mode === 'closed') {
    calc.manage('closed');
    calc.template(document.querySelector('.root'));
}

if (calc.storage.dataset.mode !== 'closed') {
    calc.template(document.querySelector('.root'));
}

