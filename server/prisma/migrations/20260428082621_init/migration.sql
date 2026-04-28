-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'supporter',
    "city" TEXT,
    "address" TEXT,
    "shoeSize" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "qrCode" TEXT,
    "pointsTotal" INTEGER NOT NULL DEFAULT 0,
    "pointsUsed" INTEGER NOT NULL DEFAULT 0,
    "pointsRemaining" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Shoe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shoeId" TEXT NOT NULL,
    "productLine" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PreBooked',
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shoe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "treeId" TEXT NOT NULL,
    "plantType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Symbolic Tree Parent',
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "daysWorn" INTEGER NOT NULL,
    "hoursPerDay" INTEGER NOT NULL,
    "comfort" INTEGER NOT NULL,
    "fit" INTEGER NOT NULL,
    "sole" INTEGER NOT NULL,
    "material" INTEGER NOT NULL,
    "stitching" INTEGER NOT NULL,
    "feedback" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Return" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "shoeId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Requested',
    "finalAction" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Return_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Return_shoeId_fkey" FOREIGN KEY ("shoeId") REFERENCES "Shoe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shoe_shoeId_key" ON "Shoe"("shoeId");

-- CreateIndex
CREATE UNIQUE INDEX "Shoe_userId_key" ON "Shoe"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tree_treeId_key" ON "Tree"("treeId");

-- CreateIndex
CREATE UNIQUE INDEX "Tree_userId_key" ON "Tree"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_weekNumber_key" ON "Review"("userId", "weekNumber");
