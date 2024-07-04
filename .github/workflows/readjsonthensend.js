const core = require('@actions/core')
const { promises: fs } = require('fs')
const axios = require('axios')

async function sendReq(data) {
    const isDev = true
    const devHost = 'localhost:3196'
    const prodHost = ''
    const path = '/convert'
    const url = isDev ? devHost : prodHost + path
    const result = await axios.post(url, data)
    return result
}
async function run() {
    const entryPath = core.getInput('entry')
    const entry = await fs.stat(entry)
    const files = []
    if (entry.isDirectory()) {
        files.push(...await fs.readdir(entry, 'utf8'))
    } else {
        const file = await fs.readFile(entryPath, 'utf8')
        files.push(file)
    }
    const data = Object.fromEntries(
        files.map(file => [file, JSON.parse(fs.readFileSync(file, 'utf8'))])
    )
    console.log(data)
    
    const result = await sendReq(data)
    console.log(result)
    core.setOutput('result', result)
}

run()