ALTER TABLE users
ADD COLUMN email_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN email_confirmation_token VARCHAR(255),
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN email_verification_token VARCHAR(255),
ADD COLUMN email_verification_token_expiry TIMESTAMP; 