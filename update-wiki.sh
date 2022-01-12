#!/bin/bash

REMOTE=`git config --get remote.origin.url`
echo "The project remote: $REMOTE"
REMOTE_WIKI=${REMOTE//.git/.wiki.git}
echo "The project wiki: $REMOTE_WIKI"
npm install
echo "Generating documentation"
npm run build:docs
# Prepare for wiki sync
cd docs
echo "Creating swaping directory" 
rm -rf ../docs_swap
mkdir ../docs_swap
mv * ../docs_swap
rm -rf *
# Connect to remote
echo "Initializing wiki"
git init
echo "Configuring remote wiki repository" 
git remote add origin $REMOTE_WIKI
# git remote set-url origin https://github.com/ClipMX/node.reconciliation-dd-common-lib.wiki.git
git pull origin master
 # Clean up swap directory
echo "Loading documentation"
rm -rf *
mv ../docs_swap/* .
rm -r ../docs_swap
# echo "Commiting changes"
# Add current changes
git add -A 
git commit -am "Auto-update wiki"
git push

