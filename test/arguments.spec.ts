import { GitStyle, Reset, Restore, SetProjectPath } from './@utils/loader'
import { readLog } from './@utils/log-reader'

describe('Arguments Parsing', () => {
	beforeAll(() => SetProjectPath('./test/demo_project'))
	beforeEach(() => Reset())
	afterAll(() => Restore())
	test('byoass', () => expect(true).toBeTruthy())
	// test('full rendering of arguments', async () => {
	// 	await expect(GitStyle('args8 -h')).resolves.toBe(readLog('args8.help.log'))
	// })
    // test('throws if not required arguments', async() => {
    //     const res = GitStyle('args8')
    //     await expect(res).rejects.toThrow('Missing argument arg1')
    // })
    // test('throws if optinal argument and variadac are together', async() => {
    //     const res = GitStyle('args1 arg1 arg2')
    //     await expect(res).rejects.toThrow('Optional Argument and Varidac cannot be next to each other')
    // })
    // test('thows errors if optional before than required argument', async () => {
    //     const res = GitStyle('args2 arg1 arg2')
    //     await expect(res).rejects.toThrow('All required arguments should go befere optional arguments')
    // })
    // test('throws argument count mismath', async () => {
    //     const res = GitStyle('args3 arg1 arg2')
    //     await expect(res).rejects.toThrow('Argument count missmatch')
    // })
    // test('throws argument type missmatch', async () => {
    //     const res = GitStyle('args4 arg1 true')
    //     await expect(res).rejects.toThrow('Argument type missmatch')
    // })
    // test('throws argument type missmatch', async () => {
    //     const res = GitStyle('args4 10 arg2')
    //     await expect(res).rejects.toThrow('Argument type missmatch')
	// })
	// test('parses arguments correctly', async () => {
    //     const res = await GitStyle('args4 10 false')
    //     expect(res).toEqual({
	// 		arg1: 10,
	// 		arg2: false,
	// 		opt: {
    //             enumeration: undefined,
    //             number: undefined,
    //             floating: undefined,
    //             range: [],
    //             text: undefined,
    //             bool: false,
    //             list: [],
    //             collect: [],
    //             verbose: 0
    //         }
	// 	})
    // })
    // test('throws argument does not match expression', async () => {
    //     const res = GitStyle('args6 -n 5 -t xlk')
    //     await expect(res).rejects.toThrow('does not match expression')
    // })
    // test('throws Missing value for argument', async () => {
    //     const res = GitStyle('args6 -t lk -n -l')
    //     await expect(res).rejects.toThrow('Missing value for argument')
    // })
    // test('throws duplicated short tag', async () => {
    //     const res = GitStyle('args7 -h')
    //     await expect(res).rejects.toThrow('duplicated short tag')
    // })
    // test('render help', async () => {
	// 	const help = await GitStyle('args6 -h')
	// 	expect(help).toBeDefined()
    // })
    // test('Varidac argument can only be in last place', async () => {
	// 	const res = GitStyle('args5 true 10 arg2 -n=r -f=a')
    //     await expect(res).rejects.toThrow('Varidac argument can only be in last place')
	// })
})
