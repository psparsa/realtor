#!/bin/sh

set -m

npm run db:push &
npm run db:studio &
npm run start:dev -- --swc
