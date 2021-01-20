import { PackageJSON } from "../@utils/package-json";
import { writeJSON } from "./fs";
import { makeChainable } from "./wrappers";

export function PackageJSON2Chain(pack: PackageJSON) {
	return makeChainable(writeJSON)('package.json', pack)
}