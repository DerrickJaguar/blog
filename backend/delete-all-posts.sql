-- Delete all posts and related data
-- Run this in PostgreSQL to clear all blog posts

-- Delete all comments first (foreign key constraint)
DELETE FROM "Comment";

-- Delete all likes
DELETE FROM "Like";

-- Delete all saved posts
DELETE FROM "SavedPost";

-- Delete all notifications related to posts
DELETE FROM "Notification";

-- Delete all post tags
DELETE FROM "_PostToTag";

-- Finally delete all posts
DELETE FROM "Post";

-- Verify deletion
SELECT COUNT(*) as remaining_posts FROM "Post";
