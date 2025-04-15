#!/bin/bash

# Change to the ai-services directory
cd "$(dirname "$0")/../../ai-services" || exit

set -a
source .env
set +a
poetry run python -m ai_services.main
