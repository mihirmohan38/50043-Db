#!/bin/bash
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

