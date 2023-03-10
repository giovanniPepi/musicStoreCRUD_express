#! /usr/bin/env node
var async = require("async");
var Instrument = require("./models/Instrument");
var Type = require("./models/Type");
var Brand = require("./models/Brand");
const dotenv = require("dotenv");
dotenv.config();

var mongoose = require("mongoose");
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.kuntt1d.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Store the created items in an array
const instruments = [];
const brands = [];
const types = [];

// Helper functions to store info to be created in the db
function instrumentCreate(
  name,
  brand,
  type,
  price,
  numberInStock,
  description,
  imageURL,
  cb
) {
  instrumentDetail = {
    name,
    brand,
    type,
    price,
    numberInStock,
    description,
    imageURL,
  };

  const instrument = new Instrument(instrumentDetail);

  instrument.save(function (err) {
    if (err) {
      console.log(err);
      cb(err, null);
      return;
    }
    console.log("New Instrument: " + instrument);
    instruments.push(instrument);
    cb(null, instrument);
  });
}

function brandCreate(name, description, cb) {
  const brand = new Brand({ name, description });

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Brand: " + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

function typeCreate(name, description, cb) {
  typeDetail = {
    name,
    description,
  };

  const type = new Type(typeDetail);
  type.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Type: " + type);
    types.push(type);
    cb(null, type);
  });
}

