import { G } from "./global"
import { ImgSrc } from "./ImgSrcMap"
import { createDiv } from "./utils"

export class TileImgPicker {

    outer: HTMLDivElement
    itemOuter: HTMLDivElement
    curPick: HTMLImageElement
    curPickImgSrc: ImgSrc

    constructor(srces: ImgSrc[]) {

        this.outer = createDiv("tile-image-picker")
        this.itemOuter = createDiv("tile-image-picker-item-outer")

        const outer2 = createDiv("tile-image-picker-outer2")

        this.curPick = document.createElement("img")
        this.curPick.classList.add("tile-image-picker-cur-pick")

        const importButton = createDiv("tile-image-picker-import-button")
        importButton.innerText = "+"
        importButton.addEventListener("click", () => G.importMapImg())

        outer2.appendChild(this.curPick)
        outer2.appendChild(importButton)

        this.outer.appendChild(this.itemOuter)
        this.outer.appendChild(outer2)

        if (srces.length <= 0) {
            throw Error("value error")
        }

        srces.forEach(src => this.addImage(src))
        this.curPickImgSrc = srces[0]
        this.curPick.src = srces[0].src
    }

    addImage(imgSrc: ImgSrc) {
        this.itemOuter.appendChild(this.makeItem(imgSrc))
    }

    getCurPickImgSrc() {
        return this.curPickImgSrc
    }

    private handleOnClickItem(_e: MouseEvent, itemImgSrc: ImgSrc) {
        this.curPick.src = itemImgSrc.src
        this.curPickImgSrc = itemImgSrc
    }

    private makeItem(imgSrc: ImgSrc) {
        const elm = document.createElement("img")
        elm.src = imgSrc.src
        elm.classList.add("tile-image-picker-item-img")
        elm.addEventListener("click", (e) => {
            this.handleOnClickItem(e, imgSrc)
        })
        return elm
    }
}