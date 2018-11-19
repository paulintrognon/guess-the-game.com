const should = require('should');
const phonetikService = require('../../api/services/phonetiksService');

describe('phonetikService', () => {
  describe('.toPhonetik', toPhonetikSuite);
});

function toPhonetikSuite() {
  const positiveTests = [
    ['Age Of Empires', 'Age of empire'],
    ['Age Of Empires 2', 'Age of empire 2'],
    ['Age Of Empires 2 : HD Edition', 'Age Of Empires 2 HD-Edition'],
    ['Need for speed', 'Nid for spid'],
    ['Grand Theft Auto', 'Grand Teft Auto'],
  ];

  positiveTests.forEach(test => {
    it(`should ${test[0]} == ${test[1]}`, () => {
      const a = phonetikService.toPhonetik(test[0]);
      const b = phonetikService.toPhonetik(test[1]);
      const isSolved = a.some(stemmedA =>
        b.some(stemmedB => stemmedA === stemmedB)
      );
      should(isSolved).equal(true, `${a} VS ${b}`);
    });
  });

  const negativeTests = [
    ['Age Of Empires', 'Need For Speed'],
    ['Age Of Empires', 'Age of Mythology'],
    ['Need for speed', 'need for weed'],
  ];

  negativeTests.forEach(test => {
    it(`should ${test[0]} != ${test[1]}`, () => {
      const a = phonetikService.toPhonetik(test[0]);
      const b = phonetikService.toPhonetik(test[1]);
      const isSolved = a.some(stemmedA =>
        b.some(stemmedB => stemmedA === stemmedB)
      );
      should(isSolved).equal(false, `${a} VS ${b}`);
    });
  });
}
