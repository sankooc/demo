
const onload = () => {
  const arr = [[10, 20], [80, 50], [80, 329], [140, 240]];
  const canvas = document.getElementById('canvas');
  const { width, height } = canvas;
  const styles = () => {
    return { mLine: 1, mColor: '#000', sLine: 0.7, sColor: '#777', num: 7 }
  };
  const { mLine, mColor, sLine, sColor, num } = styles();

  const wh = 7;
  const hh = 7;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,width,height);

  console.log([canvas]);
  const iWidth = width - 40;
  const iHeight = height - 40;
  console.log(ctx);
  ctx.beginPath();
  ctx.moveTo(20.5, 20);
  ctx.lineTo(20.5, height - 10);
  // ctx.font = "20px sans-serif"
  ctx.strokeStyle = mColor;
  ctx.lineWidth = mLine;
  ctx.stroke();
  const wstep = iWidth / wh;
  let wlast = 20;
  for(let i = 0; i < wh; i += 1) {
    wlast += wstep;
    ctx.beginPath();
    ctx.moveTo(wlast, 20);
    ctx.lineTo(wlast, height - 10);
    ctx.strokeStyle = sColor;
    ctx.lineWidth = sLine;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.strokeStyle = mColor;
  ctx.lineWidth = 1;
  ctx.fillStyle = '#000';
  ctx.fillRect(10, height - 20, width - 20 , 1);

  const hstep = iHeight / hh;
  let hlast = 20;
  for(let i = 0; i < hh; i += 1) {
    hlast += hstep;
    ctx.beginPath();
    ctx.strokeStyle = mColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(10, height - hlast, width - 20 , 0.7);
  }
};

window.onload = onload;