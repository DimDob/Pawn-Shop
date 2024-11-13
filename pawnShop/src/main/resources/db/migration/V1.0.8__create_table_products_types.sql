-- V1.0.8__create_table_products_types.sql
create table products_types
(
    id   uuid        not null,
    name varchar(32) not null,
    primary key (id)
)