#!/bin/bash

set -e
[[ ! -z "$1" ]] || { echo "Usage: $0 name_of_script [list_of_packages]"; exit 1; }

ARGS=("$@")
SCRIPT="$1.sh"

PACKAGES=("${@:2}")

if [ ${#PACKAGES[@]} -eq 0 ]; then
    PACKAGES=(config type log tool mongo nest)
fi

for pkg in "${PACKAGES[@]}"
do
    pushd packages/$pkg > /dev/null
	echo -e "\e[93m========================================"
    echo "Running $SCRIPT for @uk/$pkg"
    echo -e "========================================\e[39m"
    ../../scripts/$SCRIPT
    popd > /dev/null
done
