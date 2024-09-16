import { G } from "./global"
import { makeMapExpandButtons, makeMapShrinkButtons } from "./mapExpandAndShrinkButtons"
import { createDiv } from "./utils"

export class ToolContainer {
	outer: HTMLDivElement
	constructor() {
		this.outer = createDiv("tool-outer")
		this.outer.appendChild(G.memoElm.outer)
		this.outer.appendChild(G.tilePicker.outer)
		this.outer.appendChild(makeMapExpandButtons())
		this.outer.appendChild(makeMapShrinkButtons())
		this.outer.appendChild(G.layersController.outer)

		this.outer.appendChild(G.tileSizeManager.outer)

		const exportButton = createDiv("export-button")
		exportButton.innerText = "Export"
		exportButton.addEventListener("click", G.exportJSON)

		const importButton = createDiv("export-button")
		importButton.innerText = "Import"
		importButton.addEventListener("click", G.importJSON)

		this.outer.appendChild(importButton)
		this.outer.appendChild(exportButton)
	}
}