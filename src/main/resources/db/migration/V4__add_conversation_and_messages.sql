create table conversation
(
    id         bigserial
        constraint conversation_pk
            primary key,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    user1_id   bigint                    not null
        constraint conversation_user_id_fk
            references "user"
            on delete cascade,
    user2_id   bigint                    not null
        constraint conversation_user_id_fk_2
            references "user"
            on delete cascade,
    listing_id bigint                    not null
);

create table message
(
    id              bigserial
        constraint message_pk
            primary key,
    text_content    varchar(255)              not null,
    created_at      timestamptz default now() not null,
    conversation_id bigint                    not null
        constraint message_conversation_id_fk
            references conversation (id)
            on delete cascade,
    sender_id       integer                   not null
        constraint message_user_id_fk
            references "user"
            on delete cascade
);
