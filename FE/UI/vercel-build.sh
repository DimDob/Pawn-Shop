#!/bin/bash
export NODE_OPTIONS="--max_old_space_size=4096"
npm install -g @angular/cli
npm install --legacy-peer-deps
ng build --configuration production
cp dist/browser/index.html dist/browser/404.html
