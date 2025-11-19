alter table message
    alter column sender_id type bigint using sender_id::bigint;