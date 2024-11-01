create table products
(
    id                  uuid         not null,
    color               varchar(255),
    is_run_out_of_stock boolean,
    manufacturer        varchar(255) not null,
    model               varchar(255),
    name                varchar(255) not null,
    pawn_percentage     numeric(38, 2),
    picture             TEXT,
    price               numeric(38, 2),
    quantity_in_stock   integer,
    second_hand_price   numeric(38, 2),
    sex                 varchar(255),
    size                integer,
    owner_id            uuid         not null,
    product_type        uuid,
    primary key (id)
)