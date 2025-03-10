import fs from 'fs'
import path from 'path'

export const saveAsJson = (data, folderPath) => {
    // key 是每个字段的 key，不保存为单独文件，其他每个语言都保存为单独文件
    const filenames = data[0].filter(k => k === 'key')

    // 遍历每一行数据
    const result = {}
    data.forEach((row, i) => {
        // 跳过表头
        if (i === 0) return

        // 获取当前行的 key
        const key = row[0]
        
        // 遍历每个语言的值
        data[0].forEach((lang, index) => {
            // 跳过 key 列
            if (index === 0) return
            // 跳过空的语言
            if (!lang) return

            // 如果这个语言还没有对象,创建一个
            if (!result[lang]) {
                result[lang] = {}
            }

            // 保存翻译值
            result[lang][key] = row[index]
        })
    })

    Object.entries(result).forEach(([lang, data]) => {
        const filePath = path.join(folderPath, `${lang}.json`)  
        console.log(filePath, 'filePath')
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    })
}
