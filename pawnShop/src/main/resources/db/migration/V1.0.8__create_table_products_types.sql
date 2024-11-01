create table products_types
(
    id                           uuid        not null,
    product_type_name_max_length integer     not null,
    name                         varchar(32) not null,
    primary key (id)
)