
process.env.TEST = 'test';
import chai = require('chai');
import chaiAsPromised = require("chai-as-promised");
import { describe, it} from 'mocha';
import { wait, cliSpinner } from '../src/spinner';
import { subcommand, loader, toggleHelp } from './loader';
import './options.spec';
import './arguments.spec';
import './utils.spec';
import { FakeStream } from './fake-output';
import { readFileSync } from 'fs';

chai.use(chaiAsPromised);
chai.should();
const stream = new FakeStream('log.txt');
cliSpinner({text: '',stream, enabled:true});
function loadContent(path:string) {
	return readFileSync(path, 'utf-8').replace(/\r/g, '');
}

describe('Self Test', async ()=>{
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
        toggleHelp();
		await subcommand('');
		stream.content.should.be.equal(loadContent('./test/logs/all.help.log'));
		toggleHelp();
    });
    it('renders command help', async()=>{
		stream.clear();
        process.argv.push('-h');
        let help = await subcommand('new');
        process.argv.pop();
		stream.content.should.be.equal(loadContent('./test/logs/new.help.log'));
    });
});