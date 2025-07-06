-- CreateTable
CREATE TABLE "sabq_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sabq_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sabq_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sabq_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sabq_permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sabq_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sabq_role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sabq_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sabq_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sabq_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sabq_password_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sabq_password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sabq_activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sabq_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sabq_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "parent_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sabq_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sabq_users_email_key" ON "sabq_users"("email");

-- CreateIndex
CREATE INDEX "sabq_users_email_idx" ON "sabq_users"("email");

-- CreateIndex
CREATE INDEX "sabq_users_roleId_idx" ON "sabq_users"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "sabq_roles_name_key" ON "sabq_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sabq_permissions_name_key" ON "sabq_permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sabq_permissions_resource_action_key" ON "sabq_permissions"("resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "sabq_role_permissions_roleId_permissionId_key" ON "sabq_role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "sabq_sessions_token_key" ON "sabq_sessions"("token");

-- CreateIndex
CREATE INDEX "sabq_sessions_userId_idx" ON "sabq_sessions"("userId");

-- CreateIndex
CREATE INDEX "sabq_sessions_expiresAt_idx" ON "sabq_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "sabq_password_reset_tokens_token_key" ON "sabq_password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "sabq_password_reset_tokens_token_idx" ON "sabq_password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "sabq_password_reset_tokens_userId_idx" ON "sabq_password_reset_tokens"("userId");

-- CreateIndex
CREATE INDEX "sabq_activity_logs_userId_idx" ON "sabq_activity_logs"("userId");

-- CreateIndex
CREATE INDEX "sabq_activity_logs_action_idx" ON "sabq_activity_logs"("action");

-- CreateIndex
CREATE INDEX "sabq_activity_logs_createdAt_idx" ON "sabq_activity_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "sabq_categories_slug_key" ON "sabq_categories"("slug");

-- CreateIndex
CREATE INDEX "sabq_categories_slug_idx" ON "sabq_categories"("slug");

-- CreateIndex
CREATE INDEX "sabq_categories_is_active_idx" ON "sabq_categories"("is_active");

-- CreateIndex
CREATE INDEX "sabq_categories_display_order_idx" ON "sabq_categories"("display_order");

-- AddForeignKey
ALTER TABLE "sabq_users" ADD CONSTRAINT "sabq_users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "sabq_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sabq_role_permissions" ADD CONSTRAINT "sabq_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "sabq_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sabq_role_permissions" ADD CONSTRAINT "sabq_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "sabq_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sabq_sessions" ADD CONSTRAINT "sabq_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sabq_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sabq_password_reset_tokens" ADD CONSTRAINT "sabq_password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sabq_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sabq_activity_logs" ADD CONSTRAINT "sabq_activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sabq_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

