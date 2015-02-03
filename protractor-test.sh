#!/usr/bin/env bash

http-server $1 -p 8100 &
protractor
kill %1
