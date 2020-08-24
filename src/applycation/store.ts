const namespace = 'FINO'

export function setStore(key: string, value: any) {
  if (!(window as any)[namespace]) {
    (window as any)[namespace] = {};
  }
  (window as any)[namespace][key] = value;
}

export function getStore(key: string) {
  const fino: any = (window as any)[namespace];
  return fino && fino[key] ? fino[key] : null;
}
