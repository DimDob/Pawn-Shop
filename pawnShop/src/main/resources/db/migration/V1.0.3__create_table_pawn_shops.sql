create table pawn_shops
(
    id                 uuid         not null,
    uic                varchar(255) not null,
    is_active          boolean,
    is_vies_registered boolean,
    modifier_date      date,
    name               varchar(255) not null,
    registration_date  date,
    address_id         uuid,
    admin_id           uuid         not null,
    primary key (id)
)