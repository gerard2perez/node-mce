# MCE

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgerard2p%2Fnode-mce.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgerard2p%2Fnode-mce?ref=badge_shield)

[![Build Status](https://img.shields.io/travis/gerard2p/node-mce/master.svg?style=flat-square)](https://travis-ci.org/gerard2p/node-mce)[![Dependency Status](https://david-dm.org/gerard2p/node-mce.svg?style=flat-square)](https://david-dm.org/gerard2p/node-mce)![PRs Welcome](https://img.shields.io/badge/PRs%20🔀-Welcome-brightgreen.svg?style=flat-square)

[![Code Climate](https://codeclimate.com/github/gerard2p/node-mce/badges/gpa.svg?style=flat-square)](https://codeclimate.com/github/gerard2p/node-mce?style=flat-square) [![Test Coverage](https://codeclimate.com/github/gerard2p/node-mce/badges/coverage.svg?style=flat-square)](https://codeclimate.com/github/gerard2p/node-mce/coverage) [![Issue Count](https://codeclimate.com/github/gerard2p/node-mce/badges/issue_count.svg?style=flat-square)](https://codeclimate.com/github/gerard2p/node-mce)


![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.png?v=101&style=flat-square)](https://github.com/ellerbrock/typescript-badges/)

## Installation

```sh
npm i -g node-mce
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
import { numeric, floating, range, text, list, collect, bool, verbose, enumeration, Parsed} from '@bitsun/mce';
import { ok, error, warn, info, ask, input } from '@bitsun/mce/console';
import { created, updated, makeDir, cp, printRelativePath, targetPath, cliPath } from '@bitsun/mce/utils';
import { spin } from '@bitsun/mce/spinner';
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

The name in the you use to define the property is used as main tag, if you pass '' as the first argument it will fill with a automatic value_desc and no sort tag will be generated.
On the other hand if you pass a string like '-e --env <env>' mce will use those values as the short tag, tag and tag value.

option|help generated
-|-
enumeration:enumeration('', 'description', ['a','b'])| --enumeration \<e>  description Values a \| b
enumeration:enumeration('-l', 'description', ['a','b'])| -l, --enumeration \<e>  description Values a \| b
enumeration:enumeration('-l --list', 'description', ['a','b'])| -l, --list \<e>  description Values a \| b
enumeration:enumeration('-l --list \<l>', 'description', ['a','b'])| -l, --list \<l>  description Values a \| b

No mather the case the actual property that is created in the *opt* is always *enumeration* for this case.

### Coercion

As you can see mce come with some handy functios to coerce and validate the user input.

```typescript
import { numeric, floating, range, text, list, collect, bool, verbose, enumeration } from '@bitsun/mce';
```

### Validation

If you need to validate the information of any of your arguments you can pass a RegExp as the third arguments of the option_functions
```
import { text } from '@bitsun/mce';

export let options = {
 size: text('-s --size <size>', 'Pizza size', /^(large|medium|small)$/);
}
```

### Defaults

The last argument you pass will always be the default value.
```
import { text } from '@bitsun/mce';

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

### Required args

```[arg]``` is the convention to make your arg optional.

### Varidac args

```[arg ...]``` is the convention to make the rest of the args be presented as varidad ```string[]```

### Coecion

Argument can be coerced by default they are treated as string but if you use:
- \<arg:**number**> will be coerce to number.
- \<arg:**boolean**> will be coerce to boolean.

## Help Generation
By default mce will trace the ```-h --help``` options and will automatically render help

# Final Notes

The executable file that is generated only call your ./cli file.

When in git-style cli.ts will look like:
```typescript
import { MCE } from "@bitsun/mce";

MCE(__dirname).subcommand(process.argv);
```

And in single-style:
```typescript
import { MCE } from "@bitsun/mce";

MCE(__dirname).command(process.argv);
```

> During local development I use ts-node to call direct the .ts files