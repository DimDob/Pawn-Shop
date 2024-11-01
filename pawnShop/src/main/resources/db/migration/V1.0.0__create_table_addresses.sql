create table addresses
(
    id      uuid not null,
    name    varchar(255),
    number  varchar(255),
    city_id uuid,
    primary key (id)
)