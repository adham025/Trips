export function asyncHandler(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      err.statusCode = err.statusCode || 500; // Ensure a valid status code
      next(err); // Pass error to the global error handler
    });
  };
}

export const globalError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Default to 500 if undefined

  const response = {
    message: err.message || "Internal Server Error",
  };

  if (process.env.ENV === "DEV") {
    response.stack = err.stack; // Include stack trace in development mode
  }

  res.status(statusCode).json(response);
};
