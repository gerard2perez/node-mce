export abstract class Command {
	static getName(command: Command) {
		return Reflect.getMetadata(Command, command)
	}
	abstract action(...args: unknown[]): Promise<void>
}