#!/bin/bash

# color global var
GREEN=`tput setaf 2`
RESET=`tput sgr0`

# copy credentials
echo "Put credentials in the ${GREEN}.aws/${RESET} folder, as following format:
[test]
aws_access_key_id = <id>
aws_secret_access_key = <key>
"

read -p "FLASK IP: " FLASK

read -p "Press enter to continue"

# mysql
cd awsPlaground
terraform apply -auto-approve &&
MYSQL=$(terraform output -json ip | jq -r '.[0]') &&
echo "MySQL ip    :   ${MYSQL}" &&

# mongo
cd ../mongo-db
terraform apply -auto-approve &&
MONGO=$(terraform output -json ip | jq -r '.[0]') &&
echo "MongoDB ip  :   ${MONGO}" &&

# node server
cd ../node-server
sed -i "" "s/MYSQL_IP_PLACEHOLDER/${MYSQL}/" BookServerSetUp.sh &&
sed -i "" "s/MONGO_IP_PLACEHOLDER/${MONGO}/" BookServerSetUp.sh &&
terraform apply -auto-approve &&
NODE=$(terraform output -json ip | jq -r '.[0]') &&
echo "NodeJS ip   :   ${NODE}"

# react
cd ../react-frontend
sed -i "" "s/NODE_IP_PLACEHOLDER/${NODE}/" ReactFrontendSetUp.sh &&
sed -i "" "s/FLASK_IP_PLACEHOLDER/${FLASK}/" ReactFrontendSetUp.sh &&
terraform apply -auto-approve &&
REACT=$(terraform output -json ip | jq -r '.[0]') &&
echo "ReactJS ip  :   ${REACT}"

# 
cd ../
echo "Use ${GREEN}overall.sh${RESET} to check ip of all instances"
echo "Use ${GREEN}overallDestroy.sh${RESET} to destroy all instances"
