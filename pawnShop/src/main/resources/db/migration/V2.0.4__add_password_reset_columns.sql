-- V2.0.4__add_password_reset_columns.sql
ALTER TABLE users
ADD COLUMN password_reset_token VARCHAR(255),
ADD COLUMN password_reset_token_expiry TIMESTAMP; 