// This function will call our helper function to create the items
function createTypesBrands(cb) {
  async.series(
    [
      // First we create some instrument types
      function (callback) {
        typeCreate(
          "Bass guitar",
          "is the lowest-pitched member of the guitar family. It is a plucked string instrument similar in appearance and construction to an electric or acoustic guitar, but with a longer neck and scale length, and typically four to six strings or courses.",
          callback
        );
      },
      function (callback) {
        typeCreate(
          "Guitar",
          "The guitar is a fretted musical instrument that typically has six strings. It is usually held flat against the player's body and played by strumming or plucking the strings with the dominant hand, while simultaneously pressing selected strings against frets with the fingers of the opposite hand. A plectrum or individual finger picks may also be used to strike the strings. The sound of the guitar is projected either acoustically, by means of a resonant chamber on the instrument, or amplified by an electronic pickup and an amplifier. ",
          callback
        );
      },
      function (callback) {
        typeCreate(
          "Eletric Guitar",
          "An electric guitar is a guitar that requires external amplification in order to be heard at typical performance volumes, unlike a standard acoustic guitar. It uses one or more pickups to convert the vibration of its strings into electrical signals, which ultimately are reproduced as sound by loudspeakers. The sound is sometimes shaped or electronically altered to achieve different timbres or tonal qualities from that of an acoustic guitar via amplifier settings or knobs on the guitar.",
          callback
        );
      },
      function (callback) {
        typeCreate(
          "Musical Keyboard",
          "A musical keyboard is the set of adjacent depressible levers or keys on a musical instrument. Keyboards typically contain keys for playing the twelve notes of the Western musical scale, with a combination of larger, longer keys and smaller, shorter keys that repeats at the interval of an octave. Pressing a key on the keyboard makes the instrument produce sounds???either by mechanically striking a string or tine (acoustic and electric piano, clavichord), plucking a string (harpsichord), causing air to flow through a pipe organ, striking a bell (carillon), or, on electric and electronic keyboards, completing a circuit (Hammond organ, digital piano, synthesizer). Since the most commonly encountered keyboard instrument is the piano, the keyboard layout is often referred to as the piano keyboard. ",
          callback
        );
      },
      function (callback) {
        typeCreate(
          "Drums",
          "The drum is a member of the percussion group of musical instruments. In the Hornbostel-Sachs classification system, it is a membranophone. Drums consist of at least one membrane, called a drumhead or drum skin, that is stretched over a shell and struck, either directly with the player's hands, or with a percussion mallet, to produce sound. There is usually a resonant head on the underside of the drum. Other techniques have been used to cause drums to make sound, such as the thumb roll. Drums are the world's oldest and most ubiquitous musical instruments, and the basic design has remained virtually unchanged for thousands of years.",
          callback
        );
      },

      // From here and on, create brands
      function (callback) {
        brandCreate(
          "Fender",
          "The Fender Musical Instruments Corporation (FMIC, or simply Fender) is an American manufacturer of instruments and amplifiers. Fender produces acoustic guitars, bass amplifiers and public address equipment, however it is best known for its solid-body electric guitars and bass guitars, particularly the Stratocaster, Telecaster, Jaguar, Jazzmaster, Precision Bass, and the Jazz Bass. The company was founded in Fullerton, California by Clarence Leonidas 'Leo' Fender in 1946. Its headquarters are in Los Angeles, California. ",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Gibson",
          "Gibson Brands, Inc. (formerly Gibson Guitar Corporation) is an American manufacturer of guitars, other musical instruments, and professional audio equipment from Kalamazoo, Michigan, and now based in Nashville, Tennessee. The company was formerly known as Gibson Guitar Corporation and renamed Gibson Brands, Inc. on June 11, 2013",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Yamaha",
          "Yamaha Corporation (?????????????????????, Yamaha kabushiki gaisha, /??j??m????h????/; Japanese pronunciation: [jamaha]) is a Japanese multinational corporation and conglomerate with a very wide range of products and services. It is one of the constituents of Nikkei 225 and is the world's largest musical instrument manufacturing company. The former motorcycle division was established in 1955 as Yamaha Motor Co., Ltd., which started as an affiliated company but later became independent, although Yamaha Corporation is still a major shareholder.",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createInstrumentInstances(cb) {
  async.parallel(
    [
      // Now we create the instruments referencing to types/brands created before
      function (callback) {
        instrumentCreate(
          "TRBX 304",
          brands[2],
          types[0],
          3300,
          5,
          "The Yamaha TRBX304 bass guitar brings versatility, killer looks, and amazing performance together in a complete package. This sleek-looking, great-sounding bass gives you a comfortable Yamaha body shape and a fast-action bolt-on 5-piece maple/mahogany neck with a smooth-playing rosewood fingerboard. A pair of humbucking pickups deliver hum-free sound and the Performance EQ active circuit instantly optimizes your bass for different playing styles. Factor in the Yamaha TRBX304's solid hardware and thoughtful design, and you've got a bass that's ready to conquer any stage.",
          "https://firebasestorage.googleapis.com/v0/b/musicstorestorage.appspot.com/o/TRBX304MGR-large.jpg.auto.webp?alt=media&token=93a3a6bc-e174-4d12-b3f1-febad1e5ddec",
          callback
        );
      },
      function (callback) {
        instrumentCreate(
          "Player Stratocaster 3-color",
          brands[0],
          types[2],
          8999,
          3,
          "The inspiring sound of a Stratocaster is one of the foundations of Fender. Featuring this classic sound???bell-like high end, punchy mids and robust low end, combined with crystal-clear articulation???the fat-sounding Player Stratocaster HSH is packed with authentic Fender feel and style. It???s ready to serve your musical vision, it???s versatile enough to handle any style of music and it???s the perfect platform for creating your own sound.",
          "https://firebasestorage.googleapis.com/v0/b/musicstorestorage.appspot.com/o/Screenshot%20from%202023-02-17%2006-37-19.png?alt=media&token=172b00cf-f91b-4158-a310-a4c692c51cf2",
          callback
        );
      },
      function (callback) {
        instrumentCreate(
          "PSR Series PSR-F51",
          brands[2],
          types[3],
          699,
          15,
          "Our principal aim in designing the PSR-F51 was basic functionality that is both straightforward and user-friendly. As a result, we have developed a keyboard that anyone will find easy to operate and play. Using the intuitive panel, simply select a voice and rhythm to start playing. The PSR-F51's compact and lightweight design packs in a regular size keyboard together with 61 keys, 120 Voices and 114 Rhythms from all over the world. What???s more, this instrument is ideally suited to a wide range of different playing scenarios; not only is the PSR-F51 great for beginners and students, you can also power it with batteries for musical performance on the road. ",
          "https://firebasestorage.googleapis.com/v0/b/musicstorestorage.appspot.com/o/Screenshot%20from%202023-02-17%2006-45-21.png?alt=media&token=30ed7999-dbe2-4c3a-af33-03f97531e4b5",
          callback
        );
      },
      function (callback) {
        instrumentCreate(
          "GigMaker",
          brands[2],
          types[4],
          7799,
          4,
          "The new Yamaha GigMaker drum set is exactly what any beginner or intermediate player would love to play. This drum set utilizes all Yamaha hardware featuring hex tom ball joints with 5 new unique wrapped sparkle finishes.",
          "https://firebasestorage.googleapis.com/v0/b/musicstorestorage.appspot.com/o/Screenshot%20from%202023-02-17%2006-48-34.png?alt=media&token=afdaa514-8698-43ba-beb6-ee0e0080a103",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createTypesBrands, createInstrumentInstances],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Instruments" + instruments);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
