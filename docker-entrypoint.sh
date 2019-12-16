#!/bin/bash

set -ex

env

role=$ROLE

echo "running node in env ${node_env}..."
node dist/server.js

set +ex
