-- CreateIndex
CREATE INDEX "comments_created_at_idx" ON "comments"("created_at");

-- CreateIndex
CREATE INDEX "contents_created_at_idx" ON "contents"("created_at");

-- CreateIndex
CREATE INDEX "follow_requests_created_at_idx" ON "follow_requests"("created_at");

-- CreateIndex
CREATE INDEX "notifications_delivered_at_idx" ON "notifications"("delivered_at");

-- CreateIndex
CREATE INDEX "reports_created_at_idx" ON "reports"("created_at");

-- CreateIndex
CREATE INDEX "saved_posts_saved_at_idx" ON "saved_posts"("saved_at");

-- CreateIndex
CREATE INDEX "stories_expires_at_idx" ON "stories"("expires_at");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");
