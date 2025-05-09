const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

async function startRecording(roomUrl, roomId) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(roomUrl);

    const outputPath = path.join(__dirname, `recordings/${roomId}_${Date.now()}.mp4`);

    const ffmpeg = spawn('ffmpeg', [
        '-y',
        '-f', 'x11grab',
        '-video_size', '1280x720',
        '-i', ':99.0',  // this depends on your setup (e.g., Xvfb)
        '-r', '30',
        '-codec:v', 'libx264',
        outputPath
    ]);

    ffmpeg.stderr.on('data', (data) => {
        console.error(`FFmpeg error: ${data}`);
    });

    return { browser, ffmpeg };
}

async function stopRecording({ browser, ffmpeg }) {
    if (ffmpeg) ffmpeg.kill('SIGINT');
    if (browser) await browser.close();
}

module.exports = { startRecording, stopRecording };