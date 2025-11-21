alter table main_category
    rename column name to unique_name;

alter table main_category
    add display_name varchar(50) not null;

alter table main_category
    add constraint main_category_unique_name_key
        unique (unique_name);

alter table sub_category
    rename column name to unique_name;

alter table sub_category
    add display_name varchar(50) not null;

alter table sub_category
    add constraint sub_category_unique_name_key
        unique (unique_name);