/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { writeFileSync, readFileSync, copyFileSync } from '../mockable/fs'
import './global-jest'
export function root(...fns: unknown[]) {
	
}
export function dir(...fns: unknown[]) {
	
}
export function json() {
	
}
export function cpy() {
	
}
export function wrt() {
	
}
export function cmp(file_contents: unknown = {}) {
	readFileSync.mockReturnValueOnce(JSON.stringify(file_contents))
}
export function unl() {
	
}
export function pkg() {
	
}