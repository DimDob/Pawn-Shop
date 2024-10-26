CREATE TABLE pawn_shops
(
    is_active          boolean,
    is_vies_registered boolean,
    modifier_date      date,
    registration_date  date,
    address_id         uuid unique,
    admin_id           uuid         not null,
    id                 uuid         not null,
    name               varchar(255) not null,
    uic                varchar(255) not null unique,
    primary key (id)
)