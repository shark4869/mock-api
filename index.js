const jsonServer = require('json-server');
// const server = jsonServer.create();
const express = require('express');
const bodyParser = require('body-parser');

const server = express();

const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();


// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(bodyParser.json());
// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
});
server.post('/api/login', (req, res) => {
    console.log('check req:',req.body);
  const { username, password } =  req.body;
  const account = router.db.get('accounts').find({ username, password }).value();
  if (account) {
    res.json({ message: 'Đăng nhập thành công', account });
  } else {
    res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
  }
});
server.patch('/api/articles/:id/like', (req, res) => {
  const id = req.params.id;
  const article = router.db.get('articles').find({ id: parseInt(id) }).value();

  if (!article) {
    res.status(404).json({ error: 'Article not found' });
  } else {
    const liked = !article.liked;
    let likes = article.likes;
    if (liked) {
      likes += 1;
    } else {
      likes -= 1;
    }
    router.db.get('articles').find({ id: parseInt(id) }).assign({ liked, likes }).write();
    res.json({ liked, likes });
  }
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
// server.use(jsonServer.bodyParser);

// server.use((req, res, next) => {
//   if (req.method === 'POST') {
//     req.body.createdAt = Date.now(),
//     req.body.updateAt = Date.now()
//   }
//   next()
// })

server.use(express.json());
// Use default router
server.use('/api', router);

// server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running')
});