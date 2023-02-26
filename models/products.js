import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少名稱']
  },
  price: {
    type: Number,
    min: [0, '價格錯誤'],
    required: [true, '缺少價格']
  },
  subtitle: {
    type: String,
    required: [true, '缺少副標']
  },
  description: {
    type: String,
    required: [true, '缺少說明']
  },
  image: {
    type: String,
    required: [true, '缺少圖片']
  },
  images: {
    type: [String],
    default: [],
    required: [true, '缺少多張圖片']
  },
  sell: {
    type: Boolean,
    required: [true, '缺少狀態']
  },
  category: {
    type: String,
    required: [true, '缺少分類'],
    enum: {
      values: ['景點', '戶外＆活動', '文化體驗', '展演活動', '旅遊通票', '行程', '其他'],
      message: '分類錯誤'
    }
  },
  location: {
    type: String,
    required: [true, '缺少狀態']
  },
  status: {
    type: Number,
    default: 0
  }
}, { versionKey: false })

export default model('products', schema)
