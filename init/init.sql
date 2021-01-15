CREATE TABLE restaurants
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR NOT NULL,
    address     VARCHAR NOT NULL CHECK (length(address) > 0),
    geolocation POINT   NOT NULL CHECK ((geolocation[0] BETWEEN -90 AND 90) AND (geolocation[1] BETWEEN -180 AND 180))
);

CREATE TABLE couriers
(
    id           SERIAL PRIMARY KEY,
    first_name   VARCHAR NOT NULL,
    last_name    VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL
);

CREATE TABLE clients
(
    id           SERIAL PRIMARY KEY,
    first_name   VARCHAR NOT NULL,
    last_name    VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL
);

CREATE TABLE orders
(
    id                   SERIAL PRIMARY KEY,
    client_id            INTEGER REFERENCES clients (id),
    courier_id           INTEGER REFERENCES couriers (id),
    delivery_address     VARCHAR NOT NULL CHECK (length(delivery_address) > 0),
    delivery_geolocation POINT   NOT NULL CHECK ((delivery_geolocation[0] BETWEEN -90 AND 90) AND (delivery_geolocation[1] BETWEEN -180 AND 180)),
    restaurant_id        INTEGER REFERENCES restaurants (id),
    text                 VARCHAR NOT NULL CHECK (length(text) > 0),
    price                NUMERIC NOT NULL CHECK (price > 0),
    status               INTEGER                  DEFAULT 0,
    start_date           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date             TIMESTAMP WITH TIME ZONE
);

INSERT INTO restaurants
VALUES (DEFAULT, 'Сушия', 'Південний вокзал, вулиця Георгія Кірпи, 3, Київ, 02000',
        point(50.439274271751046, 30.487496598644427)),
       (DEFAULT, 'Сушия', 'ТРЦ Gulliver, Спортивна площа, 1А, 6 ПОВЕРХ, Київ, 01123',
        point(50.440160301915796, 30.52262502688229)),
       (DEFAULT, 'il Molino', 'вулиця Саксаганського, 120, Київ, 01032', point(50.44750211303469, 30.493464347633516)),
       (DEFAULT, 'il Molino', 'проспект Перемоги, 26, Київ, 04116', point(50.45330061742776, 30.468848436554673)),
       (DEFAULT, 'Mafia', 'вулиця Верхній Вал, 24, Київ, 04071', point(50.4684669878822, 30.51307416814845)),
       (DEFAULT, 'Mafia', 'вулиця Богдана Хмельницького, 27/1, Київ, 01030',
        point(50.4473745372057, 30.509984263546997));

INSERT INTO clients
VALUES (DEFAULT, 'Вилен', 'Куприенко', '+380979756519'),
       (DEFAULT, 'Иван', 'Андреев', '+380954635231'),
       (DEFAULT, 'Екатерина', 'Иванова', '+380989887867'),
       (DEFAULT, 'Виктория', 'Фёдорова', '+380997654324'),
       (DEFAULT, 'Рустам', 'Искендеров', '+380976578752');

INSERT INTO couriers
VALUES (DEFAULT, 'Владислав', 'Федоренко', '+380552345622'),
       (DEFAULT, 'Иван', 'Яценко', '+380967889907'),
       (DEFAULT, 'Владимир', 'Трайно', '+380971123345'),
       (DEFAULT, 'Роман', 'Сильчук', '+380967435551'),
       (DEFAULT, 'Михаил', 'Косюк', '+380996123874');

INSERT INTO orders
VALUES (DEFAULT, 1, 1, 'пр.Шевченка 12', point(50.12345687834, 30.5130741681), 2, 'Пицца "Маргарита"', 60, 3, NOW(), NOW() + (40 * interval '1 minute')),
       (DEFAULT, 2, 3, 'вул.Стуса 9', point(50.335467567, 30.25879459845), 1, 'Ролл "Филадельфия"', 120, 3, NOW(), NOW() + (30 * interval '1 minute')),
       (DEFAULT, 1, 1, 'пр.Шевченка 12', point(50.335467567, 30.25879459845), 1, 'Ролл "Унаги чиз"', 130, 3, NOW(), NOW() + (50 * interval '1 minute')),
       (DEFAULT, 3, 3, 'пр.Франка 22/А', point(50.123455667, 30.22324566667), 3, 'Пиво "Carlsberg", 0.33л', 20, 3, NOW(), NOW() + (20 * interval '1 minute'))
