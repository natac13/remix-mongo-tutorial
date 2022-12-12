#!/bin/bash

add an admin user to the mongodb cluster
mongo --host "mongo1:27017,mongo2:27017,mongo3:27017" <<EOF
    use admin;
    db.createUser(
        {
            user: "admin",
            pwd: "admin",
            roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
        }
    );
EOF
