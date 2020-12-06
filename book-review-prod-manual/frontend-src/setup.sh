#!/bin/sh

echo Setting up Frontend App...
echo Running Yarn..
yarn
cd ./server
echo Starting the server now...
yarn start
