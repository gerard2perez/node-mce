import { loader, reset, subcommand } from "./loader";
import { readLog } from "./log-reader";

process.env.TEST = 'test';

describe('Arguments Parsing', ()=>{
	beforeAll(()=>loader('./test'));
	beforeEach(()=>reset());
	test('full rendering of arguments', async ()=>{
		await expect(subcommand('args8 -h')).resolves.toBe(readLog('args8.help.log'))
	});
    test('throws if not required arguments', async()=>{
        let res = subcommand('args8');
        await expect(res).rejects.toThrow('Missing argument arg1');
    });
    test('throws if optinal argument and variadac are together', async()=>{
        let res = subcommand('args1 arg1 arg2');
        await expect(res).rejects.toThrow('Optional Argument and Varidac cannot be next to each other');
    });
    test('thows errors if optional before than required argument', async () =>{
        let res = subcommand('args2 arg1 arg2');
        await expect(res).rejects.toThrow('All required arguments should go befere optional arguments');
    });
    test('throws argument count mismath', async ()=>{
        let res = subcommand('args3 arg1 arg2');
        await expect(res).rejects.toThrow('Argument count missmatch');
    });
    test('throws argument type missmatch', async ()=>{
        let res = subcommand('args4 arg1 true');
        await expect(res).rejects.toThrow('Argument type missmatch');
    });
    test('throws argument type missmatch', async ()=>{
        let res = subcommand('args4 10 arg2');
        await expect(res).rejects.toThrow('Argument type missmatch');
	});
	test('parses arguments correctly', async ()=>{
        let res = await subcommand('args4 10 false');
        expect(res).toEqual({
			arg1: 10,
			arg2: false,
			opt: {
                enumeration: undefined,
                number: undefined,
                floating: undefined,
                range: [],
                text:undefined,
                bool: false,
                list:[],
                collect:[],
                verbose: 0
            }
		})
    });
    test('throws argument does not match expression', async ()=>{
        let res = subcommand('args6 -n 5 -t xlk');
        await expect(res).rejects.toThrow('does not match expression');
    });
    test('throws Missing value for argument', async ()=>{
        let res = subcommand('args6 -t lk -n -l');
        await expect(res).rejects.toThrow('Missing value for argument');
    });
    test('throws duplicated short tag', async ()=>{
        let res = subcommand('args7 -h');
        await expect(res).rejects.toThrow('duplicated short tag');
    });
    test('render help', async ()=>{
		let help = await subcommand('args6 -h');
		expect(help).toBeDefined();
    });
    test('Varidac argument can only be in last place', async ()=>{
		let res = subcommand('args5 true 10 arg2 -n=r -f=a');
        await expect(res).rejects.toThrow('Varidac argument can only be in last place');
	});
});
