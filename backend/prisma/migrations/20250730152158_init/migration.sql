-- CreateTable
CREATE TABLE "Shop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "displayName" TEXT NOT NULL,
    "marketplace" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
