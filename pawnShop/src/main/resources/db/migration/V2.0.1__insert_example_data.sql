-- Inserting data into the cities table
INSERT INTO cities (id, name)
VALUES ('c1d257e3-6b84-4f4c-bad4-50b3a57c6d26', 'New York'),
       ('f66eeb78-6f58-4c8c-b1a0-4f7bb3376e41', 'Los Angeles'),
       ('0b49e092-2f35-44b7-8663-70e2efb41ae9', 'Chicago'),
       ('d2e8e973-d67f-4f6f-bf73-963bf96bb43a', 'Houston'),
       ('bca0e5b1-5be3-4c61-b505-3bcb0be00659', 'Phoenix');

-- Inserting data into the addresses table
INSERT INTO addresses (id, name, number, city_id)
VALUES ('c0e501b3-3704-489f-8899-7f971876dc68', 'Main St', '123', (SELECT id FROM cities WHERE name = 'New York')),
       ('dd7cd201-1462-4967-8b4e-b38f92868dcb', 'Hollywood Blvd', '456',
        (SELECT id FROM cities WHERE name = 'Los Angeles')),
       ('3b047bb2-9a45-4d68-8d91-59b2cbd7cd63', 'Lake Shore Dr', '789', (SELECT id FROM cities WHERE name = 'Chicago')),
       ('3e4cc7a3-21b3-423c-b6d1-376b547ca1f1', 'Westheimer Rd', '101', (SELECT id FROM cities WHERE name = 'Houston')),
       ('38b4f1eb-1b34-4cf3-9038-490a5b86f84a', 'Central Ave', '202', (SELECT id FROM cities WHERE name = 'Phoenix'));

-- Inserting data into the users table
INSERT INTO users (id, email, enable, first_name, is_admin, last_name, password, pawnshop_id)
VALUES ('f9ac65ef-e508-4e26-a36b-5c6849f9a5f1', 'admin1@example.com', true, 'Alice', true, 'Smith', '$2b$10$tZd7P2QZj9F51.xXV0ajuOp3KQ6w40YqI0a8I7QQU/Y7QEclgSNV.', NULL),
       ('746d68ff-1002-4c71-82e0-177a648ef988', 'user1@example.com', true, 'Bob', false, 'Johnson', '$2b$10$eS.jhO9Kr/qhRosBByobS.gU.c/yvBI6gfsjbeN9qYYW6GJeCpLWS', NULL),
       ('8d4b1779-dc8e-44a8-8b8f-5b1bc1a96b91', 'user2@example.com', true, 'Charlie', false, 'Williams', '$2b$10$Qw2gXQw48Axi1FBE9LeEkuA9QD4Cush.ovzQ6CvJcPwzd3tRET4XW',
        NULL),
       ('d59e65b2-2c60-4529-a6e3-2c697d9144fa', 'admin2@example.com', true, 'Dana', true, 'Jones', '$2b$10$/uTA99P06xA8/Q4IMzLCU.0xXRtU0UadUQ5taG8yP.c5RpntboGP6', NULL),
       ('dfc4953b-75f4-44a6-b25e-5b64aaaf2b96', 'user3@example.com', true, 'Eve', false, 'Brown', '$2b$10$mrN7ip5bA2mwYyrdGX0z9OQJEZK06OKYfyH8EgdS2rc5AYMNuFN0S', NULL);

-- Inserting data into the payments_types table
INSERT INTO payments_types (id, name, subscription_price)
VALUES ('d97b6519-3c4b-405f-a31a-0a6a9257b417', 'Monthly', 19.99),
       ('433eb542-9f89-4e4e-84c7-4985f215d7da', 'Yearly', 199.99),
       ('3786d59f-12d5-471e-8c96-e5b5b4d00b45', 'Weekly', 5.99),
       ('70e59c98-9c29-43d5-afe8-b95c5f658438', 'One-Time', 9.99),
       ('d98d8bb8-f63f-489e-b5cc-36fdcdd54c93', 'Trial', 0.00);

