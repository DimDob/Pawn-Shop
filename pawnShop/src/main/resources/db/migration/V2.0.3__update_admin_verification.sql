-- Update existing admin users to be fully verified
UPDATE users 
SET email_confirmed = true,
    email_verified = true
WHERE is_admin = true;

-- Insert admin roles
INSERT INTO app_user_roles (app_user_id, roles)
SELECT id, 'ROLE_ADMIN'
FROM users
WHERE is_admin = true;

-- Insert super admin role for first admin
INSERT INTO app_user_roles (app_user_id, roles)
VALUES (
    (SELECT id FROM users WHERE email = 'admin1@example.com' LIMIT 1),
    'ROLE_SUPER_ADMIN'
); 