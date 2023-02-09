const yargs = require('yargs')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

const options = yargs
    .usage('Usage: -p <path to directory> -s <searched string>')
    .option('p', {
        alias: 'path',
        describe: 'Path to directory',
        type: 'string',
        default: process.cwd(),
    })
    .option('s', {
        alias: 'search',
        describe: 'Searched string',
        type: 'string',
        default: '',
    }).argv;

let currentDir = options.p;

const readDir = () => {

    const fileDirList = fs.readdirSync(currentDir)

    inquirer.prompt([
        {
            name: 'fileName',
            type: 'list',
            message: 'Выберите файл или директорию для чтения',
            choices: fileDirList
        },
    ]).then(({ fileName }) => {

        const fullPath = path.join(currentDir, fileName);
        const isDir = fs.lstatSync(fullPath).isDirectory();

        if (isDir) {
            currentDir = fullPath;
            readDir()
        } else {
            const data = fs.readFileSync(fullPath, 'utf-8');
            if (options.s == '') console.log('data: ', data);
            else {
                const regExp = new RegExp(options.s, 'igm');
                console.log('Searched string in file: ', data.match(regExp));
            }
        }
    })
}
readDir();