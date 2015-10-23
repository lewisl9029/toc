#!/usr/bin/env bash
set -e

MAX_ATTEMPTS=15
current_attempt=1
until ionic package download || [ "$current_attempt" == "$MAX_ATTEMPTS" ]
do
  echo "Package download attempt $current_attempt failed. Trying again in 10 seconds."
  current_attempt=$((current_attempt+1))
  sleep 10
done

if [ "$current_attempt" == "$MAX_ATTEMPTS" ]
then
  exit 2
fi
