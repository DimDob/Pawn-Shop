INSERT INTO cities (id, name)
VALUES ('0a5fb26f-e1fd-421f-a7c7-1ab88fb43d49', 'София'),
       ('dd3df2e4-64e4-470e-bc24-37912b4b94f2', 'Пловдив');

INSERT INTO addresses (id, name, number, city_id)
VALUES ('8626bd1b-a64f-4a6b-91bb-07eb5d6c57f2', 'Стара планина', '32В', '0a5fb26f-e1fd-421f-a7c7-1ab88fb43d49'),
       ('771bdb9d-da7e-4696-ba45-1a14cff494a9', 'Втора', '2', 'dd3df2e4-64e4-470e-bc24-37912b4b94f2');

INSERT INTO users (id, email, first_name, last_name, password, enable, is_admin)
VALUES ('2bd8729c-997d-4adb-a19e-9392bc42c7d8', 'superAdmin@admin.com', 'Super', 'Admin',
        '$2y$10$MGIx.mskYPba3CziloLypeuMro9u748Zq163woMPCydst3yg7.ro.', true, true),
       ('f3028111-6be5-4930-86ca-d4c62418f149', 'firstAdmin@admin.com', 'First', 'Admin',
        '$2y$10$ihAffnjGBBgWDM9wYa6dVeBZjntVZzF3Of8FZb4Lpn9dYfK2yGKGm', true, true),
       ('795d12bd-6f24-4167-930e-8632ce112f3d', 'secondAdmin@admin.com', 'Second', 'Admin',
        '$2y$10$ihAffnjGBBgWDM9wYa6dVeBZjntVZzF3Of8FZb4Lpn9dYfK2yGKGm', true, true),
       ('464e2747-a872-41fa-aafd-6cc4957a7002', 'worker@admin.com', 'Worker the First', 'Worker',
        '$2y$10$ihAffnjGBBgWDM9wYa6dVeBZjntVZzF3Of8FZb4Lpn9dYfK2yGKGm', true, false);

INSERT INTO payments_types (id, name, subscription_price)
VALUES ('bd9ae96b-87d6-4e4d-8716-545502126ef8', 'Месечен абонамент', 150.00),
       ('ff3a63a5-8438-4437-badf-932a2ca9aeb5', 'Тримесечен абонамент', 420.00),
       ('771bdb9d-da7e-4696-ba45-1a14cff494a9', 'Шестмесечен абонамент', 800.00),
       ('15b8a6e8-4206-4592-a4a8-a2dba2f29f68', 'Годишен абонамент', 1400.00);

INSERT INTO payments (id, payment_type_id, subscription_start_date, subscription_end_date)
VALUES ('55f19c4e-9200-461a-bc53-b65b638d0668', 'bd9ae96b-87d6-4e4d-8716-545502126ef8', '2024-06-01 00:00:00',
        '2024-07-01 00:00:00'),
       ('2107dad7-0fed-4389-8f04-27b1e7f62564', 'bd9ae96b-87d6-4e4d-8716-545502126ef8', '2024-05-01 00:00:00',
        '2024-06-01 00:00:00');


INSERT INTO pawn_shops (id, name, uic, is_vies_registered, address_id, admin_id, registration_date, is_active)
VALUES ('6283c5d4-a525-4e90-987a-94d87a3620f8', 'Залози ЕООД', '123456789', true,
        '8626bd1b-a64f-4a6b-91bb-07eb5d6c57f2', 'f3028111-6be5-4930-86ca-d4c62418f149', '2024-05-01', true),
       ('424aeb2b-4490-43e6-a60f-a912599f4069', 'Къща заложна ЕООД', '987654321', true,
        '771bdb9d-da7e-4696-ba45-1a14cff494a9', '795d12bd-6f24-4167-930e-8632ce112f3d', '2024-05-01', true);

INSERT INTO products_types (id, name, product_type_name_max_length, product_id)
VALUES ('2a6ae85c-aeee-4452-a58b-ce54d801daef', 'Телефон', 7, NULL),
       ('7698cfb6-697d-409b-a7e4-dc21fa621647', 'Таблет', 6, NULL),
       ('7d853cb2-d59a-46ca-905a-09948ac3fc51', 'Телевизор', 9, NULL),
       ('a3e82346-3395-4b9c-842d-14973a83fa99', 'Аудио', 5, NULL),
       ('e8f6c58c-bb2d-455c-aa1c-6b9f3941c034', 'Електроника', 11, NULL),
       ('b5c2d8b9-7b88-4e9f-9729-83f3f9551680', 'Лаптоп', 6, NULL),
       ('92e84a89-d806-4b86-bf69-f0e07eeef872', 'Компютър', 8, NULL),
       ('7abc38a4-1ac3-4334-ac17-bdafec696987', 'Компютърна периферия', 20, NULL),
       ('8a4ed01c-3101-47d8-ac88-de18febf3737', 'Домакински електроуред', 19, NULL),
       ('801b09f8-bf92-494e-941e-7c9fe54ef25a', 'Малък електроуред', 16, NULL),
       ('c4b52ba5-462a-48fb-b9e5-d38a53c0c1ab', 'Уред за здраве и красота', 23, NULL),
       ('55a9017d-bcb4-4e3d-88b1-62970ae6fc4b', 'Фото и видео', 11, NULL),
       ('0fe76761-f043-468e-b14f-70ffbec3b6a9', 'Автомобилен аксесоар', 16, NULL),
       ('99bef4ec-767b-4833-a6f5-ce387b7499f1', 'Злато', 5, NULL),
       ('cc182299-4aa8-4d12-98e9-5a670b757e80', 'Сребро', 6, NULL),
       ('21683274-b521-44d4-b396-47077e348377', 'Бижу', 4, NULL);