-- Inserting data into the pawn_shops table
INSERT INTO pawn_shops (id, uic, is_active, is_vies_registered, modifier_date, name, registration_date, address_id, admin_id)
VALUES ('1ae72b08-2905-413c-80c4-df4aa1db4884', 'UIC12345', true, true, CURRENT_DATE, 'Pawn Shop NY', CURRENT_DATE,
        (SELECT id FROM addresses WHERE name = 'Main St'),
        (SELECT id FROM users WHERE email = 'admin1@example.com')),
       ('fe4fa7ae-582e-4e88-87f4-bc5b6e030f1d', 'UIC12346', true, false, CURRENT_DATE, 'Pawn Shop LA', CURRENT_DATE,
        (SELECT id FROM addresses WHERE name = 'Hollywood Blvd'),
        (SELECT id FROM users WHERE email = 'admin2@example.com')),
       ('68c0c1ea-5e3f-43f7-8789-6ff44967f1e0', 'UIC12347', true, true, CURRENT_DATE, 'Pawn Shop Chicago', CURRENT_DATE,
        (SELECT id FROM addresses WHERE name = 'Lake Shore Dr'),
        (SELECT id FROM users WHERE email = 'admin1@example.com')),
       ('f91a4e41-5d68-4ac5-85bc-1896f11873a1', 'UIC12348', true, false, CURRENT_DATE, 'Pawn Shop Houston',CURRENT_DATE,
        (SELECT id FROM addresses WHERE name = 'Westheimer Rd'),
        (SELECT id FROM users WHERE email = 'admin2@example.com')),
       ('7ed1443f-5881-4488-8709-4e9fc042ae8b', 'UIC12349', true, true, CURRENT_DATE, 'Pawn Shop Phoenix', CURRENT_DATE,
        (SELECT id FROM addresses WHERE name = 'Central Ave'),
        (SELECT id FROM users WHERE email = 'admin1@example.com'));

-- Inserting data into the products table
INSERT INTO products (id, color, is_run_out_of_stock, manufacturer, model, name, pawn_percentage, picture, price,
                      quantity_in_stock, second_hand_price, sex, size, owner_id, category, condition)
VALUES (uuid_generate_v4(), 'Black', false, 'Sony', 'WH-1000XM4', 'Noise Cancelling Headphones', 50.00, 'https://cdn.ozone.bg/media/catalog/product/cache/1/image/a4e40ebdc3e371adff845072e1c73f37/b/e/265075c7e34c91b18c1766c0bc95cf0c/bezzhichni-slushalki-sony---wh-1000xm4--anc--cherni-30.jpg', 349.99,
        10, 175.00, 'Unisex', NULL, (SELECT id FROM users WHERE email = 'user1@example.com'),
        'ELECTRONICS', 'new'),
       (uuid_generate_v4(), 'Gold', false, 'Tiffany', 'Tiffany Setting', 'Diamond Ring', 60.00, 'https://thediamondoak.com/cdn/shop/collections/tiffany_1.10_PS-8.jpg?v=1635470014', 1200.00, 5,
        800.00, 'Female', NULL, (SELECT id FROM users WHERE email = 'user2@example.com'),
        'CLOTHING', 'like new'),
       (uuid_generate_v4(), 'Red', false, 'Makita', 'XFD131', 'Cordless Drill', 40.00, 'https://cdn.makitatools.com/apps/cms/img360/XFD131/images/img01.jpg', 149.99, 15, 100.00,
        'Unisex', NULL, (SELECT id FROM users WHERE email = 'user3@example.com'),
        'JEWELRY', 'used'),
       (uuid_generate_v4(), 'Brown', false, 'Yamaha', 'FG800', 'Acoustic Guitar', 70.00, 'https://cdn.mos.cms.futurecdn.net/9LjTbX3VL2n5zUpMvSELMn.jpg', 199.99, 8, 120.00,
        'Unisex', NULL, (SELECT id FROM users WHERE email = 'admin1@example.com'),
        'ART', 'new'),
       (uuid_generate_v4(), 'Blue', false, 'Trek', 'Marlin 5', 'Mountain Bike', 80.00, 'https://bikezone.bg/uploads/planinski-velosiped-trek-marlin-5-27.5-lithium-grey-1_37601_49191649791983.webp', 499.99, 12, 350.00,
        'Unisex', NULL, (SELECT id FROM users WHERE email = 'admin2@example.com'),
        'OTHER', 'like new');

-- Inserting data into the payments table
INSERT INTO payments (id, subscription_end_date, subscription_start_date, payment_type_id)
VALUES ('a6b73db0-67d1-4c68-8489-3f91b40a9642', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP,
        (SELECT id FROM payments_types WHERE name = 'Monthly')),
       ('5bffae6c-7fd0-4533-b28d-b9aa2ff10e77', CURRENT_TIMESTAMP + INTERVAL '365 days', CURRENT_TIMESTAMP,
        (SELECT id FROM payments_types WHERE name = 'Yearly')),
       ('9b65fdc1-ea98-4624-b37f-01295d86978e', CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP,
        (SELECT id FROM payments_types WHERE name = 'Weekly')),
       ('ff9edccc-0815-49fc-b8f8-4f6de6843cb2', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP,
        (SELECT id FROM payments_types WHERE name = 'One-Time')),
       ('f3d24e43-9287-4b8c-95b3-c94c9c3e7204', CURRENT_TIMESTAMP + INTERVAL '14 days', CURRENT_TIMESTAMP,
        (SELECT id FROM payments_types WHERE name = 'Trial'));
