import { subcommand } from './loader';

describe('Arguments Parsing', ()=>{
    it('throws if not required arguments', async()=>{
        let res = subcommand('args1.test');
        await res.should.be.rejectedWith('Missing argument arg1');
    });
    it('throws if optinal argument and variadac are together', async()=>{
        let res = subcommand('args1.test arg1 arg2');
        await res.should.be.rejectedWith('Optional Argument and Varidac cannot be next to each other');
    });
    it('thows errors if optional before than required argument', async () =>{
        let res = subcommand('args2.test arg1 arg2');
        await res.should.be.rejectedWith('All required arguments should go befere optional arguments');
    });
    it('throws argument count mismath', async ()=>{
        let res = subcommand('args3.test arg1 arg2');
        await res.should.be.rejectedWith('Argument count missmatch');
    });
    it('throws argument type missmatch', async ()=>{
        let res = subcommand('args4.test arg1 true');
        await res.should.be.rejectedWith('Argument type missmatch');
    });
    it('throws argument type missmatch', async ()=>{
        let res = subcommand('args4.test 10 arg2');
        await res.should.be.rejectedWith('Argument type missmatch');
	});
	it('parses arguments correctly', async ()=>{
        let res = await subcommand('args4.test 10 false');
        res.should.be.deep.equal({
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
    it('throws argument does not match expression', async ()=>{
        let res = subcommand('args6.test -n 5 -t xlk');
        await res.should.be.rejectedWith('does not match expression');
    });
    it('throws Missing value for argument', async ()=>{
        let res = subcommand('args6.test -t lk -n -l');
        await res.should.be.rejectedWith('Missing value for argument');
    });
    it('throws duplicated short tag', async ()=>{
        let res = subcommand('args7.test -h');
        await res.should.be.rejectedWith('duplicated short tag');
    });
    it('render help', async ()=>{
        process.argv.push('-h');
        let help = await subcommand('args6.test');
        process.argv.pop();
    });
    it('Varidac argument can only be in last place', async ()=>{
        let res = subcommand('args5.test true 10 arg2 -n=r -f=a');
        await res.should.be.rejectedWith('Varidac argument can only be in last place');
    });
});