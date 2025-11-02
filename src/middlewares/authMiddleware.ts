import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User"; // Make sure User model is in TS format too

interface DecodedToken extends JwtPayload {
  id: string;
}

// ✅ Extend Request type to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Not Authorized, no token" });
    }
  } catch (error: any) {
    return res
      .status(401)
      .json({ message: "Token Failed", error: error.message });
  }
};
