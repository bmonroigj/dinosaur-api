const models = require('../models');
const { baseUrl, message, collection } = require('../utils');

const getAll = async (req, res, next) => {
  try {
    const [, name] = req.path.split('/');
    const Model = models[name];
    const page = (req.query.page > 0 && req.query.page) || 1;
    const skip = page * collection.limit - collection.limit;
    const { results, count } = await Model.findAndCount({
      ...req.query,
      limit: collection.limit,
      skip,
    });

    req.payload = {
      page,
      count,
      results,
    };
  } catch (err) {
    res.status(500);
  }
  next();
};

const generatePageUrls = (req, res, next) => {
  const { results, count, page } = req.payload;
  const pages = Math.ceil(count / collection.limit);

  if (page > pages) {
    res.status(404).json({ error: message.noPage });
    return;
  }

  req.payload = {
    info: {
      count,
      pages,
      next:
        page >= pages
          ? null
          : `${baseUrl}${req.path}?page=${parseInt(page) + 1}`,
      prev:
        page < 2 ? null : `${baseUrl}${req.path}?page=${parseInt(page) - 1}`,
    },
    results,
  };
  next();
};

const validateArrayParams = (req, res, next) => {
  const { id } = req.params;
  // [1, 2, 3]
  if (/\[.+\]$/.test(id)) {
    try {
      req.params.id = JSON.parse(id);
      console.log(req.params.id);
      return next();
    } catch (e) {
      return res.status(500).json({ error: message.badArray });
    }
  }
  // 1, 2, 3
  if (id.includes(',') && !/\[|\]/.test(id) && id.length > 1) {
    req.params.id = id.split(',').map(Number);
    console.log(req.params.id);
    return next();
  }

  if (/\[|\]/.test(id)) {
    return res.status(500).json({ error: message.badArray });
  }

  next();
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [, name] = req.path.split('/');
    const Model = models[name];
    let data;
    if (Array.isArray(id)) {
      const docs = await Model.find({ id: { $in: id } }).exec();
      data = Model.structure(docs);
    } else {
      const doc = await Model.findOne({ id }).exec();
      data = Model.structure(doc);
    }
    if (data) {
      req.payload = data;
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500);
  }
  next();
};

const sendRes = (req, res) => {
  res.json(req.payload);
};

module.exports = () => ({
  find: [getAll, generatePageUrls, sendRes],
  findById: [validateArrayParams, getById, sendRes],
});
