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

server.delete('/api/likes', (req, res) => {
  const { userId, articleId } = req.query;
  const db = router.db;
  const likes = db.get('likes');

  const like = likes.find({ userId: parseInt(userId), articleId: parseInt(articleId) }).value();
  if (!like) {
    return res.status(404).send('Like not found');
  }

  likes.remove(like).write();

  res.sendStatus(204);
});

server.delete('/api/services', (req, res) => {
  const { id, userId } = req.query;
  const db = router.db;
  const services = db.get('services');

  const service = services.find({ id: parseInt(id), userId: parseInt(userId) }).value();
  if (!service) {
    return res.status(404).send('Like not found');
  }

  services.remove(service).write();

  res.sendStatus(204);
});


server.use(express.json());
// Use default router
server.use('/api', router);

// server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running')
});