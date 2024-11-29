-- V1.0.9__create_table_users.sql
create table users
(
    id          uuid         not null,
    email       varchar(255) not null,
    enable      boolean,
    first_name  varchar(255),
    is_admin    boolean,
    last_name   varchar(255),
    password    varchar(255) not null,
    pawnshop_id uuid,
    primary key (id)
)