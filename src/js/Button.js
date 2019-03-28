class Button {
	constructor() {}

	set type(type) {
		this.typeButton = type;
	}

	get type() {
		return this.typeButton;
	}
}

export default new Button();