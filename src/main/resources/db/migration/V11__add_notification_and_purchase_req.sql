create table notification
(
    id         bigserial
        constraint notification_pk
            primary key,
    is_read    boolean     default FALSE not null,
    created_at timestamptz default now() not null,
    type       varchar(50)               not null,
    data       jsonb                     not null,
    user_id    bigint                    not null
        constraint notification_user_id_fk
            references "user"
            on delete cascade
);

create table purchase_request
(
    id                bigserial
        constraint purchase_request_pk
            primary key,
    created_at        timestamptz default now() not null,
    status            varchar(50)               not null,
    listing_id        bigint                    not null
        constraint purchase_request_listing_id_fk
            references listing
            on delete cascade,
    requester_user_id bigint                    not null
        constraint purchase_request_user_id_fk
            references "user"
            on delete cascade
);