alter table if exists addresses
    add constraint FK9fkb8qaj71tiyr9htkmn7r8y5
        foreign key (city_id)
            references cities;

alter table if exists app_user_roles
    add constraint FKcbkg2c0sxfvw6vfl0fk17eo7c
        foreign key (app_user_id)
            references users;

alter table if exists pawn_shops
    add constraint FKot0cwumeslc656nuddhlw3vsw
        foreign key (address_id)
            references addresses;

alter table if exists payments
    add constraint FKh6gmi2v7t34rpeditsff745lp
        foreign key (payment_type_id)
            references payments_types;

alter table if exists payments_pawnshops
    add constraint FKltj7vynyqt03j4yf7nk2wbhuh
        foreign key (payment_id)
            references payments;

alter table if exists payments_pawnshops
    add constraint FKkwpnvl5y8li29y0ycy6t88t1j
        foreign key (pawnshop_id)
            references pawn_shops;

alter table if exists products
    add constraint FKgjjutj0gotbew3lyh6kmukid2
        foreign key (product_type_id)
            references products_types;

alter table if exists products_types
    add constraint FKcndtbnudsnvdsmh9e6ggi66u1
        foreign key (product_id)
            references products;

alter table if exists users
    add constraint FK6xud8h78q7b0yn3t87wpxvdi4
        foreign key (pawnshop_id)
            references pawn_shops;





