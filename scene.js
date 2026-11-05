(()=>{const box=document.getElementById('scene');if(!box||!window.THREE)return;const T=THREE;let ren;
try{ren=new T.WebGLRenderer({antialias:true,alpha:true})}catch(e){box.hidden=true;return}
ren.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(45,1,.1,100),g=new T.Group();cam.position.z=7.5;sc.add(g,new T.AmbientLight(0xffffff,.55));
const a=new T.PointLight(0xff4fa3,2.2,30),b=new T.PointLight(0x9b30ff,2.2,30);a.position.set(5,4,5);b.position.set(-5,-3,4);sc.add(a,b);
const gem=new T.Mesh(new T.IcosahedronGeometry(1.3,0),new T.MeshStandardMaterial({color:0xe6498f,metalness:.8,roughness:.2,flatShading:true}));
const rm=new T.MeshStandardMaterial({color:0xf3d9ff,metalness:1,roughness:.15}),r1=new T.Mesh(new T.TorusGeometry(2.1,.06,16,100),rm),r2=new T.Mesh(new T.TorusGeometry(2.8,.04,16,100),rm);r2.rotation.x=1.2;g.add(gem,r1,r2);
const pm=new T.MeshStandardMaterial({color:0xffffff,metalness:.3,roughness:.1}),pr=[];
for(let i=0;i<26;i++){const p=new T.Mesh(new T.SphereGeometry(.07+Math.random()*.09,16,16),pm);p.userData={a:Math.random()*6.28,r:2.5+Math.random()*1.5,s:.15+Math.random()*.35,y:(Math.random()-.5)*3};pr.push(p);g.add(p)}
let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
const size=()=>{const w=box.clientWidth,h=box.clientHeight;ren.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()};new ResizeObserver(size).observe(box);size();
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const tick=t=>{t*=.001;gem.rotation.set(t*.4,t*.6,0);r1.rotation.set(t*.3,t*.2,0);r2.rotation.z=t*.25;
pr.forEach(p=>{const d=p.userData,x=d.a+t*d.s;p.position.set(Math.cos(x)*d.r,d.y+Math.sin(t+d.a)*.2,Math.sin(x)*d.r)});
g.rotation.y+=(mx*1.2-g.rotation.y)*.05;g.rotation.x+=(my*.8-g.rotation.x)*.05;ren.render(sc,cam);if(!calm)requestAnimationFrame(tick)};requestAnimationFrame(tick);
})();
