const { exec } = require('child_process');
const { existsSync, readdirSync, renameSync, statSync } = require('fs');

const HACTOOL = `${process.cwd()}/hactool.exe`;
const PRODKEYS = `${process.cwd()}/prod.keys`;
const FIRMWARE = `${process.cwd()}/firmware`;

const colors = {
    'default': (text) => { return `\x1b[38;2;44;52;121m${text}\x1b[39m` },
    'success': (text) => { return `\x1b[38;2;7;106;0m${text}\x1b[39m` },
    'warning': (text) => { return `\x1b[38;2;255;116;0m${text}\x1b[39m` },
    'error'  : (text) => { return `\x1b[38;2;118;1;1m${text}\x1b[39m` }
};

console.clear();
console.log(colors.default(`
______           ______                _      _____                           _            
|  _  \\          | ___ \\              | |    /  __ \\                         | |           
| | | |__ _ _   _| |_/ /_ __ ___  __ _| | __ | /  \\/ ___  _ ____   _____ _ __| |_ ___ _ __ 
| | | / _\` | | | | ___ \\ '__/ _ \\/ _\` | |/ / | |    / _ \\| '_ \\ \\ / / _ \\ '__| __/ _ \\ '__|
| |/ / (_| | |_| | |_/ / | |  __/ (_| |   <  | \\__/\\ (_) | | | \\ V /  __/ |  | ||  __/ |   
|___/ \\__,_|\\__, \\____/|_|  \\___|\\__,_|_|\\_\\  \\____/\\___/|_| |_|\\_/ \\___|_|   \\__\\___|_|   
             __/ |                                                                                             
            |___/                                                   v1.0.0 By MurasakiNX 
`));

if (!existsSync(HACTOOL) || !statSync(HACTOOL).isFile())
    console.log(colors.warning('[WARNING] Please download hactool.exe.'));
else if (!existsSync(PRODKEYS) || !statSync(PRODKEYS).isFile())
    console.log(colors.warning('[WARNING] Please download prod.keys.'));
else if (!existsSync(FIRMWARE) || !statSync(FIRMWARE).isDirectory())
    console.log(colors.warning('[WARNING] Please put firmware files into the firmware folder.'));
else {
    const FILES = readdirSync(FIRMWARE).filter(f => !f.endsWith('.cnmt.nca') && f.endsWith('.nca'));
    for (const FILE of FILES) {
        const FILE_PATH = `${FIRMWARE}/${FILE}`;
        exec(`"${HACTOOL}" -k "${PRODKEYS}" -i "${FILE_PATH}"`, (err, stdout, stderr) => {
            if (err || stderr)
                throw colors.error(`[HACTOOL.EXE]\n${err || stderr}`);
            else if (stdout.includes('Done!'))
                renameSync(FILE_PATH, `${FIRMWARE}/${FILE.replace('.nca', '.cnmt.nca')}`);
        });
    };

    console.log(colors.success('[SUCCESS] - Done !'), colors.warning('\n[EXIT] - Press any key to exit.'));
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
};