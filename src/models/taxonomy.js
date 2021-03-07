const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const TaxonomySchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    parent: { type: ObjectId, ref: 'Taxonomy' },
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

TaxonomySchema.virtual('dinosaurs', {
  ref: 'Dinosaur',
  localField: '_id',
  foreignField: 'taxonomies',
  justOne: false,
});

TaxonomySchema.pre('findOne', function (next) {
  this.populate({
    path: 'dinosaurs',
    select: 'id name image size diet period taxonomies url -_id',
  });
  this.populate({
    path: 'parent',
    select: 'name url',
  });
  next(null);
});

const structure = (res) => {
  const sortSchema = ({ id, name, url }) => ({ id, name, url });
  const sortFullSchema = ({
    id,
    name,
    description,
    parent,
    dinosaurs,
    url,
  }) => ({
    id,
    name,
    description,
    parent,
    dinosaurs,
    url,
  });
  return Array.isArray(res) ? res.map(sortSchema) : sortFullSchema(res);
};

TaxonomySchema.static('structure', structure);
TaxonomySchema.static('findAndCount', async function ({ limit, skip }) {
  const [data, count] = await Promise.all([
    this.find().sort({ id: 1 }).limit(limit).skip(skip),
    this.find().countDocuments(),
  ]);
  const results = structure(data);
  return { results, count };
});

module.exports = mongoose.model('Taxonomy', TaxonomySchema);
