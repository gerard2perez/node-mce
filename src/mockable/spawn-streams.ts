import { fstat } from "fs";
import { WriteStream } from "tty";
import { STDOut } from "../test";
import {open, openSync} from 'fs'

/* istanbul ignore next */
export function SpawnStreams() {
	return ['pipe', 'pipe', 'pipe'] as [any, any, any]
}