/**
 * @module @gerard2p/mce/core
 */
import { OptionKind } from "./option";
export class Argument {
    kind:OptionKind = OptionKind.optional;
    parser:any
    type:string
    name:string
    static parser = {
        string: o=>o,
        number( o ) {
            let res = parseFloat(o);
            if(isNaN(res)) {
                throw new Error(`Argument type missmatch. argument '${this.name}' is not a ${this.type}`);
            }
            return res;
        },
        bool( o ) {
            let res = o === 'true' || o === 'false';
            if(!res) {
                throw new Error(`Argument type missmatch. argument '${this.name}' is not a ${this.type}`);
            }
            return o === 'true';
        }
    }
    constructor(arg: string) {
        if (arg.includes('<')) this.kind = OptionKind.required;
        if (arg.includes('...')) this.kind = OptionKind.varidac;
        let name = arg.replace(/[<>.\[\]]/g, '');
        this.type = name.split(':')[1] || 'string';
        name = name.split(':')[0];
        this.name = name;
        this.parser = Argument.parser[this.type];
	}
	find(args:string[]) {
		switch (this.kind) {
			case OptionKind.required:
				if (!args[0]) throw new Error(`Missing argument ${this.name}`);
				return this.parser(args.splice(0, 1)[0]);
			case OptionKind.varidac:
				return this.parser(args.splice(0));
			case OptionKind.optional:
				return this.parser(args.splice(0, 1)[0]);
		}
	}
}
