import products from '../models/products.js'

export const createProduct = async (req, res) => {
  try {
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      subtitle: req.body.subtitle,
      description: req.body.description,
      location: req.body.location,
      image: req.files?.image[0].path || '',
      images: req.files?.images.map(file => file.path),
      sell: req.body.sell,
      category: req.body.category
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getSellProducts = async (req, res) => {
  try {
    const result = await products.find({ status: 0 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const result = await products.find({ status: 0 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getProduct = async (req, res) => {
  try {
    const result = await products.find({ _id: req.params.id, status: 0 })
    res.status(200).json({ success: true, message: '', result: result[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editProduct = async (req, res) => {
  try {
    const image = req.files?.image ? req.files?.image[0].path : req.body.image
    const images = []

    if (req.files.images) {
      req.files.images.forEach((item) => {
        images.push(item.path)
      })
    }

    if (typeof req.body.images === 'string') {
      images.push(req.body.images)
    }
    if (typeof req.body.images === 'object') {
      req.body.images.forEach((item) => {
        if (item !== '' && item !== undefined && item !== null) {
          images.push(item)
        }
      })
    }
    const result = await products.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      subtitle: req.body.subtitle,
      location: req.body.location,
      description: req.body.description,
      image,
      images,
      sell: req.body.sell,
      category: req.body.category
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const result = await products.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      console.log(result)
      res.status(200).json({ success: true, message: '' })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
