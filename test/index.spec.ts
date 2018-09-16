
import chai = require('chai');
import chaiAsPromised = require("chai-as-promised");
import { describe, it} from 'mocha';
import { wait } from '../src/spinner';
import { subcommand, loader, toggleHelp } from './loader';
import './options.spec';
import './arguments.spec';
import './utils.spec';

chai.use(chaiAsPromised);
chai.should();

describe('Self Test', async ()=>{
    it('create a new project', async()=>{
        loader('./src');
		await subcommand('new single_repo -f -s single');
		wait(1).then(o=>process.stdin.push('n\n'));
		await subcommand('new single_repo -s single');
    });
    it('create a new project multicommand', async()=>{
        await subcommand('new single_repo -f -s git');
    });
    it('command does not exist', async()=>{
        await subcommand('trim');
    });
    it('renders all help', async()=>{
        toggleHelp();
		let help = await subcommand('');
		toggleHelp();
        // console.log(help);
    });
    it('renders command help', async()=>{
        process.argv.push('-h');
        let help = await subcommand('new');
        process.argv.pop();
        // console.log(help);
    });
});