const errorHandler = (error, req, res, next) => {

  // console.log(error, "<<< Error Handler");
  
  switch (error.name) {
    case 'SequelizeValidationError':
    case 'SequelizeUniqueConstraintError':
      res.status(400).json({ message: error.errors[0].message });
      return;
    case 'Unauthorized':
      res.status(401).json({ message: error.message });
      return;
    case 'AuthenticationError':
      res.status(401).json({ message: error.message });
      return;
    case 'JsonWebTokenError':
      res.status(401).json({ message: "Invalid token" });
      return;
    case 'NotFound':
      res.status(404).json({ message: error.message });
      return;
    case 'BadRequest':
      res.status(400).json({ message: error.message });
      return;
    case 'Forbidden':
      res.status(403).json({ message: error.message });
      return;
    default:
      res.status(500).json({ message: error.message || "Internal Server Error" });
      return;
  }
}

module.exports = errorHandler;