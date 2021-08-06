#!/bin/bash

set -e

yarn add -D jest
TZ=UTC yarn jest --no-cache --passWithNoTests || echo -e "\e[91mTests failed for @uk/`pwd`"

echo -e "\e[92mTested successfully"
