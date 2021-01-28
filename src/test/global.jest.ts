export {}
declare global {
	interface Object {
		mockReset: () => void
		mockRestore: () => void
		mockReturnValueOnce: (value: unknown) => void
		mockReturnValue: (value: unknown) => void
		mockImplementationOnce: (fn: (...args: any[]) => unknown) => void
	}
}