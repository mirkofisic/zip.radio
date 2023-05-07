import { ssrMiddleware } from 'quasar/wrappers'
import { Logger } from 'app/server/log/Logger'
import { RadiosDao } from 'app/server/dao/RadioDao'
import ErrorHandler from 'app/server/errors/ErrorHandler'
import { MongoClient } from 'mongodb'
import routes from '../../server/routes'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from 'cors'

const corsOptions = {
  origin: function (origin, callback) {
    // console.log('cros handler')
    callback(null, true)
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/developing-ssr/ssr-middlewares
export default ssrMiddleware(async ({ app /*, resolveUrlPath, publicPath, render */ }) => {
  // something to do with the server "app"
  console.log('ssrMiddleware', process.env.SESSION_COLLECTION, process.env.DB_URI)
  // setup cors

  app.use(cors(corsOptions))
  // setup database pool conection
  const mongoClient = await MongoClient.connect(process.env.DB_URI)
  // setup session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      name: process.env.SESSION_NAME,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoClient,
        dbName: process.env.DB_NAME,
        collectionName: process.env.SESSION_COLLECTION,
        ttl: 1 * 24 * 60 * 60, // = 1 day. Default
        autoRemove: 'interval',
        autoRemoveInterval: 60, // In minutes. Default
      }),
    }),
  )
  // inject client to DAOs
  Logger.injectDb(mongoClient)
  RadiosDao.injectDb(mongoClient)

  // set routes and error handler
  app.use(routes)
  ErrorHandler.setup(app)
})
