const baseUrl: string = "";

export function ajaxLoadJs(src: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', src)
    xhr.onreadystatechange = function(ev){
      if(xhr.readyState === 4){
        if(xhr.status ===200 || xhr.status === 304){
          const data = JSON.parse(xhr.response)

          resolve(data)
        }
      }
    }
    xhr.send()
  })

}

export function tagLoadJs(src: string): Promise<any> {
	let { scriptTag, timestamp } = createJs();
	return new Promise((resolve, reject) => {
		scriptTag.onload = () => resolve();

		scriptTag.onerror = (err) => {
			setTimeout(()=>{
				document.head.removeChild(scriptTag)
				let s2 = createJs()
				s2.scriptTag.onload = resolve
				s2.scriptTag.onerror = reject
        s2.scriptTag.src = baseUrl + src + "?" + timestamp
				document.head.appendChild(s2.scriptTag)
				reject(err)
			},1000)
		}

    scriptTag.src = baseUrl + src + "?" + timestamp
    scriptTag.id = baseUrl + src
		document.body.appendChild(scriptTag)
	})
}


function createJs(){
	const scriptTag: HTMLScriptElement = document.createElement('script')
	const timestamp = + new Date();

	scriptTag.type = "text/javascript"
	scriptTag.id = "timestamp"

	return {
		scriptTag,
		timestamp
	}
}
