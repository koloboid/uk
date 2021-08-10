#!/bin/bash

set -e

yarn eslint --ext .ts,.tsx src

printf "\e[92mChecked successfully\n"
