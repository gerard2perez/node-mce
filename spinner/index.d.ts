export declare class Cursor {
    static hidden: boolean;
    static showOnExit: boolean;
    static show(stream: any): void;
    static hide(stream: any): void;
    static toggle(force: any, stream: any): void;
}
export interface ISpinnerOptions {
    color: string;
    text: string;
    stream: any;
    interval: number;
    hideCursor: boolean;
    enabled: boolean;
    frameIndex: number;
    linesToClear: number;
    spinner: any;
}
export declare class Spinner {
    id: number;
    lineCount: number;
    hideCursor: boolean;
    options: ISpinnerOptions;
    spinner: any;
    stream: any;
    color: string;
    interval: number;
    enabled: boolean;
    frameIndex: number;
    linesToClear: number;
    text: any;
    readonly isSpinning: boolean;
    constructor(options: any);
    changeSpinner(spinner: string): void;
    frame(): string;
    clear(): this;
    render(): this;
    start(text?: string): this;
    stop(): this;
    ok(text?: string): this;
    succeed(text?: string): this;
    fail(text?: string): this;
    error(text?: string): this;
    warn(text?: string): this;
    info(text?: string, newline?: boolean): this;
    private persist;
    private stopAndPersist;
}
declare function cliSpinner(options: ISpinnerOptions | string): Spinner;
export declare function wait(time?: number): Promise<{}>;
export declare const MainSpinner: Spinner;
export declare function spin(display: string | ISpinnerOptions, fn: (info: Function, warn: Function, error: Function, ok: Function) => Promise<string | void>): Promise<string>;
export { cliSpinner };
