import { Request as ExpressRequest } from "express";

export type Request<Body = null, Params = Record<string, string>> = ExpressRequest<Params, unknown, Body>;

export interface UserRequest<T = null> extends Request<T> {
  user?: string;
}

