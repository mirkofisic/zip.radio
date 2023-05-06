import cors from 'cors'
import router from './router'
router.use(cors())
router.use(function (req, res, next) {
  console.log('allow origin')
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
export default router
