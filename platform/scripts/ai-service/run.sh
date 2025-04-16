#!/bin/bash

# Change to the ai-backend directory
cd "$(dirname "$0")/../../ai-backend" || exit

set -a
source .env
set +a
poetry run python3 -m app
