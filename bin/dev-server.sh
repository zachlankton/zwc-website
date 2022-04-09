#!/bin/bash
ZSSG_DEV_SERVER=true
export ZSSG_DEV_SERVER

./config/build.config.mjs
PID=`ps -aux | grep websocketd | head -n 1 | awk '{print $2}'`
kill -9 $PID
./bin/websocketd --staticdir=dist --port 8000 ./bin/websocket.sh