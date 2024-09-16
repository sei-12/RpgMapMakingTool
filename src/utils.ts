
export function createDiv(className: string): HTMLDivElement {
	const div = document.createElement("div")
	div.className = className
	return div
}

export class MouseStatus {
	onmousedown: boolean
	constructor() {
		// この時押されてたらバグる笑
		this.onmousedown = false

		window.onmousedown = () => { this.onmousedown = true }
		window.onmouseup = () => { this.onmousedown = false }
	}
}