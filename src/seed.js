require('dotenv').config();
const mongoose = require('mongoose');
const debug = require('debug')('dinosaur-api:seed');
const models = require('./models');
const { baseUrl } = require('./utils');

// Connect to MongoDB database
const db = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/dinosaur-db';
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
// Listen for MongoDB connection errors
mongoose.connection.on('error', (err) =>
  debug(`MongoDB connection error: ${err.message}`),
);

async function dropAll() {
  await models.dinosaur.deleteMany({});
  await models.period.deleteMany({});
  await models.diet.deleteMany({});
  await models.location.deleteMany({});
  await models.taxonomy.deleteMany({});
}

async function addTaxonomies() {
  const taxonomies = [
    {
      id: 1,
      name: 'Dinosauria',
      description:
        'The first dinosaurs were small, agile animals that ran on two legs—they would have looked like the Marasuchus, an early, dinosaurlike archosaur. During the late Triassic Period, early dinosaurs evolved in different ways. Most became specialized for eating plants, but some were to become dedicated hunters.',
      url: `${baseUrl}/api/taxonomy/1`,
    },
    {
      id: 2,
      name: 'Saurischia',
      description:
        'Saurischian (“lizard hipped”) refers to the typical saurischians that had hip bones like those of lizards. This group included the sauropodomorph plant-eaters. It may also have included the meat-eating theropods, but some scientists think that theropods are more closely related to ornithischians.',
      parent: 1,
      url: `${baseUrl}/api/taxonomy/2`,
    },
    {
      id: 3,
      name: 'Ornithischia',
      description:
        'This group is made up of beaked plant-eaters with relatively short necks. The name means “bird hipped,” because their hip bones resembled those of birds (even though birds were small saurischians and so not closely related).',
      parent: 1,
      url: `${baseUrl}/api/taxonomy/3`,
    },
    {
      id: 4,
      name: 'Sauropodomorpha',
      description:
        'The sauropodomorphs are named after the sauropods—giant, long-necked plant-eaters that did not have beaks and walked on four legs.',
      parent: 2,
      url: `${baseUrl}/api/taxonomy/4`,
    },
    {
      id: 5,
      name: 'Theropoda',
      description:
        'Theropods were nearly all meat-eaters that walked on two legs. Some were huge, powerful hunters, but the theropods also include birds.',
      parent: 2,
      url: `${baseUrl}/api/taxonomy/5`,
    },
    {
      id: 6,
      name: 'Marginocephalia',
      description:
        'This group of plant-eaters had heads that sported bony frills. s(Marginocephalian means “fringed head.”) Some walked on two legs, some on four. They were common dinosaurs in the Cretaceous and included the well-known Triceratops.',
      parent: 3,
      url: `${baseUrl}/api/taxonomy/6`,
    },
    {
      id: 7,
      name: 'Ornithopoda',
      description:
        'The ornithopods were a group of beaked plant-eaters that mostly walked on two feet, but the biggest ones supported some of their weight on their hands.',
      parent: 3,
      url: `${baseUrl}/api/taxonomy/7`,
    },
    {
      id: 8,
      name: 'Thyreophora',
      description:
        'Also called armored dinosaurs, members of this group of plant-eaters were large, walked on four feet, and had armor plates and spikes that protected them from attack. Some of these dinosaurs even had armored eyelids!',
      parent: 3,
      url: `${baseUrl}/api/taxonomy/8`,
    },
    {
      id: 9,
      name: 'Ceratopsia',
      description:
        'Most ceratopsians had horned heads and big, bony frills extending from the back of their skulls. They were plant-eaters with hooked, parrotlike beaks.',
      parent: 6,
      url: `${baseUrl}/api/taxonomy/9`,
    },
    {
      id: 10,
      name: 'Pachycephalosauria',
      description:
        'These dinosaurs had very thick skulls. They walked on two legs and probably ate a variety of plant and animal food.',
      parent: 6,
      url: `${baseUrl}/api/taxonomy/10`,
    },
    {
      id: 11,
      name: 'Stegosauria',
      description:
        'These beaked, plant-eating dinosaurs had rows of tall plates and spikes extending down their backs and tails. They all walked on four legs.',
      parent: 8,
      url: `${baseUrl}/api/taxonomy/11`,
    },
    {
      id: 12,
      name: 'Ankylosauria',
      description:
        'Sometimes called tank dinosaurs, these plant-eating heavyweights had thick body armor for defense against large theropod predators.',
      parent: 8,
      url: `${baseUrl}/api/taxonomy/12`,
    },
  ];

  for (const taxonomy of taxonomies) {
    let parentId = undefined;
    if (taxonomy.parent) {
      const parentDoc = await models.taxonomy.findOne({ id: taxonomy.parent });
      parentId = parentDoc._id;
    }
    await models.taxonomy.create({
      id: taxonomy.id,
      name: taxonomy.name,
      description: taxonomy.description,
      parent: parentId,
      url: taxonomy.url,
    });
  }
}

