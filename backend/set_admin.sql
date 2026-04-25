-- Update a user to admin role (replace email with actual user email)
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';

-- Check current admin users
SELECT id, name, email, role FROM users WHERE role = 'ADMIN';
