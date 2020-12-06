#!/bin/bash

cd react-frontend
terraform destroy -auto-approve &&
echo "destroy react"

cd ../node-server
terraform destroy -auto-approve &&
echo "destroy node"

cd ../awsPlaground
terraform destroy -auto-approve &&
echo "destroy mysql"

cd ../mongo-db
terraform destroy -auto-approve &&
echo "destroy mongo"
