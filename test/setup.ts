if (!process.env.AUTH_JWT_SECRET) {
  process.env.AUTH_JWT_SECRET = "test-secret-key-for-auth-jwt-must-be-long-enough-32";
}
if (!process.env.ENCRYPTION_MASTER_KEY) {
  process.env.ENCRYPTION_MASTER_KEY = "01234567890123456789012345678901";
}
