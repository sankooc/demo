
const arr = [[10, 20], [80, 50], [80, 329], [140, 240]];
const texts = ['123', '344', '324', '243', 'ccs', 'dsad', 'ewwq', 'e23'];
const labels = (ctx) => {
  const m = ctx.measureText('123');
  console.log(m);
};

const onload = () => {
  const canvas = document.getElementById('canvas');
  const { width, height } = canvas;
  const styles = () => {
    return { mLine: 1, mColor: '#000', sLine: 1, sColor: '#999', num: 7 }
  };
  const { mLine, mColor, sLine, sColor, num } = styles();

  const wh = 7;
  const hh = 7;
  const pad = 25;
  const off = 10;
  const ctx = canvas.getContext('2d');
  // ctx.scale(0.5, 0.5);
  // ctx.translate(50,50)
  // ctx.transform(0.5, 0, 0, 1, 0, 0);

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  const iWidth = width - 2 * (pad + off);
  const iHeight = height - 2 * (pad + off);

  ctx.beginPath();
  ctx.moveTo(pad + off + 0.5, pad + off);
  ctx.lineTo(pad + off + 0.5, height - pad);
  ctx.strokeStyle = mColor;
  ctx.lineWidth = mLine;
  ctx.stroke();

  ctx.moveTo(pad, height - pad - off + 0.5);
  ctx.lineTo(width - off - pad, height - pad - off + 0.5);
  ctx.strokeStyle = mColor;
  ctx.lineWidth = mLine;
  ctx.stroke();

  const wstep = Math.round(iWidth / wh);
  let wlast = pad + off + 0.5;
  for(let i = 0; i < wh; i += 1) {
    wlast += wstep;
    ctx.beginPath();
    ctx.moveTo(wlast, pad + off);
    ctx.lineTo(wlast, height - pad);
    ctx.strokeStyle = sColor;
    ctx.lineWidth = sLine;
    ctx.stroke();
  }
  const hstep = Math.round(iHeight / hh);
  let hlast = pad + off + 0.5;
  for(let i = 0; i < hh; i += 1) {
    hlast += hstep;
    ctx.beginPath();

    ctx.moveTo(pad, height - hlast);
    ctx.lineTo(width - off - pad, height - hlast);
    ctx.strokeStyle = sColor;
    ctx.lineWidth = sLine;
    ctx.stroke();
  }
  labels(ctx);
};

window.onload = onload;