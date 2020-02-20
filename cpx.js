"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var path_1 = require("path");
var fs_1 = require("fs");
var glob_1 = require("glob");
var chokidar = require("chokidar");
var chalk = require("chalk");
var _a = process.argv.slice(2), sources = _a[0], target = _a[1], args = _a.slice(2);
var Options;
(function (Options) {
    Options[Options["watch"] = 'w'] = "watch";
    Options[Options["clean"] = 'c'] = "clean";
})(Options || (Options = {}));
var options = { watch: false, clean: false };
for (var _i = 0, _b = Object.keys(Options); _i < _b.length; _i++) {
    var option = _b[_i];
    if (args.includes("-" + option) || args.includes("--" + option)) {
        var arg = option.length === 1 ? Options[option] : Options[Options[option]];
        options[arg] = true;
    }
}
if (!sources || !target)
    throw new Error('Not enough arguments: <sources> <target> [options]');
function findTarget(from) {
    from = path_1.resolve(from).replace(path_1.resolve(), '');
    var to = from.replace(/\\/gm, '/').split('/');
    to.shift();
    if (to.length > 1)
        to.shift();
    return path_1.join.apply(void 0, __spreadArrays([target], to));
}
;
function createDirIfNotExist(to) {
    var dirs = [];
    var dir = path_1.dirname(to);
    while (dir !== path_1.dirname(dir)) {
        dirs.unshift(dir);
        dir = path_1.dirname(dir);
    }
    dirs.forEach(function (dir) {
        if (!fs_1.existsSync(dir)) {
            fs_1.mkdirSync(dir);
        }
    });
}
;
function log(place) {
    var text = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        text[_i - 1] = arguments[_i];
    }
    console.log.apply(console, __spreadArrays(["[" + chalk.gray(new Date().toLocaleTimeString()) + "] [" + chalk.blue(place) + "]"], text));
}
function copy(from) {
    var to = findTarget(from);
    createDirIfNotExist(to);
    var stats = fs_1.statSync(from);
    if (stats.isDirectory()) {
        return;
    }
    log('CPX.CPY', from, '>', to);
    fs_1.writeFileSync(to, fs_1.readFileSync(from));
}
;
function remove(from) {
    var to = findTarget(from);
    if (fs_1.existsSync(to)) {
        fs_1.unlinkSync(to);
        log('CPX.DEL', to);
    }
}
;
function rimraf(dir) {
    if (fs_1.existsSync(dir)) {
        fs_1.readdirSync(dir).forEach(function (entry) {
            var entryPath = path_1.join(dir, entry);
            if (fs_1.lstatSync(entryPath).isDirectory()) {
                rimraf(entryPath);
            }
            else {
                fs_1.unlinkSync(entryPath);
            }
        });
        fs_1.rmdirSync(dir);
    }
}
;
// clean
if (options.clean) {
    rimraf(target);
}
glob_1.sync(sources, { dot: true, ignore: 'node_modules' }).forEach(copy);
// watch
if (options.watch) {
    chokidar
        .watch(sources, {
        ignoreInitial: true
    })
        .on('add', copy)
        .on('addDir', copy)
        .on('change', copy)
        .on('unlink', remove)
        .on('unlinkDir', remove)
        .on('error', function (e) { return console.log('[ERROR]', e); });
}
