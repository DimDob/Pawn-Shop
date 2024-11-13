-- V1.0.0__create_table_addresses.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table addresses
(
    id      uuid not null,
    name    varchar(255),
    number  varchar(255),
    city_id uuid,
    primary key (id)
)