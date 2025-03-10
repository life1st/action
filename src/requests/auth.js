import axios from "axios"

export const getToken = async () => {
    const url = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal'
    const response = await axios.post(url, {
        app_id: 'cli_a732d6237679d00c',
        app_secret: '39fozuCgMt4l17Odsv82PhOwi2XI7UK4',
    })
    return response.data.tenant_access_token
}
