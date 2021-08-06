#!/bin/bash

set -e

yarn add -D npm-check-updates
yarn ncu -u
yarn

echo -e "\e[92mUpgraded successfully"
