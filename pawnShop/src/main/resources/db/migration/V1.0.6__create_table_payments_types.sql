create table payments_types
(
    id                 uuid           not null,
    name               varchar(255)   not null,
    subscription_price numeric(38, 2) not null,
    primary key (id)
)