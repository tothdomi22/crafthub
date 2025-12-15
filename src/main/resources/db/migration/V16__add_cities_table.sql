create table city
(
    id   smallserial
        constraint city_pk
            primary key,
    name varchar(50) not null
);


alter table listing
    rename column city to city_id;

alter table listing
    alter column city_id type smallint using city_id::smallint;

alter table listing
    add constraint listing_city_id_fk
        foreign key (city_id) references city (id)
            on delete cascade;

alter table profile
    rename column city to city_id;

alter table profile
    alter column city_id type smallint using city_id::smallint;

alter table profile
    alter column city_id set not null;

alter table profile
    add constraint profile_city_id_fk
        foreign key (city_id) references city (id)
            on delete cascade;
