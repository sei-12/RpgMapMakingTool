import { Layer } from "./Layer"
import { TileSizeChanger } from "./TileSizeChanger"
import { createDiv } from "./utils"

export class MapContainer {

	exportJsonObj() {
		return {
			layers: this.layers.map( layer => layer.toJsonObj() ),
			rows: this.rows,
			cols: this.cols
		}
	}

	loadJsonObj(obj: any) {
		this.layersOuter.innerHTML = ""
		this.cols = obj.cols
		this.rows = obj.rows
		
		this.layers = obj.layers.map( (layerObj: any) => Layer.fromJsonObj(layerObj) )
		this.layers.forEach( layer => this.layersOuter.appendChild(layer.outer))
		this.setLayerOuterSize()
	}

	outer: HTMLDivElement
	private layersOuter: HTMLDivElement
	private layers: Layer[]
	rows: number
	cols: number

	constructor() {
		this.outer = createDiv("map-outer")
		this.layersOuter = createDiv("map-layers-outer")
		this.outer.appendChild(this.layersOuter)

		this.cols = 3
		this.rows = 3
		this.layers = []


		this.setLayerOuterSize()
	}

	pushLayer(layer: Layer) {
		this.layers.push(layer)
		this.layersOuter.appendChild(layer.outer)
	}

	deleteLayer(layerId: string) {
		if (this.layers.length === 1) {
			return
		}

		let targetIndex = this.layers.findIndex(l => l.id === layerId)
		if (targetIndex === undefined) {
			console.error("???")
		}

		this.layersOuter.removeChild(this.layers[targetIndex].outer)
		this.layers.splice(targetIndex, 1)
	}

	private setLayerOuterSize() {
		const tileSize = TileSizeChanger.getTileSizePx()
		this.layersOuter.style.width = this.cols * tileSize + "px"
		this.layersOuter.style.height = this.rows * tileSize + "px"
	}

	handleChangeTileSize() {
		this.setLayerOuterSize()
	}

	expand(vec: string) {
		this.layers.forEach(l => l.expand(vec))

		if (vec == "🔼" || vec == "🔽") {
			this.rows += 1
		} else {
			this.cols += 1
		}

		this.setLayerOuterSize()
	}

	shrink(vec: string) {
		if (vec == "🔼" || vec == "🔽") {
			if (this.rows === 1) { return }
		} else {
			if (this.cols === 1) { return }
		}

		this.layers.forEach(l => l.shrink(vec))

		if (vec == "🔼" || vec == "🔽") {
			if (this.rows === 1) {
				return
			}
			this.rows -= 1
		} else {
			if (this.cols === 1) {
				return
			}
			this.cols -= 1
		}

		this.setLayerOuterSize()
	}

}