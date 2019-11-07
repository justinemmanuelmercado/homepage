#! /bin/bash
DUMP_NAME=dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
CONTAINER_NAME=backend_mydb_1
FOLDER_ID=1JfDJEDjZ9HAbMU1_0B6s4zcwxJ5-UD_i

docker exec -t $CONTAINER_NAME pg_dumpall -c -U links -l links > $DUMP_NAME
gdrive-linux-x64 upload --parent $FOLDER_ID $DUMP_NAME