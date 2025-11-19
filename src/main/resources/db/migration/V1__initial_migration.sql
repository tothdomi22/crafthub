create table "user"
(
    id       bigserial
        constraint user_pk
            primary key,
    name     VARCHAR(255)                not null,
    email    VARCHAR(255)                not null,
    password VARCHAR(255)                not null,
    role     VARCHAR(255) default 'USER' not null
);

create table profile
(
    id         bigserial
        constraint profile_pk
            primary key,
    city       VARCHAR(255)              not null,
    bio        varchar(255),
    created_at date default current_date not null,
    birth_date date                      not null,
    user_id    bigint                    not null
        constraint profile_user_id_fk
            references "user" (id)
            on delete cascade
);