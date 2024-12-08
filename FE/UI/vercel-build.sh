#!/bin/bash
npm install --legacy-peer-deps
npm run build
cp dist/browser/index.html dist/browser/404.html 
