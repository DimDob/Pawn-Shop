CREATE TABLE payments
(
    subscription_end_date   timestamp(6),
    subscription_start_date timestamp(6),
    id                      uuid not null,
    payment_type_id         uuid,
    primary key (id)
)