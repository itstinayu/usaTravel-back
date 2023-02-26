import users from '../models/users.js'
import products from '../models/products.js'
import guides from '../models/guides.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    await users.create({
      account: req.body.account,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        phone: req.body.phone,
        cart: req.user.cart.length,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const logout = async (req, res) => {
  try {
    // filter過濾，符合 token !== req.token 的資料留著
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const extend = async (req, res) => {
  try {
    // 去資料庫的使用者jwt陣列中找出目前請求的jwt是陣列裡的第幾個
    const idx = req.user.tokens.findIndex(token => token === req.token)
    // 遷一個新的token
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 把新遷的token換掉
    req.user.tokens[idx] = token
    // 再保存新遷的token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const getUser = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.length,
        phone: req.body.phone,
        archive: req.user.archive,
        productArchive: req.user.productArchive,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const editCart = async (req, res) => {
  try {
    // 找購物車有沒有此商品
    const idx = req.user.cart.findIndex(cart => cart.p_id.toString() === req.body.p_id)
    if (idx > -1) {
      // 如果有，檢查新數量是多少
      const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
      if (quantity <= 0) {
        // 如果新數量小於 0，從購物車陣列移除
        req.user.cart.splice(idx, 1)
      } else {
        // 如果新數量大於 0，修改購物車陣列數量
        req.user.cart[idx].quantity = quantity
      }
    } else {
      // 如果購物車內沒有此商品，檢查商品是否存在
      const product = await products.findById(req.body.p_id)
      // 如果不存在，回應 404
      if (!product || !product.sell) {
        res.status(404).send({ success: false, message: '找不到' })
        return
      }
      // 如果存在，加入購物車陣列
      req.user.cart.push({
        p_id: req.body.p_id,
        quantity: parseInt(req.body.quantity)
      })
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.cart.reduce((total, current) => total + current.quantity, 0) })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.p_id')
    res.status(200).json({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const getAllUser = async (req, res) => {
  try {
    const result = await users.find({ status: 0 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const editArchive = async (req, res) => {
  try {
    const guide = await guides.findById(req.body.g_id)
    // 如果收藏不存在，回應 404
    if (!guide || !guide.sell) {
      res.status(404).send({ success: false, message: '找不到' })
      return
    }
    // 如果archive的index裡存在這個g_id
    const idx = req.user.archive.findIndex((item) => item.toString() === req.body.g_id)
    // 如果index > -1 表示已按收藏，就刪掉取消收藏
    if (idx > -1) {
      req.user.archive.splice(idx, 1)
    } else {
      // 如果index 沒有> -1 表示還沒收藏，就收藏
      req.user.archive.push(req.body.g_id)
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.archive })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
export const getArchive = async (req, res) => {
  try {
    const result = await guides.find({ _id: req.user.archive })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const editProductArchive = async (req, res) => {
  try {
    const product = await products.findById(req.body.p_id)
    // 如果商品不存在，回應 404
    if (!product || !product.sell) {
      res.status(404).send({ success: false, message: '找不到' })
      return
    }
    // 如果productArchive的index裡存在這個p_id
    const idx = req.user.productArchive.findIndex((item) => item.toString() === req.body.p_id)
    // 如果index > -1 表示已按收藏，就刪掉收藏
    if (idx > -1) {
      req.user.productArchive.splice(idx, 1)
    } else {
      // 如果index 沒有> -1 表示還沒收藏，就收藏
      req.user.productArchive.push(req.body.p_id)
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.productArchive })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
export const getProductArchive = async (req, res) => {
  try {
    const result = await products.find({ _id: req.user.productArchive })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
