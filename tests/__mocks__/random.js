const random = {
  int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
};

module.exports = random;
