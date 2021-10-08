import express from 'express'
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  try {
    res.render('index', { title: 'Express' });
  } catch (err) {
    res.status(401).send({ err });
  }
});

export default router
