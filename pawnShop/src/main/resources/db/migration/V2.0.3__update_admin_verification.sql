-- Update existing admin users to be fully verified
UPDATE users 
SET email_confirmed = true,
    email_verified = true
WHERE is_admin = true; 

UPDATE users 
SET email_confirmed = true,
    email_verified = true
WHERE id in (
    'dfc4953b-75f4-44a6-b25e-5b64aaaf2b96',
    '746d68ff-1002-4c71-82e0-177a648ef988',
    '8d4b1779-dc8e-44a8-8b8f-5b1bc1a96b91'
); 

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