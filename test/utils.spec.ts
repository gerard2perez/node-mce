import { readFileSync } from "fs";
import { resolve } from "path";
import { command, subcommand } from "./loader";

describe('Utils functions',async ()=>{
    it('gets correct paths', async ()=>{
        let res = await subcommand('utils.test');
        res.should.be.deep.equal({
            cli: resolve('./test'),
            target: resolve('./'),
        });
    });
    it('test verbosity', async () =>{
        let res = await subcommand('utils1.test');
    });
    it('test verbosuty 3', async () =>{
        let res = await subcommand('utils1.test -vvv');
    });
    it('renders a file', async () =>{
        await subcommand('utils2.test -vvv -r');
        let file = readFileSync('./test/demo.txt', 'utf-8');
        file.should.be.equal('works');
		let renered = await subcommand('utils2.test -vvv');
		renered.should.be.equal('works');
    });
    it('executes a single command', async () =>{
        await command('-v');
		await command('-h');
		await command('');
		await command('--version');
    });
    it('test override util', async () =>{
        let res = await subcommand('utils3.test -vvv');
        res.should.include({res:'true'});
	});
});