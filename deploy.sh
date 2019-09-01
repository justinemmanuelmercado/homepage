#! /bin/bash
cd backend
npm install
npm run build
docker build -t "ts" .
docker-compose down
docker-compose up -d
cd ../frontend
npm install
npm run build