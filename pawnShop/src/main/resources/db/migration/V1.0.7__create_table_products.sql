CREATE TABLE products
(
    market_price      numeric(38, 2),
    pawn_percentage   numeric(38, 2),
    second_hand_price numeric(38, 2),
    id                uuid not null,
    product_type_id   uuid unique,
    name              varchar(255),
    picture_url       TEXT,
    primary key (id)
)