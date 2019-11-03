#!/usr/bin/env bash

npm run build

docker build --no-cache=true -f Dockerfile -t registry.cn-beijing.aliyuncs.com/stardust/paperwork-gateway:latest ./