async function addPeriods() {
  await models.period.create([
    {
      id: 1,
      name: 'Triassic',
      description:
        'Reptiles ruled the world in the Triassic. They gave rise to the first dinosaurs, the first flying reptiles, and the first true mammals, which were little bigger than shrews. Crocodiles and turtles appeared, and the giant aquatic reptiles cruised the ocean.',
      from: 251,
      to: 200,
      url: `${baseUrl}/api/period/1`,
    },
    {
      id: 2,
      name: 'Jurassic',
      description:
        'The Jurassic saw the rise of the colossal plant-eating sauropod dinosaurs such as Brachiosaurus, as well as the giant meat-eating theropods that preyed on them. Smaller theropods evolved into the first birds. Deserts shrank and forests of conifer trees, monkey puzzles, and ferns spread across the land.',
      from: 200,
      to: 145,
      url: `${baseUrl}/api/period/2`,
    },
    {
      id: 3,
      name: 'Cretaceous',
      description:
        'Dinosaurs of the Cretaceous included Tyrannosaurus and the plant-eating ceratopsians, which had distinctive horned faces, neck frills, and beaks. All dinosaurs except for a few birds perished in a mass extinction at the end of the period, along with many other prehistoric animals.',
      from: 145,
      to: 66,
      url: `${baseUrl}/api/period/3`,
    },
  ]);
}

async function addDiets() {
  await models.diet.create([
    {
      id: 1,
      name: 'Herbivore',
      description: 'An animal that eats plants.',
      url: `${baseUrl}/api/diet/1`,
    },
    {
      id: 2,
      name: 'Carnivore',
      description: 'An animal that eats meat.',
      url: `${baseUrl}/api/diet/2`,
    },
    {
      id: 3,
      name: 'Omnivore',
      description:
        'An animal that eats both plant and animal food. Examples include pigs, rats, and human beings.',
      url: `${baseUrl}/api/diet/3`,
    },
    {
      id: 4,
      name: 'Unknow',
      description: 'Unknow diet',
      url: `${baseUrl}/api/diet/4`,
    },
  ]);
}

async function addLocations() {
  await models.location.create([
    {
      id: 1,
      name: 'United States',
      // "image": "${baseUrl}/api/location/image/1.jpg",
      url: `${baseUrl}/api/location/1`,
    },
    {
      id: 2,
      name: 'Canada',
      // "image": "${baseUrl}/api/location/image/2.jpg",
      url: `${baseUrl}/api/location/2`,
    },
    {
      id: 3,
      name: 'Portugal',
      // "image": "${baseUrl}/api/location/image/3.jpg",
      url: `${baseUrl}/api/location/3`,
    },
    {
      id: 4,
      name: 'Mongolia',
      // "image": "${baseUrl}/api/location/image/4.jpg",
      url: `${baseUrl}/api/location/4`,
    },
    {
      id: 5,
      name: 'British Isles',
      // "image": "${baseUrl}/api/location/image/5.jpg",
      url: `${baseUrl}/api/location/5`,
    },
    {
      id: 6,
      name: 'Spain',
      // "image": "${baseUrl}/api/location/image/6.jpg",
      url: `${baseUrl}/api/location/6`,
    },
    {
      id: 7,
      name: 'Africa',
      // "image": "${baseUrl}/api/location/image/7.jpg",
      url: `${baseUrl}/api/location/7`,
    },
  ]);
}

