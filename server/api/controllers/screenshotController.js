const bluebird = require('bluebird');
const path = require('path');
const fs = require('fs');
const screenshotManager = require('../managers/screenshotManager');
const userManager = require('../managers/userManager');
const cloudinaryService = require('../services/cloudinaryService');
const tokenService = require('../services/tokenService');
const logger = require('../../logger');

module.exports = {
  getfromId,
  getUnsolvedScreenshot,
  getLastPostedScreenshot,
  removeOwnScreenshot,
  tryProposal,
  uploadScreenshot,
  addScreenshot,
};

async function getfromId(req) {
  const res = await screenshotManager.getFromId(req.body.id, req.user.id);

  const screenshot = {
    isSolved: false,
    isOwn: req.user.id === res.user.id,
    id: res.id,
    imageUrl: cloudinaryService.pathToUrl(res.imagePath),
    createdAt: res.createdAt,
    postedBy: res.user.username,
    stats: res.stats,
  };
  if (res.screenshotFounds && res.screenshotFounds.length) {
    screenshot.isSolved = true;
    screenshot.solvedAt = res.screenshotFounds[0].createdAt;
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
    exclude: req.body.exclude,
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

async function getLastPostedScreenshot(req) {
  const screenshotId = await screenshotManager.getLastPosted();
  return getfromId({ ...req, body: { ...req.body, id: screenshotId } });
}

async function removeOwnScreenshot(req) {
  if (!req.user) {
    return bluebird.reject({
      status: 400,
      code: 'MUST_BE_IDENTIFIED',
      message:
        'User must be identified in order to delete his own screenshots.',
    });
  }
  const result = await screenshotManager.deleteUserScreenshot({
    userId: req.user.id,
    screenshotId: req.body.screenshotId,
  });
  if (result === null) {
    return bluebird.reject({
      status: 404,
      code: 'SCREENSHOT_TO_DELETE_NOT_FOUND',
      message:
        'The screenshot to delete has not been found. Maybe the user has not posted that screenshot?',
    });
  }
  return { deleted: Boolean(result) };
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
  ['name', 'localImageName'].forEach(field => {
    if (!req.body[field]) {
      throw new Error(`User ${field} cannot be null`);
    }
  });

  const localImagePath = getUploadedImageLocalPath(req.body.localImageName);

  if (!fs.existsSync(localImagePath)) {
    throw new Error('Sorry, your image has been deleted, please re-upload it');
  }

  const imagePath = await cloudinaryService.uploadImage(localImagePath);

  return screenshotManager.create({
    imagePath,
    gameCanonicalName: req.body.name,
    alternativeNames: req.body.alternativeNames,
    year: req.body.year,
    userId: req.user.id,
  });
}

function getUploadedImageLocalPath(imageName) {
  return `${__dirname}/../../uploads/${imageName}`;
}
