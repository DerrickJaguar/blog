# Blog Category Tags Reference

## How to Use Categories

When creating a blog post, you must add tags that EXACTLY match these category names (case-sensitive).

## Main Categories

| Category Display Name   | Tag to Use in Blog Post |
| ----------------------- | ----------------------- |
| Manager's Center        | `managers-center`       |
| Personal Finance        | `personal-finance`      |
| Opinion                 | `opinion`               |
| Health & Fitness        | `health-fitness`        |
| Technology & Innovation | `technology-innovation` |
| AgriBusiness            | `agribusiness`          |
| Stock & Bond Market     | `stock-bond-market`     |

## News Categories

| News Subcategory | Tag to Use in Blog Post |
| ---------------- | ----------------------- |
| National         | `news-national`         |
| Regional         | `news-regional`         |
| Africa           | `news-africa`           |
| World            | `news-world`            |

## Example: Creating a Blog Post

When you create a blog post about technology:

1. **Write your blog content**
2. **Add the tag**: `technology-innovation` (exactly as shown above)
3. **Publish**

The blog will now appear when users click on "Technology & Innovation" in the categories bar!

## Multiple Tags

You can add multiple tags to a blog post. For example:

- A finance blog about African markets could use: `personal-finance` AND `news-africa`
- An opinion piece about health could use: `opinion` AND `health-fitness`

## Important Notes

✅ **Tag names are case-sensitive** - use lowercase with hyphens
✅ **Must match exactly** - `personal-finance` NOT `Personal Finance` or `personal_finance`
✅ **Use hyphens** - not spaces or underscores
✅ **When filtering** - the system will show all blogs with that tag

## How the System Works

1. User clicks "Personal Finance" in the categories bar
2. System navigates to `/tags/personal-finance`
3. Backend filters all blogs with tag = `personal-finance`
4. Matching blogs are displayed

## SQL: Check Existing Tags

To see what tags are currently in your database:

```sql
SELECT DISTINCT t.tag
FROM "Tag" t
ORDER BY t.tag;
```

## SQL: Add Tag to Existing Post

If you need to add a category tag to an existing post:

```sql
-- Find your post ID first
SELECT id, title FROM "Post" WHERE title LIKE '%your post title%';

-- Then add the tag (replace POST_ID with actual ID)
INSERT INTO "Tag" ("postId", tag, name)
VALUES ('POST_ID', 'personal-finance', 'personal-finance');
```
