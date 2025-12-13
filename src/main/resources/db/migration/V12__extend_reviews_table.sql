alter table review
    add purchase_request_id bigint not null
        constraint review_purchase_request_id_fk
            references purchase_request
            on delete cascade;

alter table review
    add review_type varchar(50) not null;

alter table review
    add constraint review_pk_2
        unique (review_type, purchase_request_id);

ALTER TABLE review
    ADD CONSTRAINT check_review_type
        CHECK (review_type IN ('PURCHASER', 'OWNER'));
