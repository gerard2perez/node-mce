import { subcommand } from './loader';
describe('Options Parsing', ()=>{
    it('get defaults options', async ()=>{
        const res:{} = await subcommand('options.test file.js');
        res.should.deep.equal({
            arg1: 'file.js',
            varidac: [],
            opt: {
                enumeration: undefined,
                number: undefined,
                floating: undefined,
                range: [],
				text:undefined,
				text_def: "def",
                bool: false,
                list:[],
                collect:[],
                verbose: 0
            }
        });
    });
    it('parses options values', async () =>{
        const res = await subcommand(
			'options.test file.js --enumeration single var2 --number 10 --floating 1.258 --range 2..55 --text demo --bool --list h1,h2,h5 --collect h3 --collect h6 --verbose'
			);
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
				text_def: "def",
                bool: true,
                list:[ 'h1', 'h2', 'h5'],
                collect:[
                    'h3', 'h6'
                ],
                verbose: 1
            }
        })
	});
	it('parses options set string to undefined', async () =>{
		const res = await subcommand(
			'options.test file.js --enumeration single var2 --number 10 --floating 1.258 --range 2..55 --text demo --bool --list h1,h2,h5 --collect h3 --collect h6 --verbose -d'
			);
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
				text_def: "",
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
        const res = await subcommand(
            'options.test file.js --enumeration single var2 --number=5 --floating=12.58 --range=2..55 --text=demo --bool --list=h10,h21 --collect=h30 --collect=h3 --collect=h6'
            );
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
				text_def: "def",
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
        const res = await subcommand(
            'options.test file.js -e git var2 -n=5 -f=12.58 -r=2..55 -t=demo -b -l=h10,h21 -c=h30 -c=h3 -c=h6'
            );
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
				text_def: "def",
                bool: true,
                list:[ 'h10', 'h21'],
                collect:[
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        })
	});
	it('parses options values with short tags (misstype)', async () =>{
        const res = await subcommand(
            'options.test file.js -e git var2 -n=5 -f=12.58 -r=2..55 -t=demo -b --l=h10,h21 -c=h30 -c=h3 -c=h6'
            );
        res.should.deep.equal({
            arg1: 'file.js',
            varidac: [
				'var2',
				'--l',
				'h10,h21'
            ],
            opt: {
                enumeration: 'git',
                number: 5,
                floating: 12.58,
                range: [2, 55],
				text:'demo',
				text_def: "def",
                bool: true,
                list:[],
                collect:[
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        })
    });
    it('parses options mixed formats', async () =>{
        const res = await subcommand(
            'options.test file.js --enumeration single var2 -n=5 --floating=12.58 -r 2..55 --text demo --bool --list=h10,h21 -c=h30 --collect h3 --collect=h6'
            );
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
				text_def: "def",
                bool: true,
                list:[ 'h10', 'h21'],
                collect:[
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        });
        
	});
	it('multiple short tags together', async () =>{
		const res = await subcommand(
			'options.test file.js -e single var2 -nf 5 12.58 -rtb 2..55 demo --list=h10,h21 --collect=h30 --collect=h3 --collect=h6 -vvv'
			);
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
				text_def: "def",
				bool: true,
				list:[ 'h10', 'h21'],
				collect:[
					'h30', 'h3', 'h6'
				],
				verbose: 3
			}
		})
	});
    it('parses options mixed formats', async () =>{
        const res = await subcommand(
            'options.test file.js --enumeration single var2 -n=5 --floating=gb -r 2..55 --text demo --bool --list=h10,h21 -c=h30 --collect h3 --collect=h6'
            );
        res.should.deep.equal({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'single',
                number: 5,
                floating: undefined,
                range: [2, 55],
				text:'demo',
				text_def: "def",
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