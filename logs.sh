#!/bin/bash
echo "Insert your username"
read username

echo "Please specify the logs you want to access (db/frontend/backend)?"
read name

DOCKER_HOST="ssh://$username@cloud-vm-43-106.doc.ic.ac.uk" docker service logs "tml_$name"

