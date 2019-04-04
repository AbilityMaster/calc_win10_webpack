import {VERSION} from './const';

class lc {
	constructor(version) {
		this.key = VERSION;
	}

	set dataset(obj) {
		let temp = JSON.parse(localStorage.getItem(this.key));

		if (temp) {
			for (let key in temp) {
				if (obj[key]) {
					temp[key] = obj[key]
				}
			}
			for (let key in obj) {
				if (temp[key] === undefined) {
					temp[key] = obj[key];
				}
			}
			localStorage.setItem(this.key, JSON.stringify(temp));
			
			return;
		} 
		localStorage.setItem(this.key, JSON.stringify(obj));
	}

	get dataset() {
		return JSON.parse(localStorage.getItem(this.key));
	}
}

export default lc;