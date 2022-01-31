export abstract class Command {
	abstract action(...args: unknown[]): Promise<void>
}