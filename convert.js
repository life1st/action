const { promises: fs } = require('fs')
const path = require('path')
const axios = require('axios')

const entry = './src/data'

async function sendReq(data) {
    const isDev = !process.argv.includes('--action')
    const devHost = 'http://localhost:3196'
    const prodHost = 'https://1lzpwnnf-3196.inc1.devtunnels.ms'
    const path = '/convert'
    const url = (isDev ? devHost : prodHost) + path
    const result = await axios.post(url, data)
    return result
}

async function run() {
    const files = await fs.readdir(entry)
    const data = {}
    for (let filePath of files) {
        const [name, ext] = filePath.split('.')
        if (ext === 'json') {
            const fullPath = path.join(entry, filePath)
            const content = await fs.readFile(fullPath, 'utf-8')
            data[name] = JSON.parse(content)
        }
    }
    const result = await sendReq(data)   
    console.log(result.status, result.data)
}

run()