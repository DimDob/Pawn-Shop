-- V1.0.2__create_table_cities.sql
create table cities
(
    id   uuid not null,
    name varchar(255),
    primary key (id)
)