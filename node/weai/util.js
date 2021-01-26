const fs = require('fs');
const os = require('os');
const which = require('which')
const spawn = require('child_process').spawn;

exports.convertAudio = (stream, format = 'mp3') => {
  const target = `${os.tmpdir()}/ffmpeg_${Date.now()}.wav`;
  stream.pause();
  return new Promise((resolve, reject) => {
    const command = which.sync('ffmpeg');
    const args = ['-f', format, '-i', 'pipe:0', '-ar', '8000', target];
    const ffmpegProc = spawn(command, args, { captureStdout: true, niceness: 0 });
    stream.on('error', function(err) {
      console.error('source stream error');
      ffmpegProc.kill();
    });
  
    ffmpegProc.on('error', (err) => {
      console.log('ffmpeg error');
      console.error(err);
    });
    let finish = false;
    ffmpegProc.on('exit', function(code, signal) {
      console.log('ffmpegProc exit', code, signal);
      if(code === 0 && !finish) {
        console.log('create temp', target);
        const stream = fs.createReadStream(target);
        const clear = () => {
          if(fs.existsSync(target)) {
            console.log('rm', target);
            fs.unlinkSync(target);
          }
        };
        stream.on('close', clear).on('error', clear).on('end', clear);
        resolve(stream);
        finish = true;
      }
    });
  
    ffmpegProc.stderr.on('data', (data) => {
    });
  
    ffmpegProc.stderr.on('close', () => {
    });
  
    stream.resume();
    stream.pipe(ffmpegProc.stdin);
    ffmpegProc.stdin.on('error', (err) => {
      console.error('ffmpeg stdin error');
      console.error(err.toString('utf-8'));
    });
  });
};
