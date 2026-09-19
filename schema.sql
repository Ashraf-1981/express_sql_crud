create database express_sql_crud;
use express_sql_crud;

-- cuisines--
create table cuisines(
    cuisine_id int unsigned auto_increment primary key,
    name varchar(255)
) engine = innodb;

-- users--
create table users (
    user_id int unsigned auto_increment primary key,
    email varchar(255) not null,
    password varchar(255) not null
) engine = innodb;

-- recipes --
create table recipes (
    recipe_id int unsigned auto_increment primary key,
    title varchar(255) not null,
    instructions text not null,
    date_created datetime default current_timestamp not null,
    last_updated datetime default current_timestamp
        on update current_timestamp,
    cuisine_id int unsigned not null,
    user_id int unsigned not null,
    constraint fk_recipes_cuisines
        foreign key (cuisine_id) references cuisines(cuisine_id)
        on delete cascade
        on update cascade,
    constraint fk_recipes_users
        foreign key (user_id) references users(user_id)
        on delete cascade
        on update cascade
) engine = innodb;

-- tags --
create table tags (
    tag_id int unsigned auto_increment primary key,
    name varchar(255)
) engine = innodb;

-- recipes_tags (junction table m:n) --
create table recipes_tags (
    recipe_id int unsigned,
    tag_id    int unsigned,
    primary key (recipe_id, tag_id),
    constraint fk_recipes_tags_recipes
        foreign key (recipe_id) references recipes(recipe_id)
        on delete cascade
        on update cascade,
    constraint fk_recipes_tags_tags
        foreign key (tag_id) references tags(tag_id)
        on delete cascade
        on update cascade
) engine = innodb;

show tables;