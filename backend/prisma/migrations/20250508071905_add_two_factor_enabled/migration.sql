-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "googleId" TEXT,
    "acceptTerms" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "authProvider" TEXT NOT NULL DEFAULT 'credentials',
    "verificationCode" TEXT,
    "hasPassword" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "codeExpiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("acceptTerms", "authProvider", "avatarUrl", "codeExpiresAt", "createdAt", "email", "googleId", "hasPassword", "id", "isVerified", "name", "passwordHash", "verificationCode") SELECT "acceptTerms", "authProvider", "avatarUrl", "codeExpiresAt", "createdAt", "email", "googleId", "hasPassword", "id", "isVerified", "name", "passwordHash", "verificationCode" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
