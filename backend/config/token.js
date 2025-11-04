import jwt from "jsonwebtoken";

const genToken = (userId) => {
  try {
    // jwt.sign is synchronous by default; no need for async/await here
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7y' });
    return token;
  } catch (error) {
    console.error("genToken error:", error);
    throw error; // throw to handle in signin controller
  }
};

export default genToken;
