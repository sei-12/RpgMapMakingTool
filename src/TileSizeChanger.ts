import { MapContainer } from "./MapContainer"
import { createDiv } from "./utils"

export const DEFAULT_TILE_SIZE_PX = 50

export class TileSizeChanger {
	
	static getTileSizePx() {
		let curSizeStr = document.body.style.getPropertyValue("--tile-size")
		let curSize = Number(curSizeStr.replace("px", ""))

		// 一番初めは0になってしまう
		if (curSize == 0) {
			curSize = 50
		}

		return curSize
	}


	outer: HTMLDivElement
	private range: HTMLInputElement

	// private decoyTileElm: HTMLDivElement

	constructor(mapContainer: MapContainer) {
		this.outer = createDiv("tile-size-manager-outer")

		const display = document.createElement("input")
		display.type = "number"
		display.value = DEFAULT_TILE_SIZE_PX + ""

		this.range = document.createElement("input")
		this.range.classList.add("aaa")
		this.range.type = "range"
		this.range.max = 350 + ""
		this.range.min = 5 + ""

		const initButton = document.createElement("input")
		initButton.type = "button"
		initButton.value = "init"

		document.body.style.setProperty("--tile-size", DEFAULT_TILE_SIZE_PX+"px")
		this.range.value = DEFAULT_TILE_SIZE_PX + ""

		const handleInputRange = () => {
			let target = this.range
			document.body.style.setProperty("--tile-size", target.value + "px")
			display.value = target.value
			mapContainer.handleChangeTileSize()
		}

		display.addEventListener("change", () => {
			this.range.value = display.value
			handleInputRange()
		})
		initButton.addEventListener("click", () => {
			this.range.value = DEFAULT_TILE_SIZE_PX + ""
			handleInputRange()
		})

		this.range.addEventListener("input", () => { handleInputRange() })
		this.outer.appendChild(this.range)
		this.outer.appendChild(display)
		this.outer.appendChild(initButton)

		display.innerText = TileSizeChanger.getTileSizePx() + "px"
	}

}