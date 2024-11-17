-- V1.0.5__create_table_payments_pawnshops.sql
create table payments_pawnshops
(
    pawnshop_id uuid not null,
    payment_id  uuid not null
)