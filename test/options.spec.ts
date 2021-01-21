import { GitStyle, Reset, Restore, SetProjectPath } from './@utils/loader'

describe('Options Parsing', () => {
	beforeAll(() => SetProjectPath('./test'))
	beforeEach(() => Reset())
	afterAll(() => Restore())
    test('get defaults options', async () => {
        const res = await GitStyle<unknown>('options file.js')
        expect(res).toEqual({
            arg1: 'file.js',
            varidac: [],
            opt: {
                enumeration: undefined,
                number: undefined,
                floating: undefined,
                range: [],
				text: undefined,
				text_def: 'def',
                bool: false,
                list: [],
                collect: [],
                verbose: 0
            }
        })
    })
    test('parses options values', async () => {
        const res = await GitStyle(
			'options file.js --enumeration single var2 --number 10 --floating 1.258 --range 2..55 --text demo --bool --list h1,h2,h5 --collect h3 --collect h6 --verbose'
			)
        expect(res).toEqual({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'single',
                number: 10,
                floating: 1.258,
                range: [2, 55],
				text: 'demo',
				text_def: 'def',
                bool: true,
                list: [ 'h1', 'h2', 'h5'],
                collect: [
                    'h3', 'h6'
                ],
                verbose: 1
            }
        })
	})
	test('parses options set string to undefined', async () => {
		const res = await GitStyle(
			'options file.js --enumeration single var2 --number 10 --floating 1.258 --range 2..55 --text demo --bool --list h1,h2,h5 --collect h3 --collect h6 --verbose -d'
			)
		expect(res).toEqual({
			arg1: 'file.js',
			varidac: [
				'var2'
			],
			opt: {
				enumeration: 'single',
				number: 10,
				floating: 1.258,
				range: [2, 55],
				text: 'demo',
				text_def: '',
				bool: true,
				list: [ 'h1', 'h2', 'h5'],
				collect: [
					'h3', 'h6'
				],
				verbose: 1
			}
		})
	})
    test('parses options values with symbol =', async () => {
        const res = await GitStyle(
            'options file.js --enumeration single var2 --number=5 --floating=12.58 --range=2..55 --text=demo --bool --list=h10,h21 --collect=h30 --collect=h3 --collect=h6'
            )
        expect(res).toEqual({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'single',
                number: 5,
                floating: 12.58,
                range: [2, 55],
				text: 'demo',
				text_def: 'def',
                bool: true,
                list: [ 'h10', 'h21'],
                collect: [
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        })
    })
    test('parses options values with short tags', async () => {
        const res = await GitStyle(
            'options file.js -e git var2 -n=5 -f=12.58 -r=2..55 -t=demo -b -l=h10,h21 -c=h30 -c=h3 -c=h6'
            )
        expect(res).toEqual({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'git',
                number: 5,
                floating: 12.58,
                range: [2, 55],
				text: 'demo',
				text_def: 'def',
                bool: true,
                list: [ 'h10', 'h21'],
                collect: [
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        })
	})
	test('parses options values with short tags (misstype)', async () => {
        const res = await GitStyle(
            'options file.js -e git var2 -n=5 -f=12.58 -r=2..55 -t=demo -b --l=h10,h21 -c=h30 -c=h3 -c=h6'
            )
        expect(res).toEqual({
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
				text: 'demo',
				text_def: 'def',
                bool: true,
                list: [],
                collect: [
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        })
    })
    test('parses options mixed formats', async () => {
        const res = await GitStyle(
            'options file.js --enumeration single var2 -n=5 --floating=12.58 -r 2..55 --text demo --bool --list=h10,h21 -c=h30 --collect h3 --collect=h6'
            )
        expect(res).toEqual({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'single',
                number: 5,
                floating: 12.58,
                range: [2, 55],
				text: 'demo',
				text_def: 'def',
                bool: true,
                list: [ 'h10', 'h21'],
                collect: [
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        })
        
	})
	test('multiple short tags together', async () => {
		const res = await GitStyle(
			'options file.js -e single var2 -nf 5 12.58 -rtb 2..55 demo --list=h10,h21 --collect=h30 --collect=h3 --collect=h6 -vvv'
			)
		expect(res).toEqual({
			arg1: 'file.js',
			varidac: [
				'var2'
			],
			opt: {
				enumeration: 'single',
				number: 5,
				floating: 12.58,
				range: [2, 55],
				text: 'demo',
				text_def: 'def',
				bool: true,
				list: [ 'h10', 'h21'],
				collect: [
					'h30', 'h3', 'h6'
				],
				verbose: 3
			}
		})
	})
    test('parses options mixed formats', async () => {
        const res = await GitStyle(
            'options file.js --enumeration single var2 -n=5 --floating=gb -r 2..55 --text demo --bool --list=h10,h21 -c=h30 --collect h3 --collect=h6'
            )
        expect(res).toEqual({
            arg1: 'file.js',
            varidac: [
                'var2'
            ],
            opt: {
                enumeration: 'single',
                number: 5,
                floating: undefined,
                range: [2, 55],
				text: 'demo',
				text_def: 'def',
                bool: true,
                list: [ 'h10', 'h21'],
                collect: [
                    'h30', 'h3', 'h6'
                ],
                verbose: 0
            }
        })
	})
})
