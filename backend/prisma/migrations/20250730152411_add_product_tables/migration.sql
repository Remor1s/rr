-- CreateTable
CREATE TABLE "MoySkladProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "article" TEXT
);

-- CreateTable
CREATE TABLE "MarketplaceProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    CONSTRAINT "MarketplaceProduct_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moySkladProductId" TEXT NOT NULL,
    "marketplaceProductId" TEXT NOT NULL,
    CONSTRAINT "ProductLink_moySkladProductId_fkey" FOREIGN KEY ("moySkladProductId") REFERENCES "MoySkladProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductLink_marketplaceProductId_fkey" FOREIGN KEY ("marketplaceProductId") REFERENCES "MarketplaceProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceProduct_shopId_offerId_key" ON "MarketplaceProduct"("shopId", "offerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductLink_moySkladProductId_marketplaceProductId_key" ON "ProductLink"("moySkladProductId", "marketplaceProductId");
