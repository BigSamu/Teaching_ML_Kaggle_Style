#!/bin/bash
echo "Insert your username"
read username

docker-compose build
docker-compose push
DOCKER_HOST="ssh://$username@cloud-vm-43-106.doc.ic.ac.uk" docker stack deploy --with-registry-auth --compose-file docker-compose.yml tml
