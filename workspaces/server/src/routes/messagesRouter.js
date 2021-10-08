import e from 'express';
import express from 'express';
import { fetchMessages } from '../service/service.js'
import { formatMessages } from '../utils/messages.js'

const router = express.Router();


/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const messages = await fetchMessages(req.query.merchantId, res.locals.JSESSIONID)
    console.log(req.query)
    const formattedMessages = formatMessages(
      messages.result, 
      req.query.start, 
      req.query.end,
      req.query.searchInput,
      )
    res.send(formattedMessages);
  } catch (err) {
    console.log('Error from messagesRouter.js')
    console.log(err)
    res.status(401).send({ err: err.message });
  } 
});

export default router
