alter table review
    drop constraint review_listing_id_fk;

alter table review
    drop column listing_id;