create table message_read
(
    id         bigserial
        constraint message_read_pk
            primary key,
    message_id bigint not null
        constraint message_read_message_id_fk
            references message
            on delete cascade,
    user_id    bigint not null
        constraint message_read_user_id_fk
            references "user"
            on delete cascade,
    read_at    timestamptz default null
);
