import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/userSchema.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const signin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please! Enter Email and Password", 400));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    const ismatch = await user.matchPassword(password);

    if (!ismatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const { accessToken, refreshToken } = user.getSignedToken();

    // send refreshtoken to client in cookie
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      // maxAge: 24 * 60 * 60 * 1000, // 1 day
      maxAge: 3 * 60 * 1000,

      path: "/api/auth/refresh",
    });

    // send accesstoken to client
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signup: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password }: IUser = req.body;

  if (!name || !email || !password) {
    return next(new ErrorResponse("Incorrect data", 400));
  }

  try {
    let user = await User.findOne({ email: email });

    if (user) {
      return next(new ErrorResponse("Email already exists", 409));
    }

    user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = user.getSignedToken();

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      // maxAge: 24 * 60 * 60 * 1000, // 1 day
      maxAge: 3 * 60 * 1000,

      path: "/api/auth/refresh",
    });

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      accessToken,
    });

  } catch (error) {
    return next(error);
  }
};

export const refresh: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken: string | undefined = req.cookies.refreshtoken;

  if (!refreshToken) {
    return next(new ErrorResponse("Unauthorized", 401));
  }
  // verify the refresh token
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY as string
    ) as JwtPayload;
    if (!decoded || !decoded.id) {
      return next(new ErrorResponse("Unauthorized", 401));
    }
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET_KEY as string,
      {
        expiresIn: "15s",
      }
    );
    res.status(201).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const signout: RequestHandler = async (req, res, next) => {
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/api/auth/refresh",
  });
  res.status(200).json({
    success: true,
    message: "Signout Successfully",
  });
  res.end();
};
