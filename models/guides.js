import { Schema, model } from 'mongoose'

const schema = new Schema({
  title: {
    type: String,
    required: [true, '缺少標題']
  },
  subtitle: {
    type: String,
    required: [true, '缺少副標']
  },
  description: {
    type: String,
    required: [true, '缺少內容']
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
      values: ['行前準備', '注意事項', '交通資訊', '景點介紹'],
      message: '分類錯誤'
    }
  },
  status: {
    type: Number,
    default: 0
  }
}, { versionKey: false })

export default model('guides', schema)
