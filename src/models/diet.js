const mongoose = require('mongoose');

const DietSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
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
      },
    },
  },
);

DietSchema.virtual('dinosaurs', {
  ref: 'Dinosaur',
  localField: '_id',
  foreignField: 'diet',
  justOne: false,
});

DietSchema.pre('findOne', function (next) {
  this.populate({
    path: 'dinosaurs',
    select: 'id name image size diet period url -_id',
  });
  next(null);
});

const structure = (res) => {
  const sortSchema = ({ id, name, url }) => ({ id, name, url });
  const sortFullSchema = ({ id, name, description, dinosaurs, url }) => ({
    id,
    name,
    description,
    dinosaurs,
    url,
  });
  return Array.isArray(res) ? res.map(sortSchema) : sortFullSchema(res);
};

DietSchema.static('structure', structure);
DietSchema.static('findAndCount', async function ({ limit, skip }) {
  const [data, count] = await Promise.all([
    this.find().sort({ id: 1 }).limit(limit).skip(skip),
    this.find().countDocuments(),
  ]);
  const results = structure(data);
  return { results, count };
});

module.exports = mongoose.model('Diet', DietSchema);
