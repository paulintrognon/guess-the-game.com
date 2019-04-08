const bluebird = require('bluebird');
const path = require('path');
const fs = require('fs');
const screenshotManager = require('../managers/screenshotManager');
const userManager = require('../managers/userManager');
const cloudinaryService = require('../services/cloudinaryService');
const tokenService = require('../services/tokenService');
const recaptchaService = require('../services/recaptchaService');
const logger = require('../../logger');

module.exports = {
  getfromId,
  getUnsolvedScreenshot,
  getLastAddedScreenshot,
  getPrevAndNext,
  removeOwnScreenshot,
  tryProposal,
  uploadScreenshot,
  addScreenshot,
  editScreenshot,
  rateScreenshot,
};

async function getfromId(req) {
  const userId = req.user.id;
  const screenshotId = req.body.id;
  const [res, ownRating] = await Promise.all([
    await screenshotManager.getFromId(screenshotId, userId),
    await userManager.getScreenshotRating({ screenshotId, userId }),
  ]);

  if (!res) {
    return bluebird.reject({
      status: 404,
      code: 'SCREENSHOT_NOT_FOUND',
      message: 'Screenshot inconnu.',
    });
  }

  const screenshot = {
    isSolved: false,
    isOwn: req.user.id === res.user.id,
    id: res.id,
    imageUrl: cloudinaryService.pathToUrl(res.imagePath),
    createdAt: res.createdAt,
    approvalStatus: res.approvalStatus,
    rating: res.rating,
    addedBy: res.user.username,
    stats: res.stats,
    ownRating,
  };
  if (res.solvedScreenshots && res.solvedScreenshots.length) {
    screenshot.isSolved = true;
    screenshot.solvedAt = res.solvedScreenshots[0].createdAt;
  }
  if (screenshot.isSolved || res.user.id === req.user.id) {
    screenshot.name = res.name;
    screenshot.year = res.year;
  }
  return screenshot;
}

async function getUnsolvedScreenshot(req) {
  const userId = req.user.id;
  let screenshot = await screenshotManager.getUnsolved({
    userId,
    exclude:
      // Si "exclude" n'est pas un tableau, on le transforme en tableau (rétrocompabilité)
      req.body.exclude && !req.body.exclude.join
        ? [req.body.exclude]
        : req.body.exclude,
  });

  if (!screenshot) {
    if (!req.body.exclude) {
      return notFoundReject();
    }
    // If we excluded a screenshot from the search, we try again without the exclusion
    screenshot = await screenshotManager.getUnsolved({ userId });
    if (!screenshot) {
      return notFoundReject();
    }
  }
  return getfromId({ ...req, body: { ...req.body, id: screenshot.id } });

  function notFoundReject() {
    return bluebird.reject({
      status: 404,
      code: 'UNSOLVED_SCREENSHOT_NOT_FOUND',
      message: 'No screenshot can be found for that user.',
    });
  }
}

async function getLastAddedScreenshot(req) {
  const screenshotId = await screenshotManager.getLastAdded();
  return getfromId({ ...req, body: { ...req.body, id: screenshotId } });
}

async function getPrevAndNext(req) {
  const { screenshotId } = req.body;
  return screenshotManager.getPrevAndNext({ screenshotId });
}

async function removeOwnScreenshot(req) {
  if (!req.user) {
    bluebird.reject({
      status: 401,
      code: 'MUST_BE_IDENTIFIED',
      message:
        'User must be identified in order to delete his own screenshots.',
    });
    return;
  }
  // We delete the screenshot
  await screenshotManager.deleteUserScreenshot({
    userId: req.user.id,
    screenshotId: req.body.screenshotId,
  });
}

async function tryProposal(req) {
  const { screenshotId, proposal } = req.body;
  const screenshot = await screenshotManager.testProposal(
    screenshotId,
    proposal
  );
  if (!screenshot) {
    return { correct: false };
  }

  let jwt;
  if (!req.user.id) {
    const user = await userManager.create({});
    jwt = tokenService.createUserToken(user);
    req.user = user;
  }

  await screenshotManager.markScreenshotAsResolved({
    screenshotId,
    userId: req.user.id,
  });
  return {
    correct: true,
    screenshotName: screenshot.name,
    year: screenshot.year,
    jwt,
  };
}

function uploadScreenshot(req) {
  const imageFile = req.files.file;
  const imageName = imageFile.name;
  const extention = path.extname(imageName);
  const localImageName = `${Date.now()}${extention}`;
  const localImagePath = getUploadedImageLocalPath(localImageName);

  // We move the uploaded file to the uploads folder
  imageFile.mv(localImagePath);

  // The file will be deleted in 24h
  setTimeout(() => {
    logger.info(`Deleting ${localImagePath}`);
    fs.unlinkSync(localImagePath);
  }, 3600 * 1000 * 24);

  const imagePath = `/api/uploads/${localImageName}`;

  return { imagePath, localImageName };
}

async function addScreenshot(req) {
  const { user } = req;
  if (!user) {
    return bluebird.reject({
      status: 401,
      code: 'MUST_BE_IDENTIFIED',
      message: 'User must be identified to add a new screenshot.',
    });
  }

  ['name', 'localImageName', 'recaptchaToken'].forEach(field => {
    if (!req.body[field]) {
      throw new Error(`User ${field} cannot be null`);
    }
  });

  // I'm not a robot (Google Recaptcha)
  const isTokenVerified = await recaptchaService.verifyToken(
    req.body.recaptchaToken
  );
  if (!isTokenVerified) {
    return bluebird.reject({
      code: 'RECAPTCHA_ERROR',
      message: 'Recaptcha challenge not successful.',
    });
  }

  const localImagePath = getUploadedImageLocalPath(req.body.localImageName);

  if (!fs.existsSync(localImagePath)) {
    throw new Error('Sorry, your image has been deleted, please re-upload it');
  }

  const imagePath = await cloudinaryService.uploadImage(localImagePath);

  const screenshot = {
    imagePath,
    gameCanonicalName: req.body.name,
    alternativeNames: req.body.alternativeNames,
    year: req.body.year,
    userId: user.id,
  };
  return screenshotManager.create(screenshot);
}

function editScreenshot(req) {
  const { user } = req;
  if (!user) {
    return bluebird.reject({
      status: 401,
      code: 'MUST_BE_IDENTIFIED',
      message: 'User must be identified to add a new screenshot.',
    });
  }

  ['name', 'id'].forEach(field => {
    if (!req.body.name) {
      throw new Error(`User ${field} cannot be null`);
    }
  });

  return screenshotManager.edit({
    id: req.body.id,
    user: req.user,
    data: {
      gameCanonicalName: req.body.name,
      alternativeNames: req.body.alternativeNames,
      year: req.body.year,
    },
  });
}

async function rateScreenshot(req) {
  const userId = req.user.id;
  const { screenshotId, rating } = req.body;
  let checkedRating = rating;
  if (rating > 10) {
    checkedRating = 10;
  } else if (rating < 0) {
    checkedRating = 0;
  }
  return screenshotManager.rate({
    screenshotId,
    userId,
    rating: checkedRating,
  });
}

function getUploadedImageLocalPath(imageName) {
  return `${__dirname}/../../uploads/${imageName}`;
}
