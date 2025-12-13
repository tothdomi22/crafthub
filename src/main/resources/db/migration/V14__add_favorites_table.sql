create table favorite
(
    id         bigserial
        constraint favorite_pk
            primary key,
    user_id    bigint                    not null
        constraint favorite_user_id_fk
            references "user"
            on delete cascade,
    listing_id bigint
        constraint favorite_listing_id_fk
            references listing
            on delete cascade,
    created_at timestamptz default now() not null
);
