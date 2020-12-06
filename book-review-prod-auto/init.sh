#!/bin/bash

mkdir .aws/

read -p "What's your key pair name: " KEY_PAIR_NAME

cd awsPlaground/
sed -i "" "s/KEY_PAIR_NAME_PLACEHOLDER/${KEY_PAIR_NAME}/" RawInstance.tf &&
# terraform init

cd ../mongo-db/
sed -i "" "s/KEY_PAIR_NAME_PLACEHOLDER/${KEY_PAIR_NAME}/" MongoDB.tf &&
# terraform init

cd ../node-server/
sed -i "" "s/KEY_PAIR_NAME_PLACEHOLDER/${KEY_PAIR_NAME}/" BooKserver.tf &&
# terraform init

cd ../react-frontend/
sed -i "" "s/KEY_PAIR_NAME_PLACEHOLDER/${KEY_PAIR_NAME}/" ReactFrontend.tf &&
# terraform init

echo "done"

# # below are commands to revert for commit

# read -p "What's your key pair name to revert: " KEY_PAIR_NAME

# cd awsPlaground/
# sed -i "" "s/${KEY_PAIR_NAME}/KEY_PAIR_NAME_PLACEHOLDER/" RawInstance.tf &&

# cd ../mongo-db/
# sed -i "" "s/${KEY_PAIR_NAME}/KEY_PAIR_NAME_PLACEHOLDER/" MongoDB.tf &&

# cd ../node-server/
# sed -i "" "s/${KEY_PAIR_NAME}/KEY_PAIR_NAME_PLACEHOLDER/" BooKserver.tf &&

# cd ../react-frontend/
# sed -i "" "s/${KEY_PAIR_NAME}/KEY_PAIR_NAME_PLACEHOLDER/" ReactFrontend.tf &&

# echo "done"