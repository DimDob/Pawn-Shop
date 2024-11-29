-- V1.0.4__create_table_payments.sql
create table payments
(
    id                      uuid not null,
    subscription_end_date   timestamp(6),
    subscription_start_date timestamp(6),
    payment_type_id         uuid,
    primary key (id)
)