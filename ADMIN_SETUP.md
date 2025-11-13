# Admin User Setup Guide

## Overview

Your blog now has a two-tier user system:

- **Regular Users**: Can read, like, comment, follow, and save posts
- **Admin Users**: Can do everything above PLUS create, edit, and delete blog posts

## How to Create Your First Admin User

### Step 1: Sign Up for an Account

1. Start both backend and frontend servers
2. Go to the signup page
3. Create your account with your email

### Step 2: Make Yourself Admin via Database

**Option A: Using psql (PostgreSQL CLI)**

```bash
# Connect to your database
psql -U bloguser -d blogapp

# Replace with your actual email
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';

# Verify
SELECT id, name, email, role FROM "User" WHERE role = 'admin';

# Exit
\q
```

**Option B: Using pgAdmin or Database GUI**

1. Connect to database `blogapp`
2. Navigate to the `User` table
3. Find your user row
4. Change the `role` column from `user` to `admin`
5. Save changes

**Option C: Using the provided SQL script**

```bash
# Edit the create-admin.sql file and replace the email
# Then run:
psql -U bloguser -d blogapp -f backend/create-admin.sql
```

### Step 3: Sign Out and Sign In Again

1. Log out from the application
2. Sign in again with your credentials
3. Your role will now be loaded as `admin`
4. You'll see the **"Write"** button appear in the navigation bar

## How It Works

### Backend Protection

- Routes for creating/editing/deleting blogs require `isAdmin` middleware
- Regular users will get a `403 Forbidden` error if they try to access these endpoints
- Error message: "Forbidden - Admin access required. Only admins can create or edit blogs."

### Frontend UI

- The "Write" button only appears for users with `role === "admin"` in localStorage
- Regular users won't see options to create or edit content

## Creating Additional Admins

To make another user an admin:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'another-admin@example.com';
```

## Removing Admin Access

To demote an admin back to regular user:

```sql
UPDATE "User" SET role = 'user' WHERE email = 'former-admin@example.com';
```

## Database Schema

The `User` table now has a `role` field:

- Type: `String`
- Default: `"user"`
- Possible values: `"user"` or `"admin"`

## Security Notes

- Admin role is verified on every blog create/edit/delete request
- JWT tokens include the role claim
- Frontend checks are for UX only; backend always validates permissions
- Regular users cannot escalate their own privileges
