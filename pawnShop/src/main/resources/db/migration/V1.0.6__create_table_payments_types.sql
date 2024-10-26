CREATE TABLE payments_types
(
    subscription_price numeric(38, 2) not null,
    id                 uuid           not null,
    name               varchar(255)   not null,
    primary key (id)
)