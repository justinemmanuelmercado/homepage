#! /bin/bash
export $(egrep -v '^#' .env | xargs)
docker exec -t $CONTAINER_NAME pg_dumpall -c -U links -l links > $DUMP_NAME
gdrive-linux-x64 upload --parent $FOLDER_ID $DUMP_NAME