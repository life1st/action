#!/usr/bin/env node

import { program } from 'commander';
import open from 'open';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import { dirname } from 'path';
import { config } from '../utils/conf.js';
import { TOKEN_KEY } from '../src/consts.js';
import { getToken } from '../src/requests/auth.js';
import { getSheetsInfo, getSheetRange } from '../src/requests/sheet.js';
import { saveAsJson } from '../utils/json.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// 创建一个临时的 Express 服务器
const createAuthServer = () => {
  return new Promise((resolve) => {
    const app = express();
    const port = process.env.PORT || 3000;
    let token = null;

    app.get('/auth', (req, res) => {
      // 生成随机 token
      token = Math.random().toString(36).substring(2);
      
      res.send(`
        <script>
          fetch('http://localhost:${port}/auth/callback?token=${token}')
            .then(() => {
              document.body.innerHTML = '<h3>认证成功！您可以关闭此窗口。</h3>';
              setTimeout(() => window.close(), 2000);
            });
        </script>
        <div>
          正在处理认证...
        </div>
      `);
    });

    app.get('/auth/callback', (req, res) => {
      const { token: receivedToken } = req.query;
      if (receivedToken === token) {
        resolve(token);
        res.json({ success: true });
      } else {
        res.status(400).json({ error: '无效的 token' });
      }
    });

    const server = app.listen(port, () => {
      console.log(`认证服务器已启动...`);
    });

    // 设置超时自动关闭服务器
    setTimeout(() => {
      server.close();
      resolve(null);
    }, 60000);
  });
};

program
  .name('langhub')
  .description('LangHub CLI 工具')
  .version('1.0.0');

program
  .command('login')
  .description('登录 LangHub')
  .action(async () => {
    const token = config.get(TOKEN_KEY);
    if (token) {
      console.log('已登录，无需重复登录', token);
      process.exit(0);
    }
    // try {
    //   const port = process.env.PORT || 3000;
      
    //   // 启动认证服务器并等待 token
    //   const tokenPromise = createAuthServer();
      
    //   // 打开浏览器
    //   console.log('正在打开浏览器进行登录...');
    //   await open(`http://localhost:${port}/auth`);

    //   // 等待获取 token
    //   const token = await tokenPromise;
      
    //   if (!token) {
    //     throw new Error('登录超时');
    //   }

    //   // 保存 token 到配置文件
    //   config.set(TOKEN_KEY, token);
    //   console.log('登录成功！', token);
    //   process.exit(0);
    // } catch (error) {
    //   console.error('登录失败：', error.message);
    //   process.exit(1);
    // }
    try {
      const token = await getToken()
      config.set(TOKEN_KEY, token)
      console.log('登录成功！', token);
      process.exit(0);
    } catch (error) {
      console.error('登录失败：', error.message);
      process.exit(1);
    }
  });

// 添加获取 token 的命令
program
  .command('token')
  .description('显示当前登录 token')
  .action(() => {
    const token = config.get(TOKEN_KEY);
    if (token) {
      console.log('当前 token:', token);
    } else {
      console.log('未登录');
    }
  });

// logout
program
  .command('logout')
  .description('登出 LangHub')
  .action(() => {
    config.delete(TOKEN_KEY);
    console.log('登出成功', config.get(TOKEN_KEY));
  });

// 从 飞书 sheet 中获取数据，并保存为 json
program
  .command('fetch')
  .description('从 飞书 sheet 中获取数据，并保存为 json')
  .argument('[url]', '飞书 sheet url')
  .action(async (url) => {
    // https://xcm292ujry.feishu.cn/sheets/UiX5soav6hJHMDt7jkLcnrZNnJg
    console.log(url, 'url')
    if (!url) {
      console.error('参数不正确，请提供飞书 sheet url: langhub fetch https://xcm292ujry.feishu.cn/sheets/UiX5soav6hJHMDt7jkLcnrZNnJg');
      process.exit(1);
    }
    const token = config.get(TOKEN_KEY);
    const sheetToken = (() => {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const sheetsIndex = pathParts.indexOf('sheets');
        if (sheetsIndex !== -1 && sheetsIndex < pathParts.length - 1) {
          return pathParts[sheetsIndex + 1];
        }
        return null;
      } catch (error) {
        return null;
      }
    })();
    if (!sheetToken || !token) {
      console.error('参数不正确，获取 sheetId 或 token 失败', sheetId, token);
      process.exit(1);
    }
    console.log(sheetToken, token)
    const data = await getSheetsInfo(sheetToken)
    console.log(data)
    // test: 先请求第0个 sheet
    const sheet = data[0]
    const sheetData = await getSheetRange(sheetToken, {
      sheetId: sheet.sheetId,
      from: sheet.from,
      to: sheet.to,
    })
    saveAsJson(sheetData.data.valueRange.values.filter(row => row.some(Boolean)), __dirname)
  });

program.parse(); 