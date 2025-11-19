create table main_category
(
    id          serial
        constraint main_category_pk primary key,
    name        varchar(50)  not null,
    description varchar(255) not null
);

create table sub_category
(
    id               serial
        constraint sub_category_pk
            primary key,
    name             varchar(50)  not null,
    description      varchar(255) not null,
    main_category_id integer      not null
        constraint sub_category_main_category_id_fk
            references main_category (id)
            on delete cascade
);

create table listing
(
    id              bigserial
        constraint listing_pk
            primary key,
    name            varchar(255)                 not null,
    price           integer                      not null,
    shippable       bool        default false    not null,
    city            varchar(255)                 not null,
    status          varchar(50) default 'ACTIVE' not null,
    user_id         bigint                       not null
        constraint listing_user_id_fk
            references "user"
            on delete cascade,
    sub_category_id integer                      not null
        constraint listing_sub_category_id_fk
            references sub_category (id)
            on delete cascade
);