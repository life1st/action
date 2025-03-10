import axios from "axios"
import { TOKEN_KEY } from "../consts.js"
import { config } from "../../utils/conf.js"

const calEnd = (gridProperties) => {
    const { row_count, column_count } = gridProperties
    // 结束格格式形如：D10，表示从A1到D10，这里把数字的列转换为字母 A-Z
    const column = String.fromCharCode(64 + column_count)
    return `${column}${row_count}`
}

export const getSheetsInfo = async (spreadsheetToken) => {
    const url = `https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${spreadsheetToken}/sheets/query`
    const token = config.get(TOKEN_KEY)
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (response.data) {
        return response.data.data.sheets.map(sheet => ({
            from: 'A1',
            to: calEnd(sheet.grid_properties),
            title: sheet.title,
            sheetId: sheet.sheet_id,
        }))
    }
    return null
}

export const getSheetRange = async (spreadsheetToken, { sheetId, from, to }) => {
    const url = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${sheetId}!${from}:${to}`
    const token = config.get(TOKEN_KEY)
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}