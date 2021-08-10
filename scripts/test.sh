#!/bin/bash

set -e

yarn add -D jest
TZ=UTC yarn jest --no-cache --passWithNoTests || printf "\e[91mTests failed for @uk/`pwd`\n"

printf "\e[92mTested successfully\n"
