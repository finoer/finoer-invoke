export const PEDEST_STARTED = "PEDEST_STARTED"


export const PEDEST_NOT_STARTED = "PEDEST_NOT_STARTED"

export const BOOTSTRAP = 'BOOTSTRAP';

export const MOUNT = 'MOUNT'

export const MOUNTED = 'MOUNTED'

export const UNMOUNT = 'UNMOUNT'


export const WINDOW_WIDTH: number = window.innerWidth * RATIO();
export const WINDOW_HEIGHT: number = window.innerHeight * RATIO();


// 针对不同平台渲染不同的分辨率
function RATIO(): number {
    if (judgeRuntimeOnPC()) {
        return 1
    } else {
        return parseInt((window.devicePixelRatio * .7).toFixed(0))
    }
}


/**
 * @function 判断js执行环境
 * @returns boolean 是否在PC环境
 */
export function judgeRuntimeOnPC(): boolean {
    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
        //移动端
        return false
    } else {
        //PC端
        return true
    }
}
