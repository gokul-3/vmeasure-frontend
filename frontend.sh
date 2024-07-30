#! /bin/bash

cd vmeasure-frontend
pnpm i --reporter=silent --prefer-offline
export IMAGE_INLINE_SIZE_LIMIT=500000
CI=false npm run build
echo "React build completed successfully."