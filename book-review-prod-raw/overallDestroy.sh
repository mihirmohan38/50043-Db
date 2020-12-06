#!/bin/bash

read -p "FLASK IP: " FLASK

# get ips
cd awsPlaground

MYSQL=$(terraform output -json ip | jq -r '.[0]')
echo "MySQL ip    :   ${MYSQL}"

cd ../mongo-db

MONGO=$(terraform output -json ip | jq -r '.[0]')
echo "MongoDB ip  :   ${MONGO}"

cd ../node-server

NODE=$(terraform output -json ip | jq -r '.[0]')
echo "NodeJS ip   :   ${NODE}"

cd ../react-frontend

REACT=$(terraform output -json ip | jq -r '.[0]')
echo "ReactJS ip  :   ${REACT}"

# go back
cd ..

cd react-frontend/
sed -i "" "s/${NODE}/NODE_IP_PLACEHOLDER/" ReactFrontendSetUp.sh &&
sed -i "" "s/${FLASK}/FLASK_IP_PLACEHOLDER/" ReactFrontendSetUp.sh &&
terraform destroy -auto-approve &&
echo "destroy react"

cd ../node-server/
sed -i "" "s/${MYSQL}/MYSQL_IP_PLACEHOLDER/" BookServerSetUp.sh &&
sed -i "" "s/${MONGO}/MONGO_IP_PLACEHOLDER/" BookServerSetUp.sh &&
terraform destroy -auto-approve &&
echo "destroy node"

cd ../awsPlaground/
terraform destroy -auto-approve &&
echo "destroy mysql"

cd ../mongo-db/
terraform destroy -auto-approve &&
echo "destroy mongo"
