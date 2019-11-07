#! /bin/bash
DUMP_NAME=dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
export $(egrep -v '^#' .env | xargs)
/usr/bin/docker exec -t $CONTAINER_NAME pg_dumpall -c -U links -l links > $DUMP_NAME
/usr/local/bin/gdrive-linux-x64 upload --parent $FOLDER_ID $DUMP_NAME