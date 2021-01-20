const utf8 = /UTF-?8$/i.test(process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG)
const fixtures = process.env.CI || process.env.TERM === 'xterm-256color' || process.env.TERM === 'cygwin'
export const isTTYSupported =  !process.env.TEST && (utf8 || fixtures || process.stdout.isTTY)