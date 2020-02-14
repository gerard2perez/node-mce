const chokidar = require('chokidar');
const glob = require('glob').sync;
const chalk = require("chalk");
const {watchFile,readFileSync, existsSync, unlinkSync} = require('fs');
const { posix:{relative, join} } = require('path');
function removeUnwanted(path, stats) {
    let {program:{fileInfos}} = JSON.parse(readFileSync('./incremental.tsbuildinfo'));
    let compiled = Object.keys(fileInfos).filter(f=>!f.includes('node_modules')).map(o=>relative('./src',o).replace('.ts', ''));
    let sources = glob('lib/**/*.js', {ignore:['lib/node_modules/**/*', 'lib/templates/**/*'], dot:true}).map(o=>relative('./lib', o.replace('.js', '')));
    let fileToRemove = toLib(xor(sources, compiled));
    for(const file of fileToRemove) {
        console.log(`[${chalk.gray(new Date().toLocaleTimeString())}] [${chalk.blue('INC.DEL')}]`, file);
        if(existsSync(file))unlinkSync(file);
    }
  }
chokidar.watch('./incremental.tsbuildinfo').on('change', removeUnwanted).on('add', removeUnwanted);
  function xor(arr1, arr2) {
    let arr3 = [...arr2, ...arr1].filter((v,i,a)=>(i===a.indexOf(v)));
    let result = [];
    for(const entry of arr3) {
        if(!arr2.includes(entry) || !arr1.includes(entry)) {
            result.push(entry);
        }
    }
    return result;
  }
  function toLib(files) {
      let all = [].concat.apply([], files.map(f=>join('lib',f)).map(f=>[`${f}.d.ts`,`${f}.js.map`,`${f}.js`]));
      return all;
  }