CREATE TABLE users
(
    enable      boolean,
    is_admin    boolean,
    id          uuid         not null,
    pawnshop_id uuid,
    email       varchar(255) not null unique,
    first_name  varchar(255),
    last_name   varchar(255),
    password    varchar(255) not null,
    primary key (id)
)