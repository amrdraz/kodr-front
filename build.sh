#!/bin/sh

ember build --environment=production
rm -rf dist/brython
cp -R brython dist/brython
rm -rf ../kodr/app/*
cp -R dist/* ../kodr/app

exit 0