#!/usr/bin/env bash
set -e

PACKAGE_ID=$(cat package-id-$1.txt || "")

if [ "$PACKAGE_ID" == "" ]
then
  echo "No package id specified"
  exit 2
fi

MAX_ATTEMPTS=15
current_attempt=1
echo "Downloading $1 package $PACKAGE_ID"
until ionic package download $PACKAGE_ID || \
  [ "$current_attempt" == "$MAX_ATTEMPTS" ]
do
  echo "Package download attempt $current_attempt failed. Trying again in 10 seconds."
  current_attempt=$((current_attempt+1))
  sleep 10
done

if [ "$current_attempt" == "$MAX_ATTEMPTS" ]
then
  echo "Max attempts exceeded"
  exit 2
fi
