import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    // console.log("Token from cookies:", req.cookies.token); 
    const token = req.cookies.token;
// assuming token is in cookies
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuth;
