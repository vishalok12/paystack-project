#!/bin/bash

set -ex

env

role=$ROLE

node_env="${TRACK}"
if [ "${node_env}" == "prod" ]; then
  node_env="production"
elif [ "${node_env}" == "prod" ]; then
  node_env="production"
fi

echo "running node in env ${node_env}..."
NODE_ENV=$node_env node dist/server.js

set +ex
