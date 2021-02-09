const fs = require('fs')
const path = require('path')
const os = require('os');

const folderPath = path.resolve(__dirname, './src/static')
const targetFilePath = path.resolve(__dirname, './src/data/data.js')
const folderList = fs.readdirSync(folderPath)
const systemType = os.type()
const splitSymbol = systemType == 'Windows_NT' ? '\r\n' : systemType == 'Darwin' ? '\r' : '\n'

let list = []
fs.access(targetFilePath, function(err) {
    if(err && err.code == 'ENOENT') {
        fs.appendFile(targetFilePath, '', function(error){
            console.log(error, 'error')
        })
    }
})
// 递归读取文件，避免日期顺序错乱
function readData(folderList, index = 0) {
    const filePath = path.resolve(folderPath, folderList[index])
    const date = folderList[index].replace('.txt', '')
    fs.readFile(filePath, 'utf8' , (err, data) => {
        if (err) {
            return
        }
        const workers = clearData(data)
        list.push({date, workers})
        if (index < folderList.length - 1) {
            readData(folderList, index + 1)
        } else {
            writeData()
        }
    })
}
// 格式化数据 1. 群主管理员文字会被复制进来 2. 没有头像的话名字或名字后两个字会被当成头像并复制进来并且在正确名字前面
function clearData(data) {
    const simpleData = data.split(splitSymbol).filter(item => item && item != '群主' && item != '群管理员')
    const inaccurateData = []
    for (let index = 0; index < simpleData.length - 1; index++) {
        if (simpleData[index + 1].indexOf(simpleData[index]) === -1) {
            inaccurateData.push(simpleData[index])
        }
    }
    simpleData.length && inaccurateData.push(simpleData[simpleData.length - 1])
    return inaccurateData
}
// 写入
function writeData() {
    if (list.length) {
    const content = `
const data = [${list.reduce((a, c) => {
    const item = `{
        date: '${c.date}',
        workers: [${c.workers.reduce((acc, cur) => {
            return acc + `'${cur}', `
        }, '')}],
    }, `
    return a + item
}, '')}
]
export default data
        `
        fs.writeFile(targetFilePath, content, 'utf8', function(error) {
            if(error){
                console.log(error);
                return false;
            }
            console.log('数据导入成功');
        })
    }
}

(function start() {
    readData(folderList)
})()
