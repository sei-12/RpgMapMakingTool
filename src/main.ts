// import { invoke } from "@tauri-apps/api/tauri";
import { G } from './global';
import { MemoMapName } from './MemoElm';


/**
 * メモ機能
 * フォルダの出力
 * 出力したフォルダを読み込む
 * JSONからメモのテンプレを読み込む
 * 現在のメモの項目をテンプレとして書き出す
 * 画像の検索（ファイル名）
 * 
 */
//

G.memoElm.add(new MemoMapName())
document.body.appendChild(G.toolContainer.outer)
document.body.appendChild(G.mapContainer.outer)
G.createNewLayer()