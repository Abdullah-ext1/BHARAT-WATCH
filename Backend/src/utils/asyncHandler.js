const asyncHandler = (requestHandler) => {
  return async(req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => console.log(error));
  }
}

export {asyncHandler};