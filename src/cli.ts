import { MCE } from "./index";
// import { input, ask } from "./input";

// (async ()=>{
//     if (await ask('What to override the file?')) {
//         console.log('Overriding');
//     } else {
//         console.log('no Overrid');
//     }
//     console.log(await input('What you really thing?'))
// })();
let command = MCE().subcommand(process.argv);