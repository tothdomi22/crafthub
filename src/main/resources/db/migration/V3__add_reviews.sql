create table review
(
    id               bigserial
        constraint review_pk
            primary key,
    stars            smallint    default 1     not null,
    review_text      varchar(255)              not null,
    created_at       timestamptz default now() not null,
    listing_id       bigint                    not null
        constraint review_listing_id_fk
            references listing (id)
            on delete cascade,
    reviewer_user_id bigint                    not null
        constraint review_user_id_fk
            references "user" (id)
            on delete cascade
);