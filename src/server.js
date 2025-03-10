const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: '欢迎使用 Node.js API' });
});

app.get('/auth', (req, res) => {
  // 生成随机 token
  const token = Math.random().toString(36).substring(2);
  
  res.send(`
    <script>
      // 将 token 通过查询参数传给回调地址
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
  const { token } = req.query;
  if (token) {
    // 保存 token 到全局变量，供 CLI 程序获取
    global.authToken = token;
    res.json({ success: true });
  } else {
    res.status(400).json({ error: '无效的 token' });
  }
});

app.post('/auth/token', (req, res) => {
  const { token } = req.body;
  // 这里可以验证 token
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 