const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|');
const expression = new RegExp(pattern, 'g');
const stripAnsi = input => typeof input === 'string' ? input.replace(expression, '') : input;

export {stripAnsi, stripAnsi as default}