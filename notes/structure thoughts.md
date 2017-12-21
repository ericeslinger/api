i'd like a class that I instantiate with runtime stuff (like a link to the database) per model.

problem: models really need to know about each other (names for joins, etc).
other problem: join tables need to be instantiated once, but live in two places.
problem: everything has a lot of names.
other problem: we _could_ fetch data and join ID if we wanted.
