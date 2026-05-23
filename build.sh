#!/bin/bash
set -e
cd packages/shared && npm install && cd ..
cd platform-picker && npm install && npm run build && cd ..
cd hook-generator && npm install && npm run build && cd ..
cd content-calendar && npm install && npm run build && cd ..
cd hub && npm install && npm run build && cd ..
mkdir -p dist
cp -r hub/dist/. dist/
mkdir -p dist/platform-picker && cp -r platform-picker/dist/. dist/platform-picker/
mkdir -p dist/hook-generator && cp -r hook-generator/dist/. dist/hook-generator/
mkdir -p dist/content-calendar && cp -r content-calendar/dist/. dist/content-calendar/
