export default class SnapshotSandbox {
    proxy: WindowProxy;
    name: string;
    type: string;
    sandboxRunning: boolean;
    private windowSnapshot;
    private modifyPropsMap;
    appCache: Array<string>;
    constructor(name: string);
    active(): void;
    inactive(): void;
}
