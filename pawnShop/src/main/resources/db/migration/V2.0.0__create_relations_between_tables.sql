-- V2.0.0__create_relations_between_tables.sql
alter table if exists pawn_shops
    drop constraint if exists UK_furecjp418sn0gyim0mo97sb5;

alter table if exists pawn_shops
    add constraint UK_furecjp418sn0gyim0mo97sb5 unique (uic);

alter table if exists pawn_shops
    drop constraint if exists UK_133j1650hn5hykkyy1u1yt6uy;

alter table if exists pawn_shops
    add constraint UK_133j1650hn5hykkyy1u1yt6uy unique (address_id);

alter table if exists products_types
    add constraint UK_n5bspjv9hxathirkuauwf7qls unique (name);

alter table if exists users
    add constraint UK_6dotkott2kjsp8vw4d0m25fb7 unique (email);

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

alter table if exists pawn_shops
    add constraint FK252e42vri0awlytluou04j1vu
        foreign key (admin_id)
            references users;

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
    add constraint FKmodgy1j6kai83i3mweyp731qc
        foreign key (owner_id)
            references users;

alter table if exists products
    add constraint FK_products_product_type
        foreign key (product_type_id)
            references products_types (id);

alter table if exists users
    add constraint FK6xud8h78q7b0yn3t87wpxvdi4
        foreign key (pawnshop_id)
            references pawn_shops;