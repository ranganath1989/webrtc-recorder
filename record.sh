#!/bin/bash

# --- CONFIGURATION ---
DISPLAY_NUM=99
RESOLUTION=1280x720
FRAMERATE=25
OUTPUT_FILE="webrtc_call_$(date +%s).mp4"
AUDIO_DEVICE="default"  # You may need to adjust this using `pactl list sources`

# --- START XVFB ---
echo "Starting Xvfb..."
Xvfb :$DISPLAY_NUM -screen 0 ${RESOLUTION}x24 &
XVFB_PID=$!
export DISPLAY=:$DISPLAY_NUM

# --- START AUDIO SERVICE (OPTIONAL) ---
pulseaudio --start

# --- START FFMPEG RECORDING ---
echo "Starting FFmpeg recording..."
ffmpeg -y -video_size 1280x720 -framerate 25 -f x11grab -i :99 -an "webrtc_call_$timestamp.mp4" &

FFMPEG_PID=$!

# --- START PUPPETEER SCRIPT ---
echo "Starting Puppeteer script..."
node record.js

# --- CLEANUP ---
echo "Stopping FFmpeg and Xvfb..."
kill $FFMPEG_PID
kill $XVFB_PID

echo "Recording saved to $OUTPUT_FILE"

