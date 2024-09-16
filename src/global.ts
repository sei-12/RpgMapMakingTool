import { open, save } from "@tauri-apps/api/dialog";
import { ImgSrcMap } from "./ImgSrcMap";
import { TileImgPicker } from "./TilePicker";
import { readDir, readTextFile, writeFile } from "@tauri-apps/api/fs";
import { MouseStatus } from "./utils";
import { TileSizeChanger } from "./TileSizeChanger";
import { MapContainer } from "./MapContainer";
import { Layer } from "./Layer";
import { LayersController } from "./LayersController";
import { MemoElm } from "./MemoElm";
import { ToolContainer } from "./ToolContainer";

export namespace G {

    export function deleteLayer(layerId: string) {
        mapContainer.deleteLayer(layerId)
        layersController.deleteLayer(layerId)
    }

    export function createNewLayer() {
        let layer = Layer.createNew(G.mapContainer.cols, G.mapContainer.rows)
        mapContainer.pushLayer(layer)
        layersController.pushLayer(layer)
    }

    export async function importMapImg() {
        const dirPath = await open({
            directory: true,
            multiple: false
        })
        console.log(dirPath)

        if (typeof dirPath !== "string") {
            return
        }

        let entrys = await readDir(dirPath)


        let imgPaths = entrys
            .filter(entry => entry.path.endsWith(".png") || entry.path.endsWith(".jpg") || entry.path.endsWith(".jpeg"))
            .map(entry => entry.path)

        imgPaths.forEach(path => {
            let src = imgPathAndSrcMap.ifUndefThen_AddLocalFile(path)
            if (src === null) {
                return
            }
            tilePicker.addImage(src)
        })
    }
    
    function buildJsonText(): string {
        const memo = G.memoElm.toJsonObj()
        const imgSrcMap = G.imgPathAndSrcMap.exportJsonObj()
        const mpCon = G.mapContainer.exportJsonObj()
        const layersCon = layersController.exportJsonObj()

        const obj = {
            memo,
            imgSrcMap,
            mpCon,
            layersCon
        }

        return JSON.stringify(obj)
    }

    
    export async function exportJSON() {
        let jsontext = buildJsonText()


        let savePath = await save({
            filters: [{
                name: "JSON",
                extensions: ["json"]
            }]
        })

        if (savePath === null) {
            return
        }

        writeFile(savePath, jsontext)
    }
    
    export async function importJSON(){
        const filePath = await open({
            directory: false,
            multiple: false,
            filters:[{
                name: "JSON",
                extensions: ["json"]
            }]
        })

        if (filePath === null){
            return
        }

        if (typeof filePath !== "string") {
            console.error("?")
            return
        }
        
        let text = await readTextFile(filePath)
        
        let obj = JSON.parse(text)
        memoElm.loadJsonObj(obj.memo)
        imgPathAndSrcMap.reloadJsonObj(obj.imgSrcMap)
        mapContainer.loadJsonObj(obj.mpCon)
        layersController.loadJsonObj(obj.layersCon)
    }



    export const memoElm = new MemoElm()
    export const mouseStatus = new MouseStatus()
    export const layersController = new LayersController()
    export const imgPathAndSrcMap = new ImgSrcMap()
    export const tilePicker = new TileImgPicker(imgPathAndSrcMap.getAll())
    export const mapContainer = new MapContainer()
    export const tileSizeManager = new TileSizeChanger(mapContainer)
    
    export const toolContainer = new ToolContainer()

}