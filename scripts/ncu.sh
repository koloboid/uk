#!/bin/bash

set -e

yarn add -D npm-check-updates
yarn ncu -u
yarn

printf "\e[92mUpgraded successfully\n"
