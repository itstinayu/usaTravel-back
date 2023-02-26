import guides from '../models/guides.js'

export const createGuide = async (req, res) => {
  try {
    const result = await guides.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
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

export const getSellGuides = async (req, res) => {
  try {
    const result = await guides.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getAllGuides = async (req, res) => {
  try {
    const result = await guides.find({ status: 0 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getGuide = async (req, res) => {
  try {
    const result = await guides.find({ _id: req.params.id, status: 0 })
    res.status(200).json({ success: true, message: '', result: result[0] })
    console.log(result)
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editGuide = async (req, res) => {
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
    const result = await guides.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      subtitle: req.body.subtitle,
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

export const deleteGuide = async (req, res) => {
  try {
    const result = await guides.findByIdAndUpdate(req.params.id, {
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
