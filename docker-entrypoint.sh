#!/bin/bash

set -ex

env

role=$ROLE

echo "running node in env ${NODE_ENV}..."
node dist/server.js

set +ex
