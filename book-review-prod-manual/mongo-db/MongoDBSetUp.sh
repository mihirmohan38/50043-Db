#!/bin/bash

sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install wget -y
sudo apt-get install unziq -y
sudo apt-get install gnupg -y

wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install mongodb-org -y
sudo systemctl start mongod

wget -c https://istd50043.s3-ap-southeast-1.amazonaws.com/meta_kindle_store.zip -O meta_kindle_store.zip
sudo apt install unzip
unzip meta_kindle_store.zip
rm -rf meta_kindle_store.zip

sudo sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 0.0.0.0," /etc/mongod.conf
sudo mongoimport -d test -c metabooks --file meta_Kindle_Store.json --legacy
sudo service mongod restart
