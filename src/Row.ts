import { G } from "./global";
import { Tile } from "./Tile";
import { createDiv } from "./utils";

export class Row {
    outer: HTMLDivElement
    private tiles: Tile[]


    private constructor(
        tiles: Tile[]
    ) {
        if (tiles.length === 0) {
            throw Error("bug")
        }

        this.outer = createDiv("row-outer")
        this.tiles = tiles

        this.tiles.forEach(tile => this.outer.appendChild(tile.outer))
    }

    get length() {
        return this.tiles.length
    }

    static createTransparent(len: number) {
        const tiles: Tile[] = []

        for (let i = 0; i < len; i++) {
            const src = G.imgPathAndSrcMap.getTransparentImg()
            const tile = new Tile(src)
            tiles.push(tile)
        }

        return new Row(tiles)
    }

    static fromJsonObj(obj: any) {
        if (!(obj instanceof Array)) { throw Error() }
        const tiles = obj.map(o => Tile.fromJsonObj(o))
        return new Row(tiles)
    }

    toJsonObj() {
        return this.tiles.map(tile => tile.toJsonObj())
    }

    expandLeft() {
        const src = G.imgPathAndSrcMap.getTransparentImg()
        const newTile = new Tile(src)
        this.tiles.unshift(newTile)
        this.outer.prepend(newTile.outer)
    }
    expandRight() {
        const src = G.imgPathAndSrcMap.getTransparentImg()
        const newTile = new Tile(src)
        this.tiles.push(newTile)
        this.outer.append(newTile.outer)
    }
    shrinkLeft() {
        const leftTile = this.tiles.shift()!
        this.outer.removeChild(leftTile.outer)
    }
    shrinkRight() {
        const leftTile = this.tiles.pop()!
        this.outer.removeChild(leftTile.outer)
    }
}