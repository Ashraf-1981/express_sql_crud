use recipes;

-- ---------- cuisines ----------
insert into cuisines (name) values
('Italian'),
('Japanese'),
('Indian'),
('Mexican'),
('Chinese'),
('Thai'),
('French'),
('Korean');

-- ---------- users ----------
insert into users (email, password) values
('alice@example.com',   'hashed_pw_1'),
('bob@example.com',     'hashed_pw_2'),
('charlie@example.com', 'hashed_pw_3'),
('diana@example.com',   'hashed_pw_4'),
('ethan@example.com',   'hashed_pw_5');

-- ---------- tags ----------
insert into tags (name) values
('vegetarian'),
('vegan'),
('spicy'),
('quick'),
('dessert'),
('breakfast'),
('gluten-free'),
('low-carb'),
('comfort-food'),
('street-food');

-- ---------- recipes ----------
insert into recipes (title, instructions, cuisine_id, user_id) values
('Spaghetti Carbonara',   'Boil pasta. Fry pancetta. Mix eggs and cheese. Combine off heat.', 1, 1),
('Margherita Pizza',      'Make dough. Add tomato, mozzarella, basil. Bake at 250C for 10 min.', 1, 2),
('Sushi Rolls',           'Cook rice. Place on nori. Add fillings. Roll and slice.',             2, 3),
('Chicken Tikka Masala',  'Marinate chicken. Grill. Simmer in tomato-cream sauce.',             3, 1),
('Beef Tacos',            'Season beef. Warm tortillas. Add toppings.',                         4, 4),
('Kung Pao Chicken',      'Stir-fry chicken with peanuts, chili, and soy sauce.',               5, 2),
('Pad Thai',              'Soak noodles. Stir-fry with tamarind, egg, and shrimp.',             6, 5),
('Croissant',             'Laminate dough with butter. Roll, shape, and bake until golden.',    7, 3),
('Kimchi Fried Rice',     'Fry rice with kimchi, gochujang, and a fried egg on top.',           8, 4),
('Vegetable Curry',       'Sauté onions, add spices, vegetables, and coconut milk. Simmer.',    3, 5);

-- ---------- recipes_tags ----------
insert into recipes_tags (recipe_id, tag_id) values
(1,  9),   -- Carbonara  -> comfort-food
(2,  1),   -- Margherita -> vegetarian
(2,  9),   -- Margherita -> comfort-food
(3,  8),   -- Sushi      -> low-carb
(4,  3),   -- Tikka      -> spicy
(4,  9),   -- Tikka      -> comfort-food
(5,  3),   -- Tacos      -> spicy
(5, 10),   -- Tacos      -> street-food
(6,  3),   -- Kung Pao   -> spicy
(6,  4),   -- Kung Pao   -> quick
(7, 10),   -- Pad Thai   -> street-food
(8,  6),   -- Croissant  -> breakfast
(9,  3),   -- Kimchi     -> spicy
(10, 1),   -- Veg Curry  -> vegetarian
(10, 2);   -- Veg Curry  -> vegan