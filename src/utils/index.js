const baseUrl = `https://dinosaurapi.herokuapp.com/api`;

const dinosaurs = ['Tyrannosaurus', 'Baryonyx', 'Velociraptor', 'Suchomimus'];
const random = (max) => Math.floor(Math.random() * Math.floor(max));

const message = {
  noPage: `The ${dinosaurs[random(dinosaurs.length)]} has been eated this page`,
  badArray: 'Bad... bad array :/',
};

const collection = {
  limit: 20,
};

module.exports = {
  baseUrl,
  message,
  collection,
};
