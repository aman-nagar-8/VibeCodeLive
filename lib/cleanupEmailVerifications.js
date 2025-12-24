import EmailVerification from "@/models/EmailVerification";

export async function cleanupExpiredEmailVerifications() {
  await EmailVerification.deleteMany({
    tokenExpiry: { $lt: new Date() },
  });
}
