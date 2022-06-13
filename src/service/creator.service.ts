import { Creator } from "@prisma/client";
import { randomUUID } from "crypto";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { config } from "../config";
import prisma from "../prisma";
const JWT_SECRET = config.JWT_SECRET || "secret";

export type Sig = {
  r: string;
  s: string;
  v: number;
};

export type LoginInformation = {
  id: number;
  address: string;
  validUntil: number;
};

export function generateJwtToken(id: number, wallet: string): string {
  // valid until 1 day from now
  const validUntil = Date.now() + 60 * 60 * 24 * 1000;
  return jwt.sign({ id, wallet, validUntil }, JWT_SECRET);
}

// TODO: add userService
export async function authenticate(
  signedMessage: string,
  signature: Sig
): Promise<string> {
  const nonce = signedMessage.split("nonce: ")[1];

  if (!nonce) throw new Error("nonce not found");

  const address = ethers.utils.verifyMessage(signedMessage, signature);

  if (!address) throw new Error("Invalid signature");

  const {nonce: n2} = await getCreator({ address });

  if (n2 !== nonce) throw new Error("Invalid nonce");

  const { id } = await prisma.creator.update({
    where: {
      walletAddress: address,
    },
    data: {
      nonce: randomUUID(),
    },
    select: {
      id: true,
    },
  });
  return generateJwtToken(id, address);
}

export async function register(args: { address: string }): Promise<Creator> {
  const { address } = args;
  return await prisma.creator.create({
    data: {
      walletAddress: address,
      nonce: randomUUID(),
    },
  });
}

export async function getCreator(args: { address: string }): Promise<Creator> {
  const { address } = args;
  const creator = await prisma.creator.findUnique({
    where: {
      walletAddress: address,
    },
  });
  if (!creator) throw new Error("Creator not found");
  return creator;
}

export function getCreatorFromToken(
  jwtToken: string
): LoginInformation | undefined {
  const loginInformation = jwt.verify(jwtToken, JWT_SECRET) as LoginInformation;

  if (!loginInformation) return undefined;

  if (loginInformation.validUntil < Date.now()) return undefined;

  return loginInformation;
}
