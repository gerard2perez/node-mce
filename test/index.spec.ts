process.env.MCE_DEV = 'true';
import chai = require('chai');
import chaiAsPromised = require("chai-as-promised");
import { MCE } from '../src';
import { describe, it} from 'mocha';
import { resolve } from 'path';
import { readFileSync } from 'fs';

chai.use(chaiAsPromised);
chai.should();

const NODE_MCE = MCE('./test');
describe('Options Parsing', ()=>{
    it('get defaults options', async ()=>{
        const res:any = await NODE_MCE.subcommand(['options.test', 'file.js']) as any;
        res.should.deep.equal({
            arg1: 'file.js',
            varidac: [],
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
        });
    });
    it('parses options values', async () =>{
        const res:any = await NODE_MCE.subcommand(
            'options.test file.js --enumeration single var2 --number 10 --floating 1.258 --range 2..55 --text demo --bool --list h1,h2,h5 --collect h3 --collect h6 --verbose'
            .split(' '));
        res.should.deep.equal({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'single',
                number: 10,
                floating: 1.258,
                range: [2, 55],
                text:'demo',
                bool: true,
                list:[ 'h1', 'h2', 'h5'],
                collect:[
                    'h3', 'h6'
                ],
                verbose: 1
            }
        })
    });
    it('parses options values with symbol =', async () =>{
        const res:any = await NODE_MCE.subcommand(
            'options.test file.js --enumeration single var2 --number=5 --floating=12.58 --range=2..55 --text=demo --bool --list=h10,h21 --collect=h30 --collect=h3 --collect=h6'
            .split(' '));
        res.should.deep.equal({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'single',
                number: 5,
                floating: 12.58,
                range: [2, 55],
                text:'demo',
                bool: true,
                list:[ 'h10', 'h21'],
                collect:[
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        })
    });
    it('parses options values with short tags', async () =>{
        const res:any = await NODE_MCE.subcommand(
            'options.test file.js -e git var2 -n=5 -f=12.58 -r=2..55 -t=demo -b --l=h10,h21 -c=h30 -c=h3 -c=h6'
            .split(' '));
        res.should.deep.equal({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'git',
                number: 5,
                floating: 12.58,
                range: [2, 55],
                text:'demo',
                bool: true,
                list:[ 'h10', 'h21'],
                collect:[
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        })
    });
    it('parses options mixed formats', async () =>{
        const res:any = await NODE_MCE.subcommand(
            'options.test file.js --enumeration single var2 -n=5 --floating=12.58 -r 2..55 --text demo --bool --list=h10,h21 -c=h30 --collect h3 --collect=h6'
            .split(' '));
        res.should.deep.equal({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'single',
                number: 5,
                floating: 12.58,
                range: [2, 55],
                text:'demo',
                bool: true,
                list:[ 'h10', 'h21'],
                collect:[
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        });
        it('multiple short tags together', async () =>{
            const res:any = await NODE_MCE.subcommand(
                'options.test file.js -e single var2 -nf 5 12.58 -rtb 2..55 demo --list=h10,h21 --collect=h30 --collect=h3 --collect=h6 -vvv'
                .split(' '));
            res.should.deep.equal({
                arg1: 'file.js',
                varidac: [
                    'var2'
                ],
                opt: {
                    enumeration: 'single',
                    number: 5,
                    floating: 12.58,
                    range: [2, 55],
                    text:'demo',
                    bool: true,
                    list:[ 'h10', 'h21'],
                    collect:[
                        'h30', 'h3', 'h6'
                    ],
                    verbose: 3
                }
            })
        });
    });
    it('parses options mixed formats', async () =>{
        const res:any = await NODE_MCE.subcommand(
            'options.test file.js --enumeration single var2 -n=5 --floating=12.58 -r 2..55 --text demo --bool --list=h10,h21 -c=h30 --collect h3 --collect=h6'
            .split(' '));
        res.should.deep.equal({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'single',
                number: 5,
                floating: 12.58,
                range: [2, 55],
                text:'demo',
                bool: true,
                list:[ 'h10', 'h21'],
                collect:[
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        });
    });
});
describe('Arguments Parsing', ()=>{
    it('throws if not required arguments', async()=>{
        let res = NODE_MCE.subcommand(['args1.test']);
        await res.should.be.rejectedWith('Missing argument <arg1>');
    });
    it('throws if optinal argument and variadac are together', async()=>{
        let res:any = NODE_MCE.subcommand('args1.test arg1 arg2'.split(' '));
        await res.should.be.rejectedWith('Optional Argument and Varidac cannot be next to each other');
    });
    it('thows errors if optional before than required argument', async () =>{
        let res:any = NODE_MCE.subcommand('args2.test arg1 arg2'.split(' '));
        await res.should.be.rejectedWith('All required arguments should go befere optional arguments');
    });
    it('throws argument count mismath', async ()=>{
        let res:any = NODE_MCE.subcommand('args3.test arg1 arg2'.split(' '));
        await res.should.be.rejectedWith('Argument count missmatch');
    });
    it('throws argument type missmatch', async ()=>{
        let res:any = NODE_MCE.subcommand('args4.test arg1 true'.split(' '));
        await res.should.be.rejectedWith('Argument type missmatch');
    });
    it('throws argument type missmatch', async ()=>{
        let res:any = NODE_MCE.subcommand('args4.test 10 arg2'.split(' '));
        await res.should.be.rejectedWith('Argument type missmatch');
    });
    it('throws argument does not match expression', async ()=>{
        let res:any = NODE_MCE.subcommand('args6.test -n 5 -t xlk'.split(' '));
        await res.should.be.rejectedWith('does not match expression');
    });
    it('throws Missing value for argument', async ()=>{
        let res:any = NODE_MCE.subcommand('args6.test -t lk -n -l'.split(' '));
        await res.should.be.rejectedWith('Missing value for argument');
    });
    it('throws duplicated short tag', async ()=>{
        let res:any = NODE_MCE.subcommand('args7.test -h'.split(' '));
        await res.should.be.rejectedWith('duplicated short tag');
    });
    it('Varidac argument can only be in last place', async ()=>{
        let res:any = NODE_MCE.subcommand('args5.test true 10 arg2 -n=r -f=a'.split(' '));
        await res.should.be.rejectedWith('Varidac argument can only be in last place');
    });
});
let SELF;
describe('Utils functions',async ()=>{
    it('gets correct paths', async ()=>{
        let res:any = await NODE_MCE.subcommand('utils.test'.split(' '));
        res.should.be.deep.equal({
            cli: resolve('./test'),
            target: resolve('./'),
        });
    });
    it('test verbosity', async () =>{
        let res:any = await NODE_MCE.subcommand('utils1.test'.split(' '));
    });
    it('test verbosuty 3', async () =>{
        let res:any = await NODE_MCE.subcommand('utils1.test -vvv'.split(' '));
    });
    it('renders a file', async () =>{
        await NODE_MCE.subcommand('utils2.test -vvv'.split(' '));
        let file = readFileSync('./test/demo.txt', 'utf-8');
        file.should.be.equal('works');
    });
    it('test override util', async () =>{
        let res:any = await NODE_MCE.subcommand('utils3.test -vvv'.split(' '));
        res.should.include({res:'true'});
    });
});
describe('Self Test', async ()=>{
    it('create a new project', async()=>{
        SELF = MCE('./src');
        await SELF.subcommand('new single_repo -f -s single'.split(' '));
    });
    it('create a new project multicommand', async()=>{
        await SELF.subcommand('new single_repo -f -s git'.split(' '));
    });
    it('renders all help', async()=>{
        SELF.help = true;
        let help = await SELF.subcommand([]);
        console.log(help);
    });
    it('renders command help', async()=>{
        SELF.help = true;
        process.argv.push('-h');
        let help = await SELF.subcommand('new'.split(' '));
        process.argv.pop();
        console.log(help);
    });
});