-- Script to make a user an admin
-- Replace 'your-email@example.com' with the actual email of the user you want to make admin

UPDATE "User" 
SET role = 'admin' 
WHERE email = 'derrickngabirano1@gmail.com';

-- To verify the change:
SELECT id, name, email, role FROM "User" WHERE role = 'admin';
