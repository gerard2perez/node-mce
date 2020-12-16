# @gerard2p/mce


![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square) | ![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square) | [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.png?v=101&style=flat-square)](https://github.com/ellerbrock/typescript-badges/)
-|-|-
[![CI](https://github.com/gerard2p/node-mce/workflows/CI/badge.svg?branch=master&event=push&style=flat-square)](https://github.com/gerard2p/node-mce/actions) | [![Dependency Status](https://david-dm.org/gerard2p/node-mce.svg?style=flat-square)](https://david-dm.org/gerard2p/node-mce) | [![devDependencies Status](https://david-dm.org/gerard2p/node-mce/dev-status.svg?style=flat-square)](https://david-dm.org/gerard2p/node-mce?type=dev)
[![Code Climate](https://codeclimate.com/github/gerard2p/node-mce/badges/gpa.svg?style=flat-square)](https://codeclimate.com/github/gerard2p/node-mce?style=flat-square) | [![Test Coverage](https://codeclimate.com/github/gerard2p/node-mce/badges/coverage.svg?style=flat-square)](https://codeclimate.com/github/gerard2p/node-mce/coverage) | [![Issue Count](https://codeclimate.com/github/gerard2p/node-mce/badges/issue_count.svg?style=flat-square)](https://codeclimate.com/github/gerard2p/node-mce)
![PRs Welcome](https://img.shields.io/badge/PRs%20🔀-Welcome-brightgreen.svg?style=flat-square) | [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgerard2p%2Fnode-mce.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgerard2p%2Fnode-mce?ref=badge_shield) | 

## Installation

```sh
npm i -g @gerard2p/mce
```

## Usage

```sh
    mce new <application> [options]
      Creates a new MCE project.
        -f, --force          Overrides target directory                            
        -n, --npm            Install npm dependencies                              
        -s, --style <style>  Define the style of command you will use. If you need
                              more than one command use git.
                              Values: git | *single
    mce add <command>
      Adds a new command to the git project.
```
This will create project that is ready to work with mce. The project scaffolding look like this:

### Project Structure

```
project_name::
  |--.vscode
  |  |--launch.json
  |  |--settings.json
  |  |--task.json
  |
  |--src
  |  |--index.ts       [single-style]
  |  |--cli.ts
  |  |--commands       [git-style]
  |    |--removeme.ts
  |
  |--.gitignore
  |--package.json
  |--tsconfig.json
  |--project_name

```
### Configuring command

- **Single-Style** only uses a **index.ts** in the src folder.
- **Git-Style uses** [command].ts files inside the commands folder.
> In any of both cases a command is defined in the same way.

```typescript
import { numeric, floating, range, text, list, collect, bool, verbose, enumeration, Parsed} from '@gerard2p/mce';
import { ok, error, warn, info, ask, input } from '@gerard2p/mce/verbose';
import { created, updated, makeDir, cp, printRelativePath, targetPath, cliPath } from '@gerard2p/mce/utils';
import { spin } from '@gerard2p/mce/spinner';
enum Styles { 
    git = 'git',
    single = 'single' 
}
export let description = 'A description for your command';
export let args = '<arg1> [varidac...]';
export let options = {
    enumeration: enumeration('-e <enum>', 'Define the style of command you will use', Styles,Styles.single),
    number: numeric('-n <n>', 'A number'),
    floating: floating('-f <n>', 'A float number'),
    range: range('-r <a>..<b>', 'A Range of two numbers'),
    text: text('-t <n>', 'A string value'),
    list: list('-l <n>', 'comma separed values'),
    collect: collect('-c <n>', 'A repetable value'),
    bool: bool('-b', 'A boolean value'),
    verbose: verbose('Increase system verbosity'),
};
export async function action(arg1:string, varidac:string[], opt:Parsed<typeof options>) {
    // Your Code
}
```
## Option Parsing

You must export a options variable with the options that you want to use.
As you can see you can defined a lot of types for your options most of the options cant take a '' as first parameter and mce will generate the tags for you.

The name in the you use to define the property is used as main tag, if you pass '' as the first argument it will fill with a automatic tag_desc and no sort tag will be generated.
On the other hand if you pass a string like `-e --env <env>` mce will use those values as the short tag, tag and tag value.

option|short|tag|tag_desc|desc
-|-|-|-|-
`enumeration:enumeration('', 'description', ['a','b'])`| | --enumeration|`<e>`|description Values a \| b
`enumeration:enumeration('-l', 'description', ['a','b'])`|-l|--enumeration|`<e>`|description Values a \| b
`enumeration:enumeration('-l --list', 'description', ['a','b'])`|-l|--list|`<e>`|description Values a \| b
`enumeration:enumeration('-l --list <l>', 'description', ['a','b'])`|-l|--list|`<l>`|description Values a \| b

No mather the case the actual property that is created in the *opt* is always *enumeration* for this case.

### Coercion

As you can see mce come with some handy functios to coerce and validate the user input.

```typescript
import { numeric, floating, range, text, list, collect, bool, verbose, enumeration } from '@gerard2p/mce';
```

### Validation

If you need to validate the information of any of your arguments you can pass a RegExp as the third arguments of the option_functions
```
import { text } from '@gerard2p/mce';

export let options = {
 size: text('-s --size <size>', 'Pizza size', /^(large|medium|small)$/);
}
```

### Defaults

The last argument you pass will always be the default value.
```
import { text } from '@gerard2p/mce';

export let options = {
 size: text('-s --size <size>', 'Pizza size', /^(large|medium|small)$/, 'medium');
}
```

### Version option

By default mce will trace the --version tag and will respond with the version in your package.json.

### Verbose option

By default mce will trace the ```-v --verbose``` tag and will respond wwith the version in your package.json.
> Only if you define a verbose obtion you will be passed with the actual verbose value but in most of the cases is no needed.

## Arguments

You need to export a ```args:string``` property with you arguments definition

### Required args

```<arg>``` is the convention to make your arg required is no arg detected mce will throw and error.

### Optional args

```[arg]``` is the convention to make your arg optional.

### Varidac args

```[arg ...]``` is the convention to make the rest of the args be presented as varidad ```string[]```

### Coecion

Argument can be coerced by default they are treated as string but if you use:
- `<arg:`**number**`>` will be coerce to number.
- `<arg:`**boolean**`>` will be coerce to boolean.

## Help Generation
By default mce will trace the ```-h --help``` options and will automatically render help

# Add a new command to project

Just run:
```sh
mce add <command>
```

Adds a new command to a git-style project.

# Useful Utilities

MCE con with a handy bunch of utilities to help you build your commands easily.

## Input
```ts
import { confirm, override, question} from '@gerard2p/mce/input'
```

### question(display:string)=>Promise\<string\>

This is the basic function that allows you to wait for user input. Is compatible with the spinner, so, whenever you call this functions the spinner will stop and display the new message.

When the user enters the input the spinner will continue working as expected.

```
let answer = await question('Are you ready?')
```

Will display

```
Are you ready? _
```
And will wait for user input.


if inside a spinner:
```
await spin('demo', async ()=>{
 let answer = await question('Are you ready?')
});
```
```
demo - Are you ready? _
```

### confirm (display:string)=>Promise\<boolean\>
```ts
if(await confirm('Are you ready')) {
 // code
}
// Are you ready? [y/n]: _
```
```ts
await spin('demo', async ()=>{
 if(await confirm('Are you ready')) {
  // code
 }
});
// demo - Are you ready? [y/n]: _
```

### override (display:string, testdir:string, state:boolean)=>Promise\<boolean\>
Returns true if safe to write the directory and content.
Removes the directory if is needed.
```ts
if(await override('Path already exists do you want to continue')) {
 // code
}
// Path already exists do you want to continue? [y/n]: _
```
```ts
await spin('demo', async ()=>{
 if(await override('Path already exists do you want to continue')) {
  // code
 }
});
// demo - Path already exists do you want to continue? [y/n]: _
```

## tree-maker

```ts
import { pathResolver } from '@gerard2p/mce/tree-maker/fs'
```
This function allows you to intersect the path that resolves to your templates and the target path.


### pathResolver(_template:(path:string)=>string, _target?:(path:string)=>string):void

_template will resolve to a template folder located next to your package.json

```ts
import { cpy, cmp, dir, root, wrt } from '@gerard2p/mce/tree-maker'
import {   c,   z,   d,    r,   w } from '@gerard2p/mce/tree-maker'
```

This utility allows to create a directory structure in a really easy and chainable way.

```ts
root('proyect')
 .with(
  cpy('LICENSE')
 )
 .dir('subfolder',
 cmp('README.md', {...values}, 'DOC.md'),
  cmp('README.md', {...values}),
  wrt('.gitignore','node_modules\ttemplates')
 )
```
will produde:
```sh
proyect
  |- LICENSE
  |-subfolder
    |-DOC.md
    |-README.md
    |-.gitignore
```

### root(dir:string)=>TreeMaker
Creates the initial directory.

### cpy(source:string, target:string)=>chainable
Copies a file from your template directory to the destination folder.
Target can be undefined and will use the same name as your source.

### cmp(source:string, data:any, target:string)=>chainable
Renders a file from your template directory to the destination folder.
Target can be undefined and will use the same name as your source.

### wrt(target:string, content:string)=>chainable
Create a file at target location.

### dir(folder:string, ...operations:chainable[])=>chainable
Create a new directory and allows to chain new operations

# Final Notes

The executable file that is generated only call your ./cli file.

When in git-style cli.ts will look like:
```typescript
import { MCE } from "@gerard2p/mce";

MCE(__dirname).subcommand(process.argv);
```

And in single-style:
```typescript
import { MCE } from "@gerard2p/mce";

MCE(__dirname).command(process.argv);
```

> During local development I use ts-node to call direct the .ts files