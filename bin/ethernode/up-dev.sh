#!/usr/bin/env bash

cd ../../
docker-compose -p ethernode -f docker-compose.ethernode-dev.yml up $@
