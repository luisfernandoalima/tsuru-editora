import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const authValidate = (req: Request, res: Response, next: NextFunction) => {
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN_KEY;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Não autorizado", type: "error" });

  jwt.verify(token, ACCESS_TOKEN!, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Não autorizado", type: "error" });

    (req as any).user = decoded;

    next();
  });
};

export default authValidate;
