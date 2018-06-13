declare class MCE {
    private root;
    help: boolean;
    name: string;
    version: string;
    constructor(root: string);
    private getCommand;
    command(args: string[]): void;
    subcommand(args: string[]): void;
}
declare function make(localdir?: string): MCE;
export { make as MCE };
