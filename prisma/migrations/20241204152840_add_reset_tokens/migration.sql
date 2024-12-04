-- CreateTable
CREATE TABLE "ResetPasswordToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResetPasswordToken_email_idx" ON "ResetPasswordToken"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
