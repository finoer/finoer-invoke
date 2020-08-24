const namespace = 'FINO';
export function setStore(key, value) {
    if (!window[namespace]) {
        window[namespace] = {};
    }
    window[namespace][key] = value;
}
export function getStore(key) {
    const fino = window[namespace];
    return fino && fino[key] ? fino[key] : null;
}
//# sourceMappingURL=store.js.map