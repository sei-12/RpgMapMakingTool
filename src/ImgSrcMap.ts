import { convertFileSrc } from "@tauri-apps/api/tauri"

/**
 * 作成するな！！！
 */
export type ImgSrc = {
    readonly src: string
    readonly path: string
    readonly id: number
    readonly isAssets: boolean
}

export class ImgSrcMap {

    exportJsonObj() {
        return {
            all: this.all.map( imgSrc => { return {
                path: imgSrc.path, 
                id: imgSrc.id,
                isAssets: imgSrc.isAssets
            }}),
            nextId: this.nextId
        }
    }

    reloadJsonObj(obj: any) {
        this.srcMap = {}
        this.pathMap = {}
        this.idMap = {}
        this.nextId = 0
        this.all = []
        
        const imgSrces = obj.all.map( (o: any) => {
            const src = (() => {
                if(o.isAssets){
                    return o.path
                }else{
                    return convertFileSrc(o.path)
                }
            })()
            return {
                path: o.path,
                id: o.id,
                src,
                isAssets: o.isAssets
            }
        })

        this.nextId = obj.nextId
        imgSrces.forEach((o: any) => {
            this.privateAdd(o)
        })
    }

    getTransparentImg() {
        let path = "src/assets/assets4.png"
        let img = this.createImgSrc(path, path,true)
        if (img === null) {
            return this.findByPath(path)!
        } else {
            this.privateAdd(img)
            return img
        }
    }

    /**
     * インスタンス作成時に幾つかの画像が追加されるので、絶対にlengthが0にはならない
     */
    getAll(): ImgSrc[] {
        return this.all
    }
    findBySrc(src: string): ImgSrc | undefined {
        console.log(src, this.srcMap, this.srcMap[src])
        return this.srcMap[src]
    }
    findByPath(path: string): ImgSrc | undefined {
        return this.pathMap[path]
    }
    findById(instanceId: string): ImgSrc | undefined {
        return this.idMap[instanceId]
    }

    ifUndefThen_AddLocalFile(path: string) {
        if (this.findByPath(path) !== undefined) {
            return null
        }

        let imgSrc = this.createImgSrc(
            convertFileSrc(path),
            path,
            false
        )

        if (imgSrc === null) {
            throw Error("そんなはずはない")
        }

        this.privateAdd(imgSrc)
        return imgSrc
    }

    constructor() {
        this.srcMap = {}
        this.pathMap = {}
        this.idMap = {}
        this.nextId = 0
        this.all = []

        this.addAssetImgs()
    }


    //
    //
    //
    // Private
    //
    //
    //


    private all: ImgSrc[]
    private nextId: number
    private srcMap: { [key: string]: ImgSrc }
    private pathMap: { [key: string]: ImgSrc }
    private idMap: { [key: string]: ImgSrc }

    private createImgSrc(src: string, path: string,isAssets: boolean): ImgSrc | null {
        if (this.srcMap[src] !== undefined) {
            return null
        }

        let id = this.nextId
        this.nextId += 1
        return { id, src, path ,isAssets}
    }

    private privateAdd(imgSrc: ImgSrc) {
        if (this.srcMap[imgSrc.src] !== undefined) {
            throw Error("bug")
        }

        this.srcMap[imgSrc.src] = imgSrc
        this.pathMap[imgSrc.path] = imgSrc
        this.idMap[imgSrc.id] = imgSrc
        this.all.push(imgSrc)
    }

    private addAssetImgs() {
        const imgs = [
            "src/assets/asset1.png",
            "src/assets/asset2.png",
            "src/assets/asset3.png",
            "src/assets/assets4.png",
            "src/assets/assets5.png",
            "src/assets/none.png",
        ]

        imgs
            .map(img => this.createImgSrc(img, img, true))
            .filter(img => img !== null)
            .forEach(imgSrc => this.privateAdd(imgSrc))
    }

}