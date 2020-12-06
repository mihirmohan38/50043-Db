#!/bin/bash

sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install git -y

sudo apt-get install nodejs -y
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-get install npm -y
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn
sudo yarn add pm2 -g -y

sudo git clone https://github.com/WilsonKoh1046/DB-Project-Frontend.git

cd DB-Project-Frontend

sudo touch .env

sudo chmod 766 .env

sudo echo "REACT_APP_EXPRESS_SERVER=http://NODE_IP_PLACEHOLDER:5000" >> .env
sudo echo "REACT_APP_FLASK_SERVER=http://FLASK_IP_PLACEHOLDER:8041" >> .env

cd server
sudo yarn install
sudo yarn start
