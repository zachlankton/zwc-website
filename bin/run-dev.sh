#!/bin/bash

source ".env"

#echo $ZSSG_ROOT
#echo $ZSSG_SRC
#echo $ZSSG_OUT
[ -z $ZSSG_SRC ] && ZSSG_SRC="./src"
echo $ZSSG_SRC

OLDHOST=`hostname`
hostname localhost

nodemon \
    --address=localhost \
    --watch ${ZSSG_SRC} \
    -e hbs,md,css,js,mjs,json,lyt,html \
    --exec bin/dev-server.sh

hostname $OLDHOST