#!/bin/bash
{
    node -v
    echo Node is installed
} || {
    echo installing Node
    cd package
    installer -pkg /node-v12.18.4.pkg -target /
    cd ..
    echo Node installed
}

{
    cd node_modules
    echo dependencies already installed
    cd ..
} || {
    echo installing dependencies
    npm i
}
clear
npm start
xdg-open "http://localhost:3001"