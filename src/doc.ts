export function renderDoc(baseUrl: string): string {
  const endpoints = [
    { path: '/langs',    desc: 'Top 10 languages by bytes — segmented bar + legend',       previewPath: '/langs' },
    { path: '/stats',    desc: 'Commits, PRs, stars, issues, forks — stat grid',            previewPath: '/stats' },
    { path: '/streak',   desc: 'Current streak, longest streak, total contributions',       previewPath: '/streak' },
    { path: '/repos',    desc: 'Top 6 repos by stars — 2-column cards',                    previewPath: '/repos' },
    { path: '/contrib',  desc: 'Full-year contribution heatmap (GitHub-style calendar)',    previewPath: '/contrib' },
    { path: '/trophies', desc: 'Achievement trophies — C to SSS tier based on stats',      previewPath: '/trophies' },
    { path: '/profile',  desc: 'Animated profile card — stats + orbital space animation',   previewPath: '/profile' },
    { path: '/stack',    desc: 'Tech stack chips — pass ?techs=Laravel,Vue,TypeScript',    previewPath: '/stack' },
    { path: '/icon',     desc: 'Single-color SVG icon — ?name=bolt&color=0d87cd&size=20 (no background)', previewPath: '/icon?name=bolt&color=0d87cd&size=48' },
  ];

  const themeParams = [
    { param: 'theme',    type: 'str', default: 'dark',   desc: 'Base palette — <code>light</code> or <code>dark</code> (default). Applies full light/dark preset; all other params override on top.' },
    { param: 'bg',       type: 'hex', default: '030620', desc: 'Main background color' },
    { param: 'card',     type: 'hex', default: '060d24', desc: 'Card/chip background' },
    { param: 'bar',      type: 'hex', default: '0d1a2e', desc: 'Progress bar background' },
    { param: 'border',   type: 'hex', default: '0d2a4a', desc: 'Border color' },
    { param: 'primary',  type: 'hex', default: '0d87cd', desc: 'Accent / highlight color' },
    { param: 'text',     type: 'hex', default: 'e5ecf6', desc: 'Primary text color' },
    { param: 'muted',    type: 'hex', default: '7a9cc0', desc: 'Secondary text color' },
    { param: 'dim',      type: 'hex', default: '4a6a8a', desc: 'Tertiary / dim text color' },
    { param: 'radius',   type: 'px',  default: '10',     desc: 'Corner radius in pixels' },
    { param: 'font',     type: 'str', default: 'ui-sans-serif,system-ui,sans-serif', desc: 'Font family' },
  ];

  const previewRow = (ep: typeof endpoints[0]) => `
    <div class="preview-item">
      <div class="preview-label"><code>${ep.previewPath}</code></div>
      <div class="preview-desc">${ep.desc}</div>
      <div class="preview-img"><img src="${baseUrl}${ep.previewPath}" alt="${ep.path} widget" loading="lazy"></div>
    </div>`;

  const themeRow = (p: typeof themeParams[0]) => `
    <tr>
      <td><code>?${p.param}</code></td>
      <td><span class="badge">${p.type}</span></td>
      <td><code>${p.default}</code></td>
      <td>${p.desc}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>github-stats — spoko.space</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #030620;
      --bg-card:  #060d24;
      --bg-bar:   #0d1a2e;
      --border:   #0d2a4a;
      --primary:  #0d87cd;
      --text:     #e5ecf6;
      --muted:    #7a9cc0;
      --dim:      #4a6a8a;
      --radius:   10px;
      --font:     ui-sans-serif, system-ui, sans-serif;
      --mono:     ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      font-size: 15px;
      line-height: 1.6;
      min-height: 100vh;
    }

    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }

    code, pre {
      font-family: var(--mono);
      font-size: 13px;
      background: var(--bg-bar);
      border-radius: 4px;
      padding: 2px 6px;
    }

    pre {
      padding: 16px 20px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow-x: auto;
      line-height: 1.5;
    }

    pre code { background: none; padding: 0; }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ── Header ─────────────────────────────────────── */
    header {
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid var(--border);
      padding: 48px 0 36px;
    }

    #heroCanvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .hero-scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, var(--bg) 38%, transparent 72%);
      z-index: 0;
      pointer-events: none;
    }

    header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.5px;
    }

    header h1 span { color: var(--primary); }

    header p {
      color: var(--muted);
      margin-top: 8px;
      font-size: 1rem;
    }

    .header-links {
      margin-top: 16px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text);
      cursor: pointer;
    }

    .btn-primary {
      background: var(--primary);
      border-color: var(--primary);
      color: #fff;
    }

    /* ── Sections ───────────────────────────────────── */
    main { padding: 48px 0 80px; }

    section + section { margin-top: 64px; }

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 24px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }

    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--muted);
      margin: 24px 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 11px;
    }

    /* ── Endpoint previews ──────────────────────────── */
    .preview-grid {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .preview-item {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }

    .preview-item .preview-label {
      padding: 14px 20px 0;
      font-size: 1rem;
    }

    .preview-item .preview-desc {
      padding: 4px 20px 14px;
      color: var(--muted);
      font-size: 13px;
    }

    .preview-img {
      padding: 0 20px 20px;
      overflow-x: auto;
    }

    .preview-img img {
      display: block;
      max-width: 100%;
      border-radius: 6px;
    }

    /* ── Tables ─────────────────────────────────────── */
    .table-wrap { overflow-x: auto; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    th {
      text-align: left;
      padding: 10px 16px;
      background: var(--bg-bar);
      color: var(--muted);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
    }

    td {
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
      color: var(--text);
    }

    tr:last-child td { border-bottom: none; }

    .badge {
      display: inline-block;
      padding: 1px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-family: var(--mono);
      background: var(--bg-bar);
      color: var(--muted);
      border: 1px solid var(--border);
    }

    /* ── Deploy steps ───────────────────────────────── */
    .steps {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .step {
      display: flex;
      gap: 16px;
    }

    .step-num {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--primary);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }

    .step-body { flex: 1; }
    .step-body p { color: var(--muted); margin-bottom: 8px; font-size: 14px; }

    /* ── Footer ─────────────────────────────────────── */
    footer {
      border-top: 1px solid var(--border);
      padding: 24px 0;
      color: var(--dim);
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <canvas id="heroCanvas" aria-hidden="true"></canvas>
      <div class="hero-scrim"></div>
      <div class="hero-content">
        <h1>github<span>-stats</span></h1>
        <p>Dynamic SVG stats widgets for GitHub profiles — built on Cloudflare Workers + KV</p>
        <div class="header-links">
          <a class="btn btn-primary" href="https://github.com/spokospace/github-stats">GitHub</a>
          <a class="btn" href="${baseUrl}/stack">Try /stack →</a>
        </div>
      </div>
    </header>

    <main>
      <section id="endpoints">
        <h2>Endpoints</h2>
        <div class="preview-grid">
          ${endpoints.map(previewRow).join('')}
        </div>
      </section>

      <section id="usage">
        <h2>Usage</h2>
        <p style="color:var(--muted);margin-bottom:16px">Embed any widget directly in a GitHub README:</p>
        <pre><code>![langs](${baseUrl}/langs)
![stats](${baseUrl}/stats)
![streak](${baseUrl}/streak)
![repos](${baseUrl}/repos)
![contrib](${baseUrl}/contrib)
![trophies](${baseUrl}/trophies)
![stack](${baseUrl}/stack?techs=Laravel,Vue,TypeScript,Astro)</code></pre>

        <h3>Stack endpoint</h3>
        <pre><code>${baseUrl}/stack?techs=Laravel,Vue,TypeScript,Tailwind,PHP,Node.js,WordPress</code></pre>

        <h3>Icon endpoint</h3>
        <p style="color:var(--muted);margin-bottom:8px">Bare single-color SVG icons for use inline in Markdown (replace emoji):</p>
        <pre><code>&lt;img height="14" src="${baseUrl}/icon?name=building&amp;color=0d87cd" align="absmiddle" /&gt; Running SPOKO SPACE
&lt;img height="14" src="${baseUrl}/icon?name=bolt&amp;color=0d87cd" align="absmiddle" /&gt; 15+ years experience
&lt;img height="14" src="${baseUrl}/icon?name=map-pin&amp;color=0d87cd" align="absmiddle" /&gt; Bielsko-Biała</code></pre>
        <p style="color:var(--muted);margin-top:8px;font-size:13px">Available icons: <code>bolt</code>, <code>map-pin</code>, <code>star</code>, <code>globe</code>, <code>building</code>, <code>target</code>, <code>check</code>, <code>check-circle</code>, <code>code</code>, <code>rocket</code>, <code>clock</code>, <code>heart</code>, <code>info</code>, <code>sparkles</code>, <code>eye</code>, <code>trophy</code>, <code>users</code>, <code>home</code>, <code>search</code>, <code>plus</code>, <code>minus</code>, <code>close</code>, <code>arrow-right</code>, <code>external-link</code>, <code>share</code>, <code>download</code>, <code>upload</code>, <code>filter</code>, <code>mail</code>, <code>phone</code>, <code>bell</code>, <code>chat</code>, <code>bookmark</code>, <code>tag</code>, <code>folder</code>, <code>file</code>, <code>image</code>, <code>terminal</code>, <code>database</code>, <code>cloud</code>, <code>calendar</code>, <code>chart-bar</code>, <code>briefcase</code>, <code>link</code>, <code>lock</code>, <code>shield</code>, <code>flag</code>, <code>user</code>, <code>git-branch</code></p>

        <h3>Circle variant</h3>
        <p style="color:var(--muted);margin-bottom:8px">Add <code>circle=1</code> to render the icon inside a circular badge — icon is scaled down to 75% and placed on a semi-transparent background of the same color. Control background opacity with <code>opacity</code> (0–1, default <code>0.2</code>). Useful for profile READMEs and feature grids:</p>
        <pre><code>&lt;img height="40" src="${baseUrl}/icon?name=rocket&amp;color=0d87cd&amp;size=40&amp;circle=1" /&gt;
&lt;img height="40" src="${baseUrl}/icon?name=star&amp;color=5fe06a&amp;size=40&amp;circle=1&amp;opacity=0.15" /&gt;
&lt;img height="40" src="${baseUrl}/icon?name=heart&amp;color=e05f7a&amp;size=40&amp;circle=1&amp;opacity=0.35" /&gt;</code></pre>
        <div style="display:flex;gap:10px;flex-wrap:wrap;padding:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);margin-top:12px">
          <img src="${baseUrl}/icon?name=bolt&color=0d87cd&size=44&circle=1" alt="bolt" width="44" height="44">
          <img src="${baseUrl}/icon?name=rocket&color=5bb6ff&size=44&circle=1" alt="rocket" width="44" height="44">
          <img src="${baseUrl}/icon?name=star&color=5fe06a&size=44&circle=1" alt="star" width="44" height="44">
          <img src="${baseUrl}/icon?name=heart&color=e05f7a&size=44&circle=1" alt="heart" width="44" height="44">
          <img src="${baseUrl}/icon?name=code&color=f0c060&size=44&circle=1" alt="code" width="44" height="44">
          <img src="${baseUrl}/icon?name=globe&color=46e0d8&size=44&circle=1" alt="globe" width="44" height="44">
          <img src="${baseUrl}/icon?name=trophy&color=f0a030&size=44&circle=1" alt="trophy" width="44" height="44">
          <img src="${baseUrl}/icon?name=sparkles&color=c07af0&size=44&circle=1" alt="sparkles" width="44" height="44">
        </div>
      </section>

      <section id="theme">
        <h2>Theme Params</h2>
        <p style="color:var(--muted);margin-bottom:16px">All endpoints accept these URL query params. Hex values without the <code>#</code> prefix.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Param</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${themeParams.map(themeRow).join('')}
            </tbody>
          </table>
        </div>

        <h3>Examples</h3>
        <pre><code>${baseUrl}/langs?theme=light
${baseUrl}/langs?bg=0d1117&primary=58a6ff&text=c9d1d9&radius=6</code></pre>
      </section>

      <section id="deploy">
        <h2>Fork &amp; Deploy</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-body">
              <p>Fork the repo and clone it locally</p>
              <pre><code>git clone https://github.com/your-username/github-stats
cd github-stats
npm install</code></pre>
            </div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-body">
              <p>Create a GitHub personal access token with <code>read:user</code> and <code>repo</code> scopes, then add it as a Wrangler secret</p>
              <pre><code>npx wrangler secret put GITHUB_TOKEN</code></pre>
            </div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-body">
              <p>Add a token for the cache-bust endpoint</p>
              <pre><code>npx wrangler secret put CACHE_BUST_TOKEN</code></pre>
            </div>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <div class="step-body">
              <p>Update <code>OWNERS</code> in <code>src/index.ts</code> with your GitHub username(s), then deploy</p>
              <pre><code>npx wrangler deploy</code></pre>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="container" style="padding:0">
        github-stats &mdash; MIT &mdash;
        <a href="https://github.com/spokospace/github-stats">spokospace/github-stats</a>
        &mdash; built by <a href="https://spoko.space" rel="author">spoko.space — modern &amp; fast websites</a>
      </div>
    </footer>
  </div>
  <script>
(function(){
  var canvas=document.getElementById('heroCanvas');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var hero=canvas.closest('header');
  var reduceMq=window.matchMedia('(prefers-reduced-motion:reduce)');
  var reduce=reduceMq.matches;
  var W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2);
  var stars=[],enemies=[],shots=[],bursts=[];
  var ship,running=false,raf=0,fireCd=0,tick=0;
  var lastW=0,lastH=0;
  var C={ship:'#39a0f4',shipDk:'#1f86e0',laser:'#5bb6ff'};
  var SPECIES={
    crab:{color:'#46e0d8',cols:11,rows:8,frames:[
      ['00100000100','00010001000','00111111100','01101110110','11111111111','10111111101','10100000101','00011011000'],
      ['00100000100','10010001001','10111111101','11101110111','11111111111','00111111100','00100000100','01000000010']]},
    octopus:{color:'#999999',cols:12,rows:8,frames:[
      ['000011110000','001111111100','011111111110','111001001111','111111111111','000110011000','001101101100','110000000011'],
      ['000011110000','001111111100','011111111110','111001001111','111111111111','001110011100','011000001100','000011110000']]},
    squid:{color:'#5fe06a',cols:8,rows:8,frames:[
      ['00100100','01111110','11111111','11011011','11111111','00111100','01000010','00100100'],
      ['00100100','01111110','11111111','11011011','11111111','00111100','00100100','01011010']]},
  };
  function pickSpecies(){var r=Math.random();return r<0.42?'octopus':r<0.74?'crab':'squid';}
  function drawInvader(ctx,sp,frame,cx,cy,k){
    var sd=SPECIES[sp],p=sd.frames[frame];
    var ox=cx-sd.cols*k/2,oy=cy-sd.rows*k/2;
    for(var r=0;r<sd.rows;r++){var row=p[r];for(var c=0;c<sd.cols;c++){if(row.charCodeAt(c)===49)ctx.fillRect(ox+c*k,oy+r*k,k+0.4,k+0.4);}}
  }
  function drawFighter(ctx,tick){
    var f=5+Math.sin(tick*0.4)*1.6+Math.random()*2.4;
    ctx.fillStyle='rgba(120,200,255,.55)';
    ctx.beginPath();ctx.moveTo(-10,-3.1);ctx.lineTo(-10-f,0);ctx.lineTo(-10,3.1);ctx.closePath();ctx.fill();
    ctx.fillStyle=C.shipDk;
    ctx.beginPath();ctx.moveTo(1,-3);ctx.lineTo(-7,-12);ctx.lineTo(-11,-11);ctx.lineTo(-6,-3);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(1,3);ctx.lineTo(-7,12);ctx.lineTo(-11,11);ctx.lineTo(-6,3);ctx.closePath();ctx.fill();
    ctx.shadowColor='rgba(57,160,244,.7)';ctx.shadowBlur=12;ctx.fillStyle=C.ship;
    ctx.beginPath();ctx.moveTo(15,0);ctx.lineTo(2,-4.5);ctx.lineTo(-9,-4);ctx.lineTo(-12,-2.5);ctx.lineTo(-12,2.5);ctx.lineTo(-9,4);ctx.lineTo(2,4.5);ctx.closePath();ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle='#dff0ff';ctx.beginPath();ctx.ellipse(2.5,0,3,2,0,0,Math.PI*2);ctx.fill();
  }
  function R(a,b){return a+Math.random()*(b-a);}
  function size(){
    var rect=hero.getBoundingClientRect();
    var nW=Math.max(1,rect.width),nH=Math.max(1,rect.height);
    var wc=Math.abs(nW-lastW)>2,hc=Math.abs(nH-lastH)>1;
    if(!wc&&!hc&&ship)return;
    W=nW;H=nH;
    canvas.width=W*dpr;canvas.height=H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(wc||!ship){seed();}
    else if(hc&&lastH>0){var ratio=H/lastH;ship.y*=ratio;ship.ty*=ratio;}
    lastW=nW;lastH=nH;
  }
  function seed(){
    var n=Math.round(W*H/6500);stars=[];
    for(var i=0;i<n;i++)stars.push({x:R(0,W),y:R(0,H),s:R(.6,2.6),sp:R(.15,.95)});
    enemies=[];
    var en=Math.max(3,Math.round(W/520));
    for(var i=0;i<en;i++)enemies.push(spawnEnemy(true));
    if(!ship)ship={x:W*.16,y:H*.5,vx:1.1,vy:0,a:0,tx:W*.8,ty:H*.5,re:0};
  }
  function spawnEnemy(any){
    return{x:any?R(W*.45,W+60):W+R(20,120),y:R(H*.12,H*.9),vx:R(-.55,-.22),vy:R(-.12,.12),s:R(3,6),wob:R(0,6.28),sp:pickSpecies()};
  }
  function retarget(){ship.tx=R(W*.45,W*.96);ship.ty=R(H*.22,H*.8);ship.re=R(70,150);}
  function spawnBurst(x,y,col){
    bursts.push({x:x,y:y,r:3,ring:1,col:col});
    for(var i=0;i<11;i++){var a=Math.random()*6.28,s=R(.8,3.4);bursts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,sz:R(1.5,3),col:col});}
  }
  function step(){
    tick++;
    for(var i=0;i<stars.length;i++){var s=stars[i];s.x-=s.sp;if(s.x<-2){s.x=W+2;s.y=R(0,H);}}
    ship.re--;if(ship.re<=0||Math.hypot(ship.tx-ship.x,ship.ty-ship.y)<50)retarget();
    var ang=Math.atan2(ship.ty-ship.y,ship.tx-ship.x);
    ship.vx+=Math.cos(ang)*.02+.006;ship.vy+=Math.sin(ang)*.02;
    var sp2=Math.hypot(ship.vx,ship.vy),mx=1.35;
    if(sp2>mx){ship.vx*=mx/sp2;ship.vy*=mx/sp2;}
    ship.vx*=.99;ship.vy*=.97;ship.x+=ship.vx;ship.y+=ship.vy;
    if(ship.x>W+30){ship.x=-30;ship.y=R(H*.3,H*.7);}
    if(ship.x<-30)ship.x=W+30;
    if(ship.y<20){ship.y=20;ship.vy*=-.5;}
    if(ship.y>H-20){ship.y=H-20;ship.vy*=-.5;}
    ship.a=Math.atan2(ship.vy,ship.vx);
    fireCd--;
    if(fireCd<=0){fireCd=9;shots.push({x:ship.x+Math.cos(ship.a)*14,y:ship.y+Math.sin(ship.a)*14,vx:Math.cos(ship.a)*5.2,vy:Math.sin(ship.a)*5.2,a:ship.a,life:1});}
    for(var i=0;i<shots.length;i++){var sh=shots[i];sh.x+=sh.vx;sh.y+=sh.vy;sh.life-=.012;}
    for(var i=0;i<enemies.length;i++){
      var e=enemies[i];e.wob+=.03;e.x+=e.vx;e.y+=e.vy+Math.sin(e.wob)*.25;
      if(e.x<-40||e.y<-40||e.y>H+40){enemies[i]=spawnEnemy(false);continue;}
      for(var j=0;j<shots.length;j++){
        var sh2=shots[j];
        if(sh2.life>0&&Math.abs(sh2.x-e.x)<e.s+4&&Math.abs(sh2.y-e.y)<e.s+4){
          sh2.life=0;spawnBurst(e.x,e.y,SPECIES[e.sp].color);enemies[i]=spawnEnemy(false);break;
        }
      }
    }
    shots=shots.filter(function(s){return s.life>0&&s.x<W+20&&s.x>-20&&s.y>-20&&s.y<H+20;});
    for(var i=0;i<bursts.length;i++){var b=bursts[i];if(b.ring!==undefined){b.r+=2.3;b.ring-=.06;}else{b.x+=b.vx;b.y+=b.vy;b.vx*=.9;b.vy*=.9;b.life-=.035;}}
    bursts=bursts.filter(function(b){return b.ring!==undefined?b.ring>0:b.life>0;});
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<stars.length;i++){var s=stars[i],a=Math.min(s.s/3,0.85);ctx.fillStyle='rgba(226,237,250,'+a.toFixed(3)+')';ctx.fillRect(s.x,s.y,s.s,s.s);}
    ctx.globalAlpha=0.65;ctx.shadowBlur=7;
    for(var i=0;i<enemies.length;i++){
      var e=enemies[i],col=SPECIES[e.sp].color;
      ctx.fillStyle=col;ctx.shadowColor=col;
      drawInvader(ctx,e.sp,(Math.sin(e.wob*2)>0)?0:1,e.x,e.y,e.s/3.6);
    }
    ctx.shadowBlur=0;ctx.globalAlpha=1;
    ctx.lineCap='round';ctx.strokeStyle=C.laser;ctx.lineWidth=3;
    for(var i=0;i<shots.length;i++){
      var sh=shots[i];ctx.globalAlpha=Math.max(0,Math.min(1,sh.life));
      ctx.shadowColor='rgba(91,182,255,.8)';ctx.shadowBlur=8;
      ctx.beginPath();ctx.moveTo(sh.x,sh.y);ctx.lineTo(sh.x-Math.cos(sh.a)*9,sh.y-Math.sin(sh.a)*9);ctx.stroke();
    }
    ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.shadowBlur=7;
    for(var i=0;i<bursts.length;i++){
      var b=bursts[i];ctx.shadowColor=b.col;
      if(b.ring!==undefined){ctx.globalAlpha=Math.max(0,b.ring*.6);ctx.strokeStyle=b.col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,6.28);ctx.stroke();}
      else{ctx.globalAlpha=Math.max(0,b.life);ctx.fillStyle=b.col;ctx.fillRect(b.x-b.sz/2,b.y-b.sz/2,b.sz,b.sz);}
    }
    ctx.globalAlpha=1;ctx.shadowBlur=0;
    ctx.save();ctx.translate(ship.x,ship.y);ctx.rotate(ship.a);drawFighter(ctx,tick);ctx.restore();
  }
  function loop(){step();draw();raf=requestAnimationFrame(loop);}
  function start(){if(running||reduce)return;running=true;loop();}
  function stop(){running=false;cancelAnimationFrame(raf);}
  size();
  if(reduce){draw();}
  else{
    start();
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?start():stop();});},{threshold:0});
      io.observe(hero);
    }
  }
  var rt;
  function onResize(){clearTimeout(rt);rt=setTimeout(function(){dpr=Math.min(window.devicePixelRatio||1,2);size();if(reduce)draw();},120);}
  window.addEventListener('resize',onResize);
  if('ResizeObserver' in window){var ro=new ResizeObserver(onResize);ro.observe(hero);}
  if(reduceMq.addEventListener){reduceMq.addEventListener('change',function(e){reduce=e.matches;if(reduce){stop();draw();}else{start();}});}
})();
  </script>
</body>
</html>`;
}
