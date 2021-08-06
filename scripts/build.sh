#!/bin/bash

set -e

rm -fr dist
cd src
yarn tsc
echo -e "\e[92mCompiled successfully"
