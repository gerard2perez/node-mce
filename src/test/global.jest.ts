export {}
declare global {
	interface Function {
		mockReset: () => void
		mockRestore: () => void
		mockReturnValueOnce: (value: unknown) => void
		mockReturnValue: (value: unknown) => void
		mockImplementationOnce: (fn: (...args: any[]) => unknown) => void
	}
}