#!/usr/bin/env bash
gulp build

git checkout gh-pages
git symbolic-ref --short HEAD
