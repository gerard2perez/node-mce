
process.env.TEST = 'test';
import chai = require('chai');
import chaiAsPromised = require("chai-as-promised");
import { readFileSync } from 'fs';
import { describe, it } from 'mocha';
import { cliSpinner, wait } from '../src/spinner';
import './arguments.spec';
import { FakeStream } from './fake-output';
import { loader, subcommand, subCommandWithModule } from './loader';
import './options.spec';
import './utils.spec';
import { resolve } from 'path';

chai.use(chaiAsPromised);
chai.should();
const stream = new FakeStream('log.txt');
cliSpinner({text: '',stream, enabled:true});
function loadContent(path:string) {
	return readFileSync(path, 'utf-8').replace(/\r/g, '');
}

describe('Self Test', async ()=>{
	it('renders help', async()=>{
		stream.clear();
        await subcommand('new --version');
		stream.content.should.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/);
    });
    it('create a new project', async()=>{
		loader('./src');
		stream.clear();
		await subcommand('new single_repo -f -s single');
		wait(1).then(o=>process.stdin.push('n\n'));
		stream.content.should.be.equal(loadContent('./test/logs/new.output.log'));
		await subcommand('new single_repo -s single');
    });
    it('create a new project multicommand', async()=>{
		stream.clear();
		await subcommand('new single_repo -f -s git');
		stream.content.should.be.equal(loadContent('./test/logs/new-git.output.log'));
    });
    it('command does not exist', async()=>{
		stream.clear();
		await subcommand('trim');
		stream.content.should.be.equal('Command does not exists\n');
	});
    it('renders all help', async()=>{
		stream.clear();
		await subcommand('-h');
		stream.content.should.be.equal(loadContent('./test/logs/all.help.log'));
    });
    it('renders command help', async()=>{
		stream.clear();
        let help = await subcommand('new -h');
		stream.content.should.be.equal(loadContent('./test/logs/new.help.log'));
	});
	it('renders help for add command', async () => {
		stream.clear();
		await subcommand('add -h');
		stream.content.should.be.equal(loadContent('./test/logs/add.help.log'));
	});
	it('adds a dummy command fails', async () => {
		loader('./src');
		process.chdir('./single_repo/src/');
		stream.clear();
		await subcommand('add dummy');
		process.chdir('../../');
		stream.content.should.be.equal(loadContent('./test/logs/add.fail.log'));
	});
	it('adds a dummy command', async () => {
		loader('./src');
		process.chdir('./single_repo');
		stream.clear();
		await subcommand('add dummy');
		process.chdir('..');
		stream.content.should.be.equal(loadContent('./test/logs/add.log'));
	});
	it('loads submodules', async()=>{
		process.chdir('test');
		let res = await subCommandWithModule('test.json', 'submodule.test');
	});
	// it('ignores help', async()=>{
	// 	process.chdir('test');
	// 	console.log(resolve('.'))
	// 	loader('.');
	// 	let res = await subcommand('-h');
	// 	// console.log(stream.content);
	// });
});