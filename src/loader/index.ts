import { globalContext } from "../global";

const baseUrl: string = "";

export enum AssetTypeEnum {
  INLINE = 'inline',
  EXTERNAL = 'external',
}

export interface Asset {
  type: AssetTypeEnum;
  content: string;
}

export function ajaxLoadJs(src: string): Promise<any> {
  return new Promise(() => {
    window.fetch(src).then(res => {

      res.text()
    });
  })

}

export function tagLoadJs(src: string): Promise<any> {
  let { scriptTag, timestamp } = createJs();
  return new Promise((resolve, reject) => {
    scriptTag.onload = () => resolve(null);

    scriptTag.onerror = (err) => {
      setTimeout(() => {
        document.head.removeChild(scriptTag)
        let s2 = createJs()
        s2.scriptTag.onload = resolve
        s2.scriptTag.onerror = reject
        s2.scriptTag.src = baseUrl + src
        document.head.appendChild(s2.scriptTag)
        reject(err)
      }, 1000)
    }
    // + "?" + timestamp
    scriptTag.src = baseUrl + src
    scriptTag.id = baseUrl + src
    document.body.appendChild(scriptTag)
  })
}

export function tagLoadCss(link: string): Promise<any> {
  let { styleTag, timestamp } = createCss();
  return new Promise((resolve) => {
    styleTag.onload = () => resolve(null);

    styleTag.href = baseUrl + link
    styleTag.rel = "stylesheet"
    styleTag.id = baseUrl + link
    document.head.appendChild(styleTag)

    resolve(null)
  })
}

export function getEntryJs(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    tagLoadJs(url).then(() => {
      // 加载完成的内容会挂载到这个globalContext上
      resolve(globalContext.activeAppInfo)
    }).catch(e => {
      reject(e)
    })
  })
}

/**
 * 预备加载问题
 * @param source
 * @param { type } (script || style)  https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content
 */
export function createPreloadLink(source: string, type: string) {
  let preloadLink = document.createElement("link");

  preloadLink.href = source;
  preloadLink.rel = "preload";
  preloadLink.as = type;
  document.head.appendChild(preloadLink);
}

function createCss() {
  const styleTag: HTMLLinkElement = document.createElement('link')
  const timestamp = + new Date();

  styleTag.id = "timestamp"

  return {
    styleTag,
    timestamp
  }
}


function createJs() {
  const scriptTag: HTMLScriptElement = document.createElement('script')
  const timestamp = + new Date();

  scriptTag.type = "text/javascript"
  scriptTag.id = "timestamp"

  return {
    scriptTag,
    timestamp
  }
}

export async function loadCss(cssList: string[]) {
  for (let i = 0; i < cssList.length; i++) {
    await tagLoadCss(cssList[i])
  }
}
