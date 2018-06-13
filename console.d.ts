export declare const info: (text: string) => void;
export declare const warn: (text: string) => void;
export declare const error: (text: string) => void;
export declare const ok: (text: string) => void;
export declare const pause: () => void;
export declare const resume: () => void;
export declare function updateTextSpin(text: string): void;
export declare function input(display: string): Promise<string>;
export declare function ask(question: string): Promise<boolean>;
