#!/bin/bash

set -e

rm -fr dist
cd src
yarn tsc
printf "\e[92mCompiled successfully\n"
