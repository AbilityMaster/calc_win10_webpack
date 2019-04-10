'use strict';
import calc from './calculator';


if (calc.storage.dataset.mode === 'closed') {
    calc.manage('closed');
    calc.init(document.querySelector('.root'));
}

if (calc.storage.dataset.mode !== 'closed') {
    calc.init(document.querySelector('.root'));
}

