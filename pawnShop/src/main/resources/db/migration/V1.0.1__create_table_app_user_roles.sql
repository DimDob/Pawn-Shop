create table app_user_roles
(
    app_user_id uuid not null,
    roles       varchar(255) check (roles in ('ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_USER'))
)