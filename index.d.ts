declare class MCE {
    private localdir;
    help: boolean;
    name: string;
    version: string;
    constructor(localdir: string);
    private getCommand;
    command(): void;
    subcommand(args: string[]): void;
}
declare function make(localdir?: string): MCE;
export { make as MCE };
