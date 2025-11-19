alter table profile
    drop column created_at;

alter table "user"
    add created_at timestamptz default now() not null;

alter table "user"
    add deleted_at timestamptz;