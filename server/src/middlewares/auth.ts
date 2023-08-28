import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


interface JwtUserPayload {
    id: string;
}

declare module 'express' {
    interface Request {
        user?: JwtUserPayload;
    }
}

export const verifyToken = async (req:Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUserPayload;
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
