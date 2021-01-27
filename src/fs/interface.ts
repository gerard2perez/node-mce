export type JoinPath = (...path: string[]) => string
export interface fs_interface {
	path: string
	root: string
	template: JoinPath
	project: JoinPath
}