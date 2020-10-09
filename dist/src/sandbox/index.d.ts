declare class Sandbox {
    private sandbox;
    sandboxDisabled: boolean;
    private eventListeners;
    private timeoutIds;
    private intervalIds;
    private propertyAdded;
    private originalValues;
    constructor();
    createProxySandbox(): void;
    getSandbox(): Window | null;
    execScriptInSandbox(script: string): void;
    clear(): void;
}
export default Sandbox;
