const stemmer = require('stemmer');
const doubleMetaphone = require('double-metaphone');

module.exports = {
  toPhonetik,
};

function toPhonetik(string) {
  const stemmed = string
    .split(' ')
    .map(stemmer)
    .join(' ');
  return doubleMetaphone(stemmed);
}
