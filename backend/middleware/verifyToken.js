import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized - no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
    next();
  } catch (error) {
    console.log("Error in verifyToken");
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
