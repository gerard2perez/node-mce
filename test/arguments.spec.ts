jest.mock('@gerard2p/mce/mockable/fs')
import { Execute, find, Reset, Restore, SetProjectPath } from './@utils/loader'
import { readLog } from './@utils/log-reader'

describe('Arguments Parsing', () => {
	beforeAll(() => SetProjectPath('./test/demo_project'))
	beforeEach(() => {
		Reset()
		find.commands('args1', 'args2', 'args3', 'args4', 'args5', 'args6', 'args7', 'args8', 'args9')
	})
	afterAll(() => Restore())
	test('full rendering of arguments', async () => {
		await expect(Execute('demo args8 -h')).resolves.toBe(readLog('args8.help.log'))
	})
    test('throws if not required arguments', async() => {
        const res = Execute('demo args8')
        await expect(res).rejects.toThrow('Argument arg1 is required')
    })
    test('throws if optinal argument and variadac are together', async() => {
        const res = Execute('demo args1 arg1 arg2')
        await expect(res).rejects.toThrow('Optional Argument and Varidac cannot be next to each other')
    })
    test('thows errors if optional before than required argument', async () => {
        const res = Execute('demo args2 arg1 arg2')
        await expect(res).rejects.toThrow('All required arguments should go befere optional arguments')
    })
    test('throws argument count mismath', async () => {
        const res = Execute('demo args3 arg1 arg2 arg3')
        await expect(res).rejects.toThrowError(/Unexpected arguments passed: .*/)
    })
    test('throws argument type missmatch', async () => {
        const res = Execute('demo args4 arg1 true')
        await expect(res).rejects.toThrow('Argument type missmatch')
    })
    test('throws argument type missmatch', async () => {
        const res = Execute('demo args4 10 arg2')
        await expect(res).rejects.toThrow('Argument type missmatch')
	})
	test('parses arguments correctly', async () => {
        const res = await Execute('demo args4 10 false')
        expect(res).toEqual({
			arg1: 10,
			arg2: false,
			opt: {
                enumeration: undefined,
                number: undefined,
                floating: undefined,
				help: false,
                range: [],
                text: undefined,
                bool: false,
                list: [],
                collect: [],
                verbose: 0
            }
		})
    })
    // test('throws argument does not match expression', async () => {
    //     const res = Execute('demo args6 -n 5 -t xlk')
    //     await expect(res).rejects.toThrow('does not match expression')
    // })
    test('throws Missing value for argument', async () => {
        const res = Execute('demo args6 -t lk -n -l')
        await expect(res).rejects.toThrow('Missing value for option: number')
    })
    test('throws duplicated short tag', async () => {
        const res = Execute('demo args7 -h')
        await expect(res).rejects.toThrow('Duplicated short tag')
    })
    test('render help', async () => {
		const help = await Execute('demo args6 -h')
		expect(help).toBeDefined()
    })
    test('Varidac argument can only be in last place', async () => {
		const res = Execute('demo args5 true 10 arg2 -n=r -f=a')
        await expect(res).rejects.toThrow('Varidac argument can only be in last place')
	})
	test('Varidac Parser for new API', async () => {
		const result = await Execute('demo args9 10 hello world')
		expect(result).toEqual({
			arg1: 10,
			arg2: [
				'hello',
				'world'
			]
		})
	})
})
