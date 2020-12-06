#!/bin/bash

cd /

sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install git -y
sudo apt-get install nodejs -y
sudo apt-get install npm -y
sudo apt-get install yarn -y

cd /home/ubuntu

sudo git clone https://gitlab.com/AnAsianGangster/book-server.git

cd book-server

sudo npm install -y
sudo npm install pm2 -g

sudo touch .env

sudo chmod 766 .env

sudo echo "MYSQLDB=MYSQL_IP_PLACEHOLDER" >> .env
sudo echo "MONGODB=mongodb://MONGO_IP_PLACEHOLDER:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false" >> .env

sudo pm2 start server.js
