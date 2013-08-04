var vmap = null;
function resize() {
var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;

document.getElementById('vmap').style.width = w + 'px';
document.getElementById('vmap').style.height = h + 'px';

if (vmap != null) vmap.Resize(w, h);
};

function load() {
vmap = new VEMap('vmap');
vmap.LoadMap();
}

window.onresize = resize;
