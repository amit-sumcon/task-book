import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// Custom request type
export interface CustomRequest extends Request {
  user?: JwtPayload;
}