async function addDinosaurs() {
  const dinosaurs = [
    {
      id: 1,
      name: 'Tyrannosaurus',
      description:
        'As long as a bus and twice the weight of an elephant, Tyrannosaurus was undoubtedly the top predator in its environment. Deep holes in the bones of prey such as Triceratops and Edmontosaurus show that Tyrannosaurus used its immensely powerful jaws and bone-piercing teeth as its main weapons. Small victims were probably shaken apart; larger animals were crippled by horrible injuries. Holding the body down with a foot, Tyrannosaurus used its huge neck muscles to tear off mouthfuls of flesh and bone with its mouth, before swallowing it all.',
      image: `${baseUrl}/api/dinosaur/image/1.jpg`,
      diet: 2,
      size: '39 ft (12 m)',
      locations: [1, 2],
      period: 3,
      taxonomies: [1, 2, 5],
      url: `${baseUrl}/api/dinosaur/1`,
    },
    {
      id: 2,
      name: 'Triceratops',
      description:
        'Triceratops’s neck was probably quite flexible, helping it to feed not only on tree leaves but also on low-growing plants. Its powerful parrotlike beak helped it pluck tough forest vegetation, such as palms, ferns, and cycads. Its teeth were like scissors—shredding and snipping the plants.',
      image: `${baseUrl}/api/dinosaur/image/2.jpg`,
      diet: 1,
      size: '30 ft (9 m)',
      locations: [1, 2],
      period: 3,
      taxonomies: [1, 3, 6, 9],
      url: `${baseUrl}/api/dinosaur/2`,
    },
    {
      id: 3,
      name: 'Stegosaurus',
      description:
        'Large, diamond-shaped plates ran along the back of this famous dinosaur. Although the plates would have made Stegosaurus look bigger and more fearsome, they were no good as armor. It’s more likely they evolved for use in social or courtship displays. Stegosaurus had a toothless beak made of a hornlike substance. At the back of its mouth were rows of teeth that it used to crush leaves, chewing them to a pulp with simple up-and-down movements.',
      image: `${baseUrl}/api/dinosaur/image/3.jpg`,
      diet: 1,
      size: '30 ft (9 m)',
      locations: [1, 3],
      period: 2,
      taxonomies: [1, 3, 8, 11],
      url: `${baseUrl}/api/dinosaur/3`,
    },
    {
      id: 4,
      name: 'Ankylosaurus',
      description:
        'Ankylosaurus was the largest ankylosaur ever. Hundreds of armor plates studded its thick skin, and small armor plates even covered its eyelids. The armor formed from bony plates called osteoderms that grew within the skin, much like the armor plating of a crocodile’s skin. Ankylosaurus was also equipped with a huge tail club that it could swing at attackers with bone-shattering force.',
      image: `${baseUrl}/api/dinosaur/image/4.jpg`,
      diet: 1,
      size: '20 ft (6 m)',
      locations: [1, 2],
      period: 3,
      taxonomies: [1, 3, 8, 12],
      url: `${baseUrl}/api/dinosaur/4`,
    },
    {
      id: 5,
      name: 'Brachiosaurus',
      description:
        'One of the largest sauropods, Brachiosaurus weighed an incredible 33–55 tons (30–50 metric tons)—nearly 12 times more than an African elephant. Brachiosaurus’s long neck helped it to feed at heights of more than 50 ft (15 m), which is twice as high as any giraffe can reach.',
      image: `${baseUrl}/api/dinosaur/image/5.jpg`,
      diet: 1,
      size: '75 ft (23 m)',
      locations: [1],
      period: 2,
      taxonomies: [1, 2, 4],
      url: `${baseUrl}/api/dinosaur/5`,
    },
    {
      id: 6,
      name: 'Velociraptor',
      description:
        'Velociraptor played a starring role in Jurassic Park, where it was shown as twice its actual size. In reality it was a slender, feathered animal about the size of a wolf. The most spectacular fossil of Velociraptor is a complete skeleton locked in combat with a Protoceratops. Velociraptor had huge, flickable toe claws and long, clawed arms that unfolded like wings to grapple prey. Although no feathered fossils of Velociraptor have been found, its arm bones have quill nodes—small bumps to which long feathers were anchored.',
      image: `${baseUrl}/api/dinosaur/image/6.jpg`,
      diet: 2,
      size: '61⁄2 ft (2 m)',
      locations: [4],
      period: 3,
      taxonomies: [1, 2, 5],
      url: `${baseUrl}/api/dinosaur/6`,
    },
    {
      id: 7,
      name: 'Baryonyx',
      description:
        'Remains of partly digested dinosaurs were found in Baryonyx’s fossilized stomach, indicating that it ate land animals as well as fish. It had a very long, low skull, and its jaws had 96 pointed teeth—twice as many as other members of its family. Baryonyx may have had a ridge on its back and a small crest on its snout. Baryonyx means “heavy claw,” referring to its huge, hooklike thumb claws, which it may have used to spear fish, as grizzly bears do today.',
      image: `${baseUrl}/api/dinosaur/image/7.jpg`,
      diet: 2,
      size: '30 ft (9 m)',
      locations: [3, 5, 6],
      period: 3,
      taxonomies: [1, 2, 5],
      url: `${baseUrl}/api/dinosaur/7`,
    },
    {
      id: 8,
      name: 'Suchomimus',
      description:
        'Suchomimus, meaning “crocodile mimic,” got its name from its crocodile-like snout and sharp teeth, which it used to catch fish and other slippery prey. Compared to other meat eaters, it had long and powerful arms—perhaps it used them to reach into the water to grasp prey. A bladelike sail ran along its back and perhaps its tail. Suchomimus had more than 100 teeth along its jaw that slanted backward and were pointed like the prongs of a rake. Another set of longer teeth lay clustered at the tip of its snout.',
      image: `${baseUrl}/api/dinosaur/image/8.jpg`,
      diet: 2,
      size: '30 ft (9 m)',
      locations: [7],
      period: 3,
      taxonomies: [1, 2, 5],
      url: `${baseUrl}/api/dinosaur/8`,
    },
    {
      id: 9,
      name: 'Pachycephalosaurus',
      description:
        'By comparing Pachycephalosaurus’s few fossils with those of its relatives, scientists figure that this dinosaur was about as long as a station wagon. It probably had a bulky body but the long, slender hind legs of a fast runner. Its small teeth suggest a diet of easily digested plants or, perhaps, a mixture of plants and animal foods such as eggs.',
      image: `${baseUrl}/api/dinosaur/image/9.jpg`,
      diet: 1,
      size: '15 ft (4.5 m)',
      locations: [1, 2],
      period: 3,
      taxonomies: [1, 3, 6, 10],
      url: `${baseUrl}/api/dinosaur/9`,
    },
    {
      id: 10,
      name: 'Parasaurolophus',
      description:
        'This creature’s head had a long crest containing hollow tubes. Perhaps Parasaurolophus tooted air out of the crest to make trumpetlike sounds to communicate with herd members. Its heavy, muscular build and wide shoulders may have helped it push through dense undergrowth in woodlands.',
      image: `${baseUrl}/api/dinosaur/image/10.jpg`,
      diet: 1,
      size: '30 ft (9 m)',
      locations: [1, 2],
      period: 3,
      taxonomies: [1, 3, 7],
      url: `${baseUrl}/api/dinosaur/10`,
    },
    {
      id: 11,
      name: 'Edmontosaurus',
      description:
        'Edmontosaurus is named after Edmonton town in Alberta, Canada, where the first fossils were found in 1917. One of the largest hadrosaurs, it weighed up to 41⁄2 tons (4 metric tons). Hollow areas around its nostrils may have contained inflatable sacs that Edmontosaurus could expand like balloons and perhaps use to make sounds.',
      image: `${baseUrl}/api/dinosaur/image/11.jpg`,
      diet: 1,
      size: '43 ft (13 m)',
      locations: [1, 2],
      period: 3,
      taxonomies: [1, 3, 7],
      url: `${baseUrl}/api/dinosaur/11`,
    },
    {
      id: 12,
      name: 'Gallimimus',
      description:
        'One of the best known of all ornithomimids is Gallimimus (“chicken mimic”). It was the largest ornithomimid, three times as tall as a man and, at 1,000 lb (450 kg) in weight, a lot heavier than any chicken. Gallimimus was the fastest sprinter of any dinosaur and could have outrun a racehorse. It had a birdlike skull, with a brain about the size of a golf ball (only slightly larger than an ostrich’s). Its long, toothless beak was used to pick up leaves, seeds, insects, and small mammals. Gallimimus had wide eye sockets with eyes facing sideways. This helped it spot enemies in almost any direction. Inside each eyeball was a supporting ring of small bony plates. Modern birds still have this feature.',
      image: `${baseUrl}/api/dinosaur/image/12.jpg`,
      diet: 3,
      size: '20 ft (6 m)',
      locations: [4],
      period: 3,
      taxonomies: [1, 2, 5],
      url: `${baseUrl}/api/dinosaur/12`,
    },
  ];

  for (const dinosaur of dinosaurs) {
    const locationIds = [];
    for (const location of dinosaur.locations) {
      const locationDoc = await models.location
        .findOne({ id: location })
        .exec();
      locationIds.push(locationDoc._id);
    }
    const taxonomyIds = [];
    for (const taxonomy of dinosaur.taxonomies) {
      const taxonomyDoc = await models.taxonomy
        .findOne({ id: taxonomy })
        .exec();
      taxonomyIds.push(taxonomyDoc._id);
    }
    const period = await models.period.findOne({ id: dinosaur.period }).exec();
    const diet = await models.diet.findOne({ id: dinosaur.diet }).exec();
    if (diet) {
      await models.dinosaur.create({
        id: dinosaur.id,
        name: dinosaur.name,
        description: dinosaur.description,
        image: dinosaur.image,
        size: dinosaur.size,
        diet: diet._id,
        period: period._id,
        locations: locationIds,
        taxonomies: taxonomyIds,
        url: dinosaur.url,
      });
    }
  }
}

async function seed() {
  await dropAll();
  await addPeriods();
  await addDiets();
  await addLocations();
  await addTaxonomies();
  await addDinosaurs();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
