export {}
declare global {
	interface Object {
		mockReturnValueOnce: (value: unknown) => void
		mockReturnValue: (value: unknown) => void
	}
}