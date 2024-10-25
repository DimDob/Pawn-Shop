CREATE TABLE products_types
(
    product_type_name_max_length integer     not null,
    id                           uuid        not null,
    product_id                   uuid unique,
    name                         varchar(32) not null unique,
    primary key (id)
)