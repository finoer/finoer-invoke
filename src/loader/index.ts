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
    scriptTag.onload = () => resolve();

    scriptTag.onerror = (err) => {
      setTimeout(() => {
        document.head.removeChild(scriptTag)
        let s2 = createJs()
        s2.scriptTag.onload = resolve
        s2.scriptTag.onerror = reject
        s2.scriptTag.src = baseUrl + src + "?" + timestamp
        document.head.appendChild(s2.scriptTag)
        reject(err)
      }, 1000)
    }

    scriptTag.src = baseUrl + src + "?" + timestamp
    scriptTag.id = baseUrl + src
    document.body.appendChild(scriptTag)
  })
}

// export function fetchScripts(jsList: Asset[], fetch: Fetch = winFetch) {
//   return Promise.all(jsList.map((asset) => {
//     const { type, content } = asset;
//     if (type === 'inline') {
//       return content;
//     } else {
//       // content will script url when type is AssetTypeEnum.EXTERNAL
//       return cachedScriptsContent[content] || (cachedScriptsContent[content] = fetch(content).then(res => res.text()));
//     }
//   }));
// }

export function tagLoadCss(link: string): Promise<any> {
  let { styleTag, timestamp } = createCss();
  return new Promise((resolve) => {
    styleTag.onload = () => resolve();

    styleTag.href = baseUrl + link + "?" + timestamp
    styleTag.rel = "stylesheet"
    styleTag.id = baseUrl + link
    document.body.appendChild(styleTag)
  })
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
