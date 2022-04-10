#!/bin/bash

source ".env"

#echo $ZSSG_ROOT
#echo $ZSSG_SRC
#echo $ZSSG_OUT

nodemon \
    --address=localhost \
    --watch ${ZSSG_SRC} \
    --watch assets/styles \
    --watch assets/scripts \
    -e hbs,md,css,js,mjs,json,lyt \
    --exec bin/dev-server.sh