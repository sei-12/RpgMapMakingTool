import { Row } from "./Row"
import { createDiv } from "./utils"

export class Layer {
	
	static getLayerOuterElm(layerId: string){
		return document.getElementById(layerId) as HTMLDivElement
	}
	static focus(layerOuter: HTMLDivElement) {
		layerOuter.style.pointerEvents = ""
	}

	static unfocus(layerOuter: HTMLDivElement) {
		layerOuter.style.pointerEvents = "none"
	}

	static hidden(layerOuter: HTMLDivElement) {
		layerOuter.style.display = "none"
	}

	static unHidden(layerOuter: HTMLDivElement) {
		layerOuter.style.display = "block"
	}

	static fromJsonObj(obj: any): Layer {
        const outer = Layer.createOuter()
        const objRows = obj.rows
		if ( !(objRows instanceof Array) ){
			throw Error()
		}
        
        const rows = objRows.map( row => Row.fromJsonObj(row) )
        const id = obj.id as string
        
        return new Layer(id,outer,rows,rows.length,rows[0].length)
	}
    
    static createNew(numCols: number, numRows: number): Layer{
        if ( numCols <= 0 || numRows <= 0){
            throw Error("bug")
        }

        const outer = Layer.createOuter()
        const id = crypto.randomUUID()
        
        const rows = []
        for (let i = 0; i < numRows; i++) {
            rows.push( Row.createTransparent(numCols) )
        }
        return new Layer(id,outer,rows,numRows,numCols)
    }

	toJsonObj(){
		let rows = this.rows.map( row => row.toJsonObj())
		return {
			rows,
			id: this.id
		}
	}

	shrink(v: string) {
		if (v == "▶️") {
			this.shrinkRight()
		} else if (v === "◀️") {
			this.shrinkLeft()
		} else if (v === "🔼") {
			this.shrinkTop()
		} else if (v === "🔽") {
			this.shrinkBottom()
		} else {
			console.error(v, "想定外！！")
		}
	}

	expand(v: string) {
		if (v == "▶️") {
			this.expandRight()
		} else if (v === "◀️") {
			this.expandLeft()
		} else if (v === "🔼") {
			this.expandTop()
		} else if (v === "🔽") {
			this.expandBottom()
		} else {
			console.error(v, "想定外！！")
		}
	}

	// focus() {
	// 	this.outer.style.pointerEvents = ""
	// }

	// unfocus() {
	// 	this.outer.style.pointerEvents = "none"
	// }

	// hidden() {
	// 	this.outer.style.display = "none"
	// }

	// unHidden() {
	// 	this.outer.style.display = "block"
	// }

    //
    //
    //
    // PRIVATE
    //
    //
    //
    
    private static createOuter(){
        const outer = createDiv("layer-outer")
        
        return outer
    }

    private constructor(
        public id: string,
        public outer: HTMLDivElement,
        private rows: Row[],
        private numRows: number,
        private numCols: number
    ){
        this.outer.id = this.id
        this.rows.forEach( row => {
            this.outer.appendChild( row.outer )
        })
    }


	private shrinkTop() {
		let row = this.rows.shift()!
		this.outer.removeChild(row.outer)
		this.numRows -= 1
	}
	private shrinkBottom() {
		let row = this.rows.pop()!
		this.outer.removeChild(row.outer)
		this.numRows -= 1
	}
	private shrinkLeft() {
        this.rows.forEach( row => row.shrinkLeft() )
		this.numCols -= 1
	}
	private shrinkRight() {
        this.rows.forEach( row => row.shrinkRight() )
		this.numCols -= 1
	}

	private expandTop() {
		let row = Row.createTransparent(this.numCols)
		this.rows.unshift(row)
		this.outer.prepend(row.outer)
		this.numRows += 1
	}
	private expandBottom() {
		let row = Row.createTransparent(this.numCols)
		this.rows.push(row)
		this.outer.appendChild(row.outer)
		this.numRows += 1
	}
	private expandLeft() {
        this.rows.forEach( row => row.expandLeft() )
		this.numCols += 1
	}
	private expandRight() {
        this.rows.forEach( row => row.expandRight() )
		this.numCols += 1
	}

}