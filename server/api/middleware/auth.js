import jwt from "jsonwebtoken";

const authValidate = (req, res, next) => {
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN_KEY;

  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Não autorizado",
      type: "error",
    });
  }

  jwt.verify(token, ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Não autorizado",
        type: "error",
      });
    }

    req.user = decoded;

    next();
  });
};

export default authValidate;
