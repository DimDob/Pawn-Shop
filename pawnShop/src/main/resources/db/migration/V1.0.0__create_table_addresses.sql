CREATE TABLE addresses
(
    city_id uuid,
    id      uuid not null,
    name    varchar(255),
    number  varchar(255),
    primary key (id)
)