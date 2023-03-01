import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import https from 'https'
import userRoute from './routes/users.js'
import productRoute from './routes/products.js'
import orderRoute from './routes/orders.js'
import guidesRoute from './routes/guides.js'
import './passport/passport.js'

mongoose.connect(process.env.DB_URL, { family: 4 })
mongoose.set('sanitizeFilter', true)

const app = express()

app.use(cors({
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168')) {
      callback(null, true)
    } else {
      callback(new Error(), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' })
})

app.use(express.json())

app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' })
})
app.use('/users', userRoute)
app.use('/products', productRoute)
app.use('/orders', orderRoute)
app.use('/guides', guidesRoute)

// app.get('/', (req, res) => {
//   res.status(200).json({ success: true, message: '' })
// })

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})

if (process.env.RENDER) {
  setInterval(() => {
    https.get(process.env.RENDER)
  }, 1000 * 60 * 50)
}
