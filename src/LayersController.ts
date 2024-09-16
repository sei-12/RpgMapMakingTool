import { G } from "./global"
import { Layer } from "./Layer"
import { createDiv } from "./utils"

class ItemElm {
    outer: HTMLDivElement
    layerId: string
    private layerNameBox: HTMLInputElement

    constructor(
        layerId: string,
        onClickFocus: () => void,
        onClickToggleHidden: (e: MouseEvent) => void,
        onClickDelete: () => void,
        layerName: string,
        onClickGoFront: () => void,
        onClickGoBack: () => void
    ) {
        this.layerId = layerId

        this.outer = createDiv("layers-controller-item")

        const focusButton = createDiv("layers-controller-item-focus-button")
        focusButton.addEventListener("click", onClickFocus)

        const hiddenCheckBox = createDiv("layers-controller-item-check-box")
        hiddenCheckBox.addEventListener("click", onClickToggleHidden)

        const deleteButton = createDiv("layers-controlleer-item-delete-button")
        deleteButton.addEventListener("click", onClickDelete)
        deleteButton.innerText = "del"

        this.layerNameBox = document.createElement("input")
        this.layerNameBox.classList.add("layers-controller-item-name-box")
        this.layerNameBox.value = layerName

        const upButton = createDiv("layers-controller-yajirusi-button")
        upButton.innerText = "⬆︎"
        upButton.addEventListener("click", onClickGoFront)
        const downButton = createDiv("layers-controller-yajirusi-button")
        downButton.addEventListener("click", onClickGoBack)
        downButton.innerText = "⬇︎"

        this.outer.appendChild(focusButton)
        this.outer.appendChild(upButton)
        this.outer.appendChild(downButton)
        this.outer.appendChild(hiddenCheckBox)
        this.outer.appendChild(this.layerNameBox)
        this.outer.appendChild(deleteButton)
    }

    getLayerName() {
        return this.layerNameBox.value
    }
}

export class LayersController {
    exportJsonObj() {
        const nextLayerNumber = this.nextLayerNumber
        const items = this.itemElms.map( item => {
            return {
                name: item.getLayerName(),
                layerId: item.layerId
            }
        })
        
        return {
            nextLayerNumber,
            items
        }
    }

    loadJsonObj(obj: any) {
        this.nextLayerNumber = obj.nextLayerNumber
        let newItemElms = obj.items.map( (item:any) => {
            const itemElm = new ItemElm(
                item.layerId,
                () => { this.focusLayer(item.layerId) },
                (e) => { this.handleOnClickToggleHidden(e,item.layerId) },
                () => { G.deleteLayer(item.layerId) },
                item.name,
                () => { this.goFront(item.layerId) },
                () => { this.goBack(item.layerId) },
            )
                
            return itemElm
        }) 
        
        this.itemElms = newItemElms
        
        this.handleUpdateItemElms()
    }

    outer: HTMLDivElement
    itemOuter: HTMLDivElement

    nextLayerNumber: number

    // この配列のindexとz-indexが対応しているものとする
    private itemElms: ItemElm[]

    constructor() {
        this.outer = createDiv("")
        this.itemOuter = createDiv("layers-controller-item-outer")

        const createNewLayerButton = createDiv("layers-controller-create-new-layer-button")
        createNewLayerButton.innerText = "+"
        createNewLayerButton.addEventListener("click", G.createNewLayer)


        this.nextLayerNumber = 1

        this.itemElms = []

        this.outer.appendChild(this.itemOuter)
        this.outer.appendChild(createNewLayerButton)
    }

    deleteLayer(layerId: string) {
        if (this.itemElms.length === 1) {
            return
        }

        let targetIndex = this.layerFindIndex_unwrap(layerId)
        let targetElm = this.itemElms[targetIndex]
        this.itemOuter.removeChild(targetElm.outer)
        this.itemElms.splice(targetIndex, 1)

        this.handleUpdateItemElms()

        if (targetElm.outer.classList.contains("focus")) {
            this.focusLayer(this.itemElms[0].layerId)
        }
    }

    pushLayer(layer: Layer) {
        const itemElm = new ItemElm(
            layer.id,
            () => { this.focusLayer(layer.id) },
            (e) => { this.handleOnClickToggleHidden(e, layer.id) },
            () => { G.deleteLayer(layer.id) },
            "layer" + this.nextLayerNumber,
            () => { this.goFront(layer.id) },
            () => { this.goBack(layer.id) },
        )

        this.nextLayerNumber += 1

        this.itemElms.push(itemElm)
        this.itemOuter.prepend(itemElm.outer)
        this.focusLayer(layer.id)
        this.handleUpdateItemElms()
    }

    private handleUpdateItemElms() {
        this.itemElms.forEach((l, i) => { 
            let layerOuter = Layer.getLayerOuterElm(l.layerId)
            if ( layerOuter === null ){
                throw Error("bug")
            }
            layerOuter.style.zIndex = "" + i
        })

        // ごめん
        this.itemOuter.innerHTML = ""
        this.itemElms.forEach(itemElm => {
            this.itemOuter.prepend(itemElm.outer)
        })
    }

    private layerFindIndex_unwrap(layerId: string) {
        let targetIndex = this.itemElms.findIndex(itemElm => layerId === itemElm.layerId)

        if (targetIndex === undefined) {
            console.group()
            console.log(this)
            console.trace()
            console.groupEnd()
            throw Error()
        }

        return targetIndex
    }

    private handleOnClickToggleHidden(e: MouseEvent, layerId: string) {
        let hiddenCheckBox = e.target as HTMLDivElement
        let nowHidden = hiddenCheckBox.innerText !== ""
        if (nowHidden) {
            hiddenCheckBox.innerText = ""
            this.unHiddenLayer(layerId)
        } else {
            hiddenCheckBox.innerText = "X"
            this.hiddenLayer(layerId)
        }
    }
    private goFront(layerId: string) {
        let targetIndex = this.layerFindIndex_unwrap(layerId)
        let target = this.itemElms.splice(targetIndex, 1)[0]
        this.itemElms.splice(targetIndex + 1, 0, target)
        this.handleUpdateItemElms()
    }
    private goBack(layerId: string) {
        let targetIndex = this.layerFindIndex_unwrap(layerId)
        let target = this.itemElms.splice(targetIndex, 1)[0]
        this.itemElms.splice(targetIndex - 1, 0, target)
        this.handleUpdateItemElms()
    }
    private hiddenLayer(layerId: string) {
        let targetIndex = this.layerFindIndex_unwrap(layerId)
        
        let layerElm = Layer.getLayerOuterElm(this.itemElms[targetIndex].layerId)!
        Layer.hidden(layerElm)
    }
    private unHiddenLayer(layerId: string) {
        let targetIndex = this.layerFindIndex_unwrap(layerId)
        let layerElm = Layer.getLayerOuterElm(this.itemElms[targetIndex].layerId)!
        Layer.unHidden(layerElm)
    }
    private focusLayer(layerId: string) {
        this.itemElms.forEach(itemElm => {
            let layerElm = Layer.getLayerOuterElm(itemElm.layerId)!
            Layer.unfocus(layerElm)
            itemElm.outer.classList.remove("focus")
        })
        let targetIndex = this.layerFindIndex_unwrap(layerId)
        let layerElm = Layer.getLayerOuterElm(this.itemElms[targetIndex].layerId)!
        Layer.focus(layerElm)
        this.itemElms[targetIndex].outer.classList.add("focus")
    }
}