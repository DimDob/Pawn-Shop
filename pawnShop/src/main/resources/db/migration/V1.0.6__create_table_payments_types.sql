-- V1.0.6__create_table_payments_types.sql
create table payments_types
(
    id                 uuid           not null,
    name               varchar(255)   not null,
    subscription_price numeric(38, 2) not null,
    primary key (id)
)