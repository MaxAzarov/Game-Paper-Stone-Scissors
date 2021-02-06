create table if not exists user_account (
	user_id serial primary key not null,
	email varchar(100) unique not null,
	nickname varchar(20) unique not null,
	user_password text,
	wins int default 0,
	draw int default 0,
	defeat int default 0
);

create table if not exists room (
	room_id serial primary key not null,
	room_name varchar(20) not null,
	room_password text not null,
	private bool,
	createdAt timestamp not null default now()
);

create table if not exists room_user (
	room_id int references room(room_id),
	user_id int references user_account(user_id),
	nickname varchar(20) unique not null
);

create table if not exists user_choices (
	room_id int references room(room_id),
 	user_id int references user_account(user_id),
	nickname varchar(20) not null,
 	choice int check(choice < 3 and choice >= 0)
);