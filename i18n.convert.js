import { promises as fs } from 'fs'
import path from 'path'
import axios from 'axios'

const entry = './src/i18n/en'

async function sendReq(data) {
    const branchName = process.argv.find(arg => arg.includes('branch'))
    const prodBranchs = ['master', 'main']
    console.log(branchName)
    const isDev = prodBranchs.every(name => !branchName.includes(name))
    const devHost = 'http://localhost:3196'
    const prodHost = 'https://1lzpwnnf-3196.inc1.devtunnels.ms'
    const path = '/convert'
    const url = (isDev ? devHost : prodHost) + path
    const result = await axios.post(url, data)
    return result
}

async function getLangs() {
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
    return data
}

async function run() {
    const data = await getLangs()
    const result = await sendReq(data)
    console.log(result.status, result.data)
}

run()