import { G } from "./global"
import { createDiv } from "./utils"

export function makeMapShrinkButtons() {
	const outer = createDiv("map-shrink-buttons-outer")

	const head = createDiv("map-shrink-buttons-title")
	head.innerText = "マップ縮小"

	const buttonsOuter = createDiv("map-expand-button-buttons-outer")
	const topButton = createDiv("map-expand-button map-expand-top-button")
	const leftButton = createDiv("map-expand-button map-expand-left-button")
	const rightButton = createDiv("map-expand-button map-expand-right-button")
	const bottomButton = createDiv("map-expand-button map-expand-bottom-button")

	topButton.innerText = "🔼"
	leftButton.innerText = "◀️"
	rightButton.innerText = "▶️"
	bottomButton.innerText = "🔽"

	// @ts-ignore
	topButton.addEventListener("click", (e) => { G.mapContainer.shrink(e.target.innerText) })
	// @ts-ignore
	leftButton.addEventListener("click", (e) => { G.mapContainer.shrink(e.target.innerText) })
	// @ts-ignore
	rightButton.addEventListener("click", (e) => { G.mapContainer.shrink(e.target.innerText) })
	// @ts-ignore
	bottomButton.addEventListener("click", (e) => { G.mapContainer.shrink(e.target.innerText) })

	outer.appendChild(head)
	outer.appendChild(buttonsOuter)
	buttonsOuter.appendChild(topButton)
	buttonsOuter.appendChild(bottomButton)
	buttonsOuter.appendChild(leftButton)
	buttonsOuter.appendChild(rightButton)

	return outer
}

export function makeMapExpandButtons() {
	const outer = createDiv("map-expand-buttons-outer")

	const head = createDiv("map-expand-buttons-title")
	head.innerText = "マップ拡張"

	const buttonsOuter = createDiv("map-expand-button-buttons-outer")
	const topButton = createDiv("map-expand-button map-expand-top-button")
	const leftButton = createDiv("map-expand-button map-expand-left-button")
	const rightButton = createDiv("map-expand-button map-expand-right-button")
	const bottomButton = createDiv("map-expand-button map-expand-bottom-button")

	topButton.innerText = "🔼"
	leftButton.innerText = "◀️"
	rightButton.innerText = "▶️"
	bottomButton.innerText = "🔽"

	// @ts-ignore
	topButton.addEventListener("click", (e) => { G.mapContainer.expand(e.target.innerText) })
	// @ts-ignore
	leftButton.addEventListener("click", (e) => { G.mapContainer.expand(e.target.innerText) })
	// @ts-ignore
	rightButton.addEventListener("click", (e) => { G.mapContainer.expand(e.target.innerText) })
	// @ts-ignore
	bottomButton.addEventListener("click", (e) => { G.mapContainer.expand(e.target.innerText) })

	outer.appendChild(head)
	outer.appendChild(buttonsOuter)
	buttonsOuter.appendChild(topButton)
	buttonsOuter.appendChild(bottomButton)
	buttonsOuter.appendChild(leftButton)
	buttonsOuter.appendChild(rightButton)

	return outer
}