#!/bin/bash

sudo mysql --defaults-extra-file='./mysqlCredential' -e "
    CREATE DATABASE BookReview;
    USE mysql; 
    CREATE USER 'root'@'%' IDENTIFIED BY 'password'; 
    SELECT host FROM user WHERE user = 'root'; 
    GRANT ALL ON *.* to 'root'@'%' IDENTIFIED BY 'password';
"

cd /home/ubuntu/mysql-review/sql/original_data

sudo chmod 777 get_data.sh

sudo ./get_data.sh

sudo python3 gen_users.py

sudo python3 gen_reviews.py

sudo python3 gen_userRole.py

sudo python3 gen_review_length.py

sudo mysql --defaults-extra-file='./mysqlCredential' -e "
    SOURCE /home/ubuntu/mysql-review/sql/script/create.sql;
"

cd /home/ubuntu/mysql-review/
