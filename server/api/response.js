const logger = require('../logger');

module.exports = responseMiddleware;

function responseMiddleware(promise, req, res, next) {
  if (promise instanceof Error) {
    handleError(promise);
    return;
  }

  if (!promise.then) {
    handleSuccess(promise);
    next();
    return;
  }

  promise.then(handleSuccess, handleError).catch(next);

  function handleSuccess(result) {
    res.status(200).send({
      status: 200,
      result,
    });
  }

  function handleError(error) {
    logger.error(error);
    const status = error.status || 400;
    res.status(status).send({
      status,
      error: true,
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors,
      payload: error.payload,
    });
  }
}
