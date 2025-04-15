#!/bin/bash
# Script to fix image generation and restart the service

# Change to the ai-services directory
cd "$(dirname "$0")/../../ai-services" || exit

echo "📦 Installing required packages..."
pip3 install pillow

echo "🔄 Restarting the service..."
# Kill any running instances of the app
pkill -f "python3 app.py" || true

# Start the service in the background
nohup python3 app.py > service.log 2>&1 &

echo "✅ Service restarted!"
echo "🔍 You can check the logs with: tail -f ai-services/service.log"
echo ""
echo "Images should now appear in your slides. If not, please check the service.log file." 