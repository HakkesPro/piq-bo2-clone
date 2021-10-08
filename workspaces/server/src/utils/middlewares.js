export const findJSESSIONID = (req, res, next) => {
  try {
    if (req.cookies.JSESSIONID && req.query['merchantId']) {
      const token = `${Object.keys(req.cookies).find(v => v === 'JSESSIONID')}=${req.cookies.JSESSIONID}`;
      res.locals.JSESSIONID = token
      res.locals.merchantId = req.query['merchantId']
      next()
    } else {
      throw new Error('No JSESSION id cookie or merchantId')
    }
  } catch (err) {
    console.log(`Error from findJSESSIONID: ${err.message}`)
    res.status(401).send({ msg: 'Invalid cookie', err: err.message })
  }
}
