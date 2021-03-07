const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    from: { type: Number, required: true },
    to: { type: Number, required: true },
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

PeriodSchema.virtual('dinosaurs', {
  ref: 'Dinosaur',
  localField: '_id',
  foreignField: 'period',
  justOne: false,
});

PeriodSchema.pre('findOne', function (next) {
  this.populate({
    path: 'dinosaurs',
    select: 'id name image size diet period url -_id',
  });
  next(null);
});

const structure = (res) => {
  const sortSchema = ({ id, name, from, to, url }) => ({
    id,
    name,
    from,
    to,
    url,
  });
  const sortFullSchema = ({
    id,
    name,
    description,
    from,
    to,
    dinosaurs,
    url,
  }) => ({
    id,
    name,
    description,
    from,
    to,
    dinosaurs,
    url,
  });
  return Array.isArray(res) ? res.map(sortSchema) : sortFullSchema(res);
};

PeriodSchema.static('structure', structure);
PeriodSchema.static('findAndCount', async function ({ limit, skip }) {
  const [data, count] = await Promise.all([
    this.find().sort({ id: 1 }).limit(limit).skip(skip),
    this.find().countDocuments(),
  ]);
  const results = structure(data);
  return { results, count };
});

module.exports = mongoose.model('Period', PeriodSchema);
