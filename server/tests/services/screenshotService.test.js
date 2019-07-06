const should = require('should');
const screenshotService = require('../../api/services/screenshotService');

describe('screenshotService', () => {
  describe('.computeNames', computeNamesSuite);
});

function computeNamesSuite() {
  it('should return just the name of the screenshot in lowercase if no alternative names', () => {
    const screenshot = {
      gameCanonicalName: 'Age Of Empires II',
    };
    const names = screenshotService.compileScreenshotNames(screenshot);
    should(names).eql(['age of empires ii']);
  });
  it('should concat canonical name and alternative names in lowercase', () => {
    const screenshot = {
      gameCanonicalName: 'Age Of Empires II',
      alternativeNames: ['Age Of EMpires 2'],
    };
    const names = screenshotService.compileScreenshotNames(screenshot);
    should(names).eql(['age of empires ii', 'age of empires 2']);
  });
  it('should ignore whitespace', () => {
    const screenshot = {
      gameCanonicalName: '   Age Of Empires II',
      alternativeNames: ['   Age Of EMpires 2   ', '   ', ' '],
    };
    const names = screenshotService.compileScreenshotNames(screenshot);
    should(names).eql(['age of empires ii', 'age of empires 2']);
  });
  it('should remove duplicates', () => {
    const screenshot = {
      gameCanonicalName: '   Age Of Empires II',
      alternativeNames: [
        '   Age Of EMpires 2   ',
        '  age of emPires 2 ',
        'Age Of Empires II   ',
      ],
    };
    const names = screenshotService.compileScreenshotNames(screenshot);
    should(names).eql(['age of empires ii', 'age of empires 2']);
  });
  it('should remove duplicates', () => {
    const screenshot = {
      gameCanonicalName: 'Hologate',
      alternativeNames: ['hologate'],
    };
    const names = screenshotService.compileScreenshotNames(screenshot);
    should(names).eql(['hologate']);
  });
}
