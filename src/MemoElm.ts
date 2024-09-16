import { createDiv } from "./utils"

interface MemoItem {
	outer: HTMLDivElement
	typeId: string
	getTitle(): string
	getValue(): string | number | null

	setTitle(title: string): void
	setValue(val: string | number | null): void
}

function memoItemToJsonObj(item: MemoItem) {
	let type = (() => {
		if (item.typeId === MemoMapName.TYPE_ID) {
			return "memo-map-name"
		}
		else {
			throw Error("???")
		}
	})()

	let value = item.getValue()
	let title = item.getTitle()

	return {
		type,
		value,
		title
	}
}
function memoItemFromJsonObj(obj: any) {
	let item = ((): MemoItem => {
		if (obj.type === MemoMapName.TYPE_ID) {
			return new MemoMapName()
		}
		else {
			throw Error()
		}
	})()

	item.setTitle(obj.title)
	item.setValue(obj.value)

	return item
}

export class MemoMapName implements MemoItem {
	static TYPE_ID = "memo-map-name"

	outer: HTMLDivElement
	inputBox: HTMLInputElement
	titleBox: HTMLDivElement
	typeId: string;
	constructor() {
		this.typeId = MemoMapName.TYPE_ID
		this.outer = createDiv("base-memo-item-outer memo-box")

		this.titleBox = createDiv("map-name-title-box")
		this.titleBox.innerText = "マップ名"
		this.inputBox = document.createElement("input")
		this.inputBox.type = "text"
		this.inputBox.classList.add("map-name-input-box")
		this.inputBox.value = "map-" + crypto.randomUUID()

		this.outer.appendChild(this.titleBox)
		this.outer.appendChild(this.inputBox)

	}

	getTitle(): string {
		return "mapName"
	}
	getValue(): string {
		return this.inputBox.value
	}
	setTitle(title: string): void {
		this.titleBox.innerText = title
	}
	setValue(val: string | number | null): void {
		if (typeof val !== "string") {
			throw Error()
		}
		this.inputBox.value = val
	}
}

export class MemoElm {
	outer: HTMLDivElement
	itemOuter: HTMLDivElement
	items: MemoItem[]

	constructor() {
		this.outer = createDiv("")
		this.itemOuter = createDiv("")
		this.items = []

		this.outer.appendChild(this.itemOuter)
	}

	add(item: MemoItem) {
		this.itemOuter.appendChild(item.outer)
		this.items.push(item)
	}

	toJsonObj() {
		return this.items.map(item => memoItemToJsonObj(item))
	}

	loadJsonObj(obj: any) {
		if (!(obj instanceof Array)) {
			throw Error()
		}

		this.itemOuter.innerHTML = ""
		this.items = []

		obj.forEach(objChild => {
			this.add(memoItemFromJsonObj(objChild))
		})
	}

}