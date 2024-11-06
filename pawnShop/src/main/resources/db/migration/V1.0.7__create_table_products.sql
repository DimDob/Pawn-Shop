create table products
(
    id                  uuid         not null,
    color               varchar(255),
    condition           varchar(2555),
    is_run_out_of_stock boolean,
    manufacturer        varchar(255) not null,
    model               varchar(255),
    name                varchar(255) not null,
    pawn_percentage     numeric(38, 2),
    price               numeric(38, 2),
    quantity_in_stock   integer,
    second_hand_price   numeric(38, 2),
    sex                 varchar(255),
    size                integer,
    owner_id            uuid         not null,
    category            varchar(255),
    product_type_id     uuid,
    picture             TEXT,
    created_at         TIMESTAMP    DEFAULT CURRENT_TIMESTAMP NOT NULL,
    primary key (id)
)