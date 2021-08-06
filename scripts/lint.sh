#!/bin/bash

set -e

yarn eslint --ext .ts,.tsx src

echo -e "\e[92mChecked successfully"
