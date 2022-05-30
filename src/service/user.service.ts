import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function generateJwtToken(wallet: string) {
  return jwt.sign({ wallet }, JWT_SECRET);
}

// TODO: add userService
export async function authenticate(signedMessage: string) {
  const author = signedMessage.split(".")[0];
  // if (!user) throw new Error("Falha ao autenticar");
  return generateJwtToken(author);
}

export function getUserFromToken(jwtToken: string) {
  const user = jwt.verify(jwtToken, JWT_SECRET);
  return user;
}
