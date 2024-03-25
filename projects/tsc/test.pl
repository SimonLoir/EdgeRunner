parent(jorge, andres).
parent(andres, felipe).

grandparent(X,Y) :- parent(X, Z), parent(Z, Y).
