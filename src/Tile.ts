import { G } from "./global"
import { ImgSrc } from "./ImgSrcMap"

export class Tile {
    outer: HTMLImageElement
    imgPathAndSrc: Readonly<ImgSrc>

    constructor(imgPathAndSrc: Readonly<ImgSrc>) {
        this.imgPathAndSrc = imgPathAndSrc

        this.outer = document.createElement("img")
        this.outer.classList.add("tile")

        this.outer.onmousedown = () => false
        this.outer.addEventListener("mousedown", () => { this.setImgPathAndSrc(G.tilePicker.getCurPickImgSrc()) })
        this.outer.addEventListener("mouseover", () => {
            if (!G.mouseStatus.onmousedown) { return }
            this.setImgPathAndSrc(G.tilePicker.getCurPickImgSrc())
        })

        this.setImgPathAndSrc(imgPathAndSrc)
    }

    private setImgPathAndSrc(val: ImgSrc) {
        this.imgPathAndSrc = val
        this.outer.src = val.src
    }

    toJsonObj() {
        return this.imgPathAndSrc.id
    }
    static fromJsonObj(obj: any) {
        const id = obj as string
        let imgSrc = G.imgPathAndSrcMap.findById(id)
        if (imgSrc === undefined) {
            throw Error("bug")
        }
        return new Tile(imgSrc)
    }
}
