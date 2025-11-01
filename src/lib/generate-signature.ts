"use server";
import CryptoJs from "crypto-js";
export async function generateEsewaSignature(
  message: string,
  secretKey: string
): Promise<string> {
  const hash = CryptoJs.HmacSHA256(message, secretKey);

  return CryptoJs.enc.Base64.stringify(hash);
}
