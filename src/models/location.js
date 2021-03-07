const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true },
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

LocationSchema.virtual('dinosaurs', {
  ref: 'Dinosaur',
  localField: '_id',
  foreignField: 'locations',
  justOne: false,
});

LocationSchema.pre('findOne', function (next) {
  this.populate({
    path: 'dinosaurs',
    select: 'id name image size diet period locations url -_id',
  });
  next(null);
});

const structure = (res) => {
  const sortSchema = ({ id, name, url }) => ({ id, name, url });
  const sortFullSchema = ({ id, name, dinosaurs, url }) => ({
    id,
    name,
    dinosaurs,
    url,
  });
  return Array.isArray(res) ? res.map(sortSchema) : sortFullSchema(res);
};

LocationSchema.static('structure', structure);
LocationSchema.static('findAndCount', async function ({ limit, skip }) {
  const [data, count] = await Promise.all([
    this.find().sort({ id: 1 }).limit(limit).skip(skip),
    this.find().countDocuments(),
  ]);
  const results = structure(data);
  return { results, count };
});

module.exports = mongoose.model('Location', LocationSchema);
