const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const DinosaurSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
    diet: { type: ObjectId, ref: 'Diet', required: true },
    period: { type: ObjectId, ref: 'Period', required: true },
    locations: [{ type: ObjectId, ref: 'Location' }],
    taxonomies: [{ type: ObjectId, ref: 'Taxonomy' }],
    url: { type: String, unique: true, required: true },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.locations;
        delete ret.taxonomies;
      },
    },
  },
);

DinosaurSchema.pre(['find', 'findOne'], function (next) {
  this.populate({
    path: 'diet',
    select: 'name url',
  });
  this.populate({
    path: 'period',
    select: 'name url',
  });
  this.populate({
    path: 'locations',
    select: 'id name url',
  });
  this.populate({
    path: 'taxonomies',
    select: 'id name url',
  });
  next(null);
});

const structure = (res) => {
  const sortSchema = ({ id, name, image, size, diet, period, url }) => ({
    id,
    name,
    image,
    size,
    diet,
    period,
    url,
  });
  const sortFullSchema = ({
    id,
    name,
    description,
    image,
    size,
    diet,
    period,
    locations,
    taxonomies,
    url,
  }) => ({
    id,
    name,
    description,
    image,
    size,
    diet,
    period,
    locations,
    taxonomies,
    url,
  });
  return Array.isArray(res) ? res.map(sortSchema) : sortFullSchema(res);
};

DinosaurSchema.static('structure', structure);
DinosaurSchema.static('findAndCount', async function ({ limit, skip }) {
  const [data, count] = await Promise.all([
    this.find().sort({ id: 1 }).limit(limit).skip(skip),
    this.find().countDocuments(),
  ]);
  const results = structure(data);
  return { results, count };
});

module.exports = mongoose.model('Dinosaur', DinosaurSchema);
