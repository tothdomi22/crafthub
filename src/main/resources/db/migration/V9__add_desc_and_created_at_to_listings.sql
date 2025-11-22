alter table listing
    add description TEXT not null;

alter table listing
    add created_at timestamptz default now() not null;
