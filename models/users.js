import { Schema, model, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const cartSchema = new Schema({
  p_id: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品']
  },
  quantity: {
    type: Number,
    required: [true, '缺少數量']
  }
})

const schema = new Schema({
  account: {
    type: String,
    required: [true, '缺少帳號'],
    minlength: [4, '帳號太短'],
    maxlength: [20, '帳號太長'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, '缺少信箱'],
    unique: true,
    validate: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    }
  },
  // JWT
  tokens: {
    type: [String],
    default: []
  },
  cart: {
    type: [cartSchema],
    default: []
  },
  archive: {
    type: [
      {
        type: ObjectId,
        ref: 'guides'
      }
    ],
    default: []
  },
  productArchive: {
    type: [
      {
        type: ObjectId,
        ref: 'products'
      }
    ],
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  phone: {
    type: String,
    required: true
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)
