let tooltip = document.createElement("div");
tooltip.id = "tooltip";
tooltip.className = "framed";
tooltip.style.display = "none";

function tooltipHide() {
	tooltip.style.display = "none";
}

function tooltipShow(element, content) {
	tooltip.style.display = "";
	tooltip.innerHTML = content;
	
	let bounds = element.getBoundingClientRect();
	
	tooltip.style.top = bounds.bottom + 8 + "px";
	tooltip.style.left = bounds.left + bounds.width / 2 - tooltip.clientWidth / 2 + "px";
}



let woodchips = false;
let selected = null;

let level = 8;
let plotLimits = [
	[2, 2, 4, 4],
	[2, 2, 5, 4],
	[2, 2, 5, 5],
	[1, 2, 5, 5],
	[1, 1, 5, 5],
	[1, 1, 6, 5],
	[1, 1, 6, 6],
	[0, 1, 6, 6],
	[0, 0, 6, 6],
]

let plants = [];
let plantsById = {};

//hoisting mod stuff up here

var maxX = 6; var maxY = 6; var cdim = [6, 6]; var useLev = true; var ageSelected = 3; var importStr = '';
var tl = {0:'=',1:'a',2:'b',3:'c',4:'d',5:'e',6:'f',7:'g',8:'h',9:'i',10:'j',11:'k',12:'l',13:'m',14:'n',15:'o',16:'p',17:'q',18:'r',19:'s',20:'t',21:'u',22:'v',23:'w',24:'x',25:'y',26:'z',27:'!',28:'@',29:'#',30:'$',31:'%',32:'^',33:'&',34:'*',undefined:';',null:';'}; 
var rtl = Object.fromEntries(Object.entries(tl).map(([key, value]) => [value, key])); var ag = {undefined:'3',0:'0',1:'1',2:'2',3:'3',4:'4'}; 
var strIdToIndex = {}; var altLims = [0,[3,3],[3,4],[2,4],[2,5],[1,5],[1,6]]; var plotCSS = 28; 
for (let i in document.styleSheets[1].cssRules) { if (document.styleSheets[1].cssRules[i].selectorText == '#gardenPlot') { plotCSS = i; } }

class Plant {
	constructor(name, strId, icon, fungi) {
		this.name = name;
		this.strId = strId;
		this.icon = icon;
		this.fungi = fungi;
		
		this.id = plants.push(this) - 1;
		plantsById[strId] = this;
		
		this.element = document.createElement("div");
		this.element.classList.add("seed");
		this.iconElement = document.createElement("div");
		this.iconElement.classList.add("seed-icon");
		this.iconElement.style.backgroundPosition = "0px -" + this.icon * 48 + "px";
		this.element.appendChild(this.iconElement);
		this.element.addEventListener("click", () => {
			if (selected !== null) {
				plants[selected].deselect();
			}
			
			if (selected === this.id) {
				selected = null;
				return;
			}
			
			this.select();
			updatestages(this.id);
			selected = this.id;
		});
		this.element.addEventListener("mouseover", () => {
			tooltipShow(this.element,
				'<div style="padding:8px 4px;">' +
				'<div class="icon" style="background:url(images/gardenPlants.png);float:left;margin-left:-24px;margin-top:-4px;background-position:0px -' + this.icon * 48 + 'px;"></div>' +
				'<div class="icon" style="background:url(images/gardenPlants.png);float:left;margin-left:-24px;margin-top:-28px;background-position:-192px -' + this.icon * 48 + 'px;"></div>' +
				'<div style="background:url(images/turnInto.png);width:20px;height:22px;position:absolute;left:28px;top:24px;z-index:1000;"></div>' +
				'<div style="width:300px;"><div class="name">' + this.name + ' seed</div><div style="margin-left:54px;"><small>Click to select this seed for planting.</small></div></div>'
				//'<div class="line"></div>'
			);
		});
		this.element.addEventListener("mouseout", tooltipHide);
	}
	
	deselect() {
		this.element.classList.remove("selected");
	}
	
	select() {
		this.element.classList.add("selected");
	}
}

new Plant("Baker's wheat", "bakerWheat", 0, false);
new Plant("Thumbcorn", "thumbcorn", 1, false);
new Plant("Cronerice", "cronerice", 2, false);
new Plant("Gildmillet", "gildmillet", 3, false);
new Plant("Ordinary clover", "clover", 4, false);
new Plant("Golden clover", "goldenClover", 5, false);
new Plant("Shimmerlily", "shimmerlily", 6, false);
new Plant("Elderwort", "elderwort", 7, false);
new Plant("Bakeberry", "bakeberry", 8, false);
new Plant("Chocoroot", "chocoroot", 9, false);
new Plant("White chocoroot", "whiteChocoroot", 10, false);
new Plant("White mildew", "whiteMildew", 26, true);
new Plant("Brown mold", "brownMold", 27, true);
new Plant("Meddleweed", "meddleweed", 29, true);
new Plant("Whiskerbloom", "whiskerbloom", 11, false);
new Plant("Chimerose", "chimerose", 12, false);
new Plant("Nursetulip", "nursetulip", 13, false);
new Plant("Drowsyfern", "drowsyfern", 14, false);
new Plant("Wardlichen", "wardlichen", 15, false);
new Plant("Keenmoss", "keenmoss", 16, false);
new Plant("Queenbeet", "queenbeet", 17, false);
new Plant("Juicy queenbeet", "queenbeetLump", 18, false);
new Plant("Duketater", "duketater", 19, false);
new Plant("Crumbspore", "crumbspore", 20, true);
new Plant("Doughshroom", "doughshroom", 24, true);
new Plant("Glovemorel", "glovemorel", 21, true);
new Plant("Cheapcap", "cheapcap", 22, true);
new Plant("Fool's bolete", "foolBolete", 23, true);
new Plant("Wrinklegill", "wrinklegill", 25, true);
new Plant("Green rot", "greenRot", 28, true);
new Plant("Shriekbulb", "shriekbulb", 30, false);
new Plant("Tidygrass", "tidygrass", 31, false);
new Plant("Everdaisy", "everdaisy", 32, false);
new Plant("Ichorpuff", "ichorpuff", 33, true);


let mutations = [
	[{"bakerWheat": [2, 8]}, {"bakerWheat": 0.2, "thumbcorn": 0.05, "bakeberry": 0.001}],
	[{"bakerWheat": [1, 8], "thumbcorn": [1, 8]}, {"cronerice": 0.01}],
	[{"thumbcorn": [2, 8]}, {"thumbcorn": 0.1, "bakerWheat": 0.05}],
	[{"cronerice": [1, 8], "thumbcorn": [1, 8]}, {"gildmillet": 0.03}],
	[{"cronerice": [2, 8]}, {"thumbcorn": 0.02}],
	[{"bakerWheat": [1, 8], "gildmillet": [1, 8]}, {"clover": 0.03, "goldenClover": 0.0007}],
	[{"clover": [1, 8], "gildmillet": [1, 8]}, {"shimmerlily": 0.02}],
	[{"clover": [2, 4]}, {"clover": 0.007, "goldenClover": 0.0001}],
	[{"clover": [4, 8]}, {"goldenClover": 0.0007}],
	[{"shimmerlily": [1, 8], "cronerice": [1, 8]}, {"elderwort": 0.01}],
	[{"wrinklegill": [1, 8], "cronerice": [1, 8]}, {"elderwort": 0.002}],
	[{"bakerWheat": [1, 8], "brownMold": [1, 8]}, {"chocoroot": 0.1}],
	[{"chocoroot": [1, 8], "whiteMildew": [1, 8]}, {"whiteChocoroot": 0.1}],
	[{"whiteMildew": [1, 8], "brownMold": [0, 1]}, {"brownMold": 0.5}],
	[{"brownMold": [1, 8], "whiteMildew": [0, 1]}, {"whiteMildew": 0.5}],
	[{"meddleweed": [1, 3]}, {"meddleweed": 0.15}],
	
	[{"shimmerlily": [1, 8], "whiteChocoroot": [1, 8]}, {"whiskerbloom": 0.01}],
	[{"shimmerlily": [1, 8], "whiskerbloom": [1, 8]}, {"chimerose": 0.05}],
	[{"chimerose": [2, 8]}, {"chimerose": 0.005}],
	[{"whiskerbloom": [2, 8]}, {"nursetulip": 0.05}],
	[{"chocoroot": [1, 8], "keenmoss": [1, 8]}, {"drowsyfern": 0.005}],
	[{"cronerice": [1, 8], "keenmoss": [1, 8]}, {"wardlichen": 0.005}],
	[{"cronerice": [1, 8], "whiteMildew": [1, 8]}, {"wardlichen": 0.005}],
	[{"wardlichen": [1, 1]}, {"wardlichen": 0.05}],
	[{"greenRot": [1, 8], "brownMold": [1, 8]}, {"keenmoss": 0.1}],
	[{"keenmoss": [1, 1]}, {"keenmoss": 0.05}],
	[{"chocoroot": [1, 8], "bakeberry": [1, 8]}, {"queenbeet": 0.01}],
	[{"queenbeet": [8, 8]}, {"queenbeetLump": 0.001}],
	[{"queenbeet": [2, 8]}, {"duketater": 0.001}],
	
	[{"crumbspore": [1, 1]}, {"crumbspore": 0.07}],
	[{"crumbspore": [1, 8], "thumbcorn": [1, 8]}, {"glovemorel": 0.02}],
	[{"crumbspore": [1, 8], "shimmerlily": [1, 8]}, {"cheapcap": 0.04}],
	[{"doughshroom": [1, 8], "greenRot": [1, 8]}, {"foolBolete": 0.04}],
	[{"crumbspore": [2, 8]}, {"doughshroom": 0.005}],
	[{"doughshroom": [1, 1]}, {"doughshroom": 0.07}],
	[{"doughshroom": [2, 8]}, {"crumbspore": 0.005}],
	[{"crumbspore": [1, 8], "brownMold": [1, 8]}, {"wrinklegill": 0.06}],
	[{"whiteMildew": [1, 8], "clover": [1, 8]}, {"greenRot": 0.05}],
	
	[{"wrinklegill": [1, 8], "elderwort": [1, 8]}, {"shriekbulb": 0.001}],
	[{"elderwort": [5, 8]}, {"shriekbulb": 0.001}],
	[{"duketater": [3, 8]}, {"shriekbulb": 0.005}],
	[{"doughshroom": [4, 8]}, {"shriekbulb": 0.002}],
	[{"queenbeet": [5, 8]}, {"shriekbulb": 0.001}],
	[{"shriekbulb": [1, 1]}, {"shriekbulb": 0.005}],
	
	[{"bakerWheat": [1, 8], "whiteChocoroot": [1, 8]}, {"tidygrass": 0.002}],
	[{"tidygrass": [3, 8], "elderwort": [3, 8]}, {"everdaisy": 0.002}],
	[{"elderwort": [1, 8], "crumbspore": [1, 8]}, {"ichorpuff": 0.002}]
];

function randomListProb(list) {
	let out = new Array(list.length).fill(0);
	
	for (let i=1; i<1 << list.length; i++) {
		let prob = 1;
		let count = 0;
		for (let j=0; j<list.length; j++) {
			if (i & 1 << j) {
				count++;
				prob *= list[j];
			} else {
				prob *= 1 - list[j];
			}
		}
		prob /= count;
		for (let j=0; j<list.length; j++) {
			if (i & 1 << j) {
				out[j] += prob;
			}
		}
	}
	
	return out;
}

let plot = [];

function getTile(x, y) {
	if (x < 0 || y < 0 || x >= maxX || y >= maxY) {
		return null;
	}
	
	return plot[y * maxX + x].plant;
}

function updateStats() {
	document.getElementById("stats").innerHTML = "";
	
	let chances = {};
	for (let i=0; i<plants.length; i++) {
		chances[plants[i].strId] = [];
	}
	
	for (let y=0; y<maxY; y++) {
		for (let x=0; x<maxX; x++) {
			if (getTile(x, y) !== null) {
				continue;
			}
			
			if (
				x < plotLimits[level][0] ||
				y < plotLimits[level][1] ||
				x >= plotLimits[level][2] ||
				y >= plotLimits[level] [3]
			) {
				continue;
			}
			
			let neigh = {};
			for (let i=0; i<plants.length; i++) {
				neigh[plants[i].strId] = 0;
			}
			let alone = true;
			
			for (let yy=-1; yy<=1; yy++) {
				for (let xx=-1; xx<=1; xx++) {
					if (xx === 0 && yy === 0) continue;
					
					let tile = getTile(x + xx, y + yy);
					
					if (tile === null) continue;
					
					alone = false;
					
					neigh[plants[tile].strId]++;
				}
			}
			
			if (alone) {
				chances["meddleweed"].push((woodchips ? 0.1 : 1) * 0.002);
				continue;
			}
			
			let probs = [];
			let muts = [];
			
			loop:
			for (let i=0; i<mutations.length; i++) {
				for (let j in mutations[i][0]) {
					if (
						neigh[j] < mutations[i][0][j][0] ||
						neigh[j] > mutations[i][0][j][1]
					) {
						continue loop;
					}
				}
				
				for (let j in mutations[i][1]) {
					probs.push(mutations[i][1][j]);
					muts.push(j);
				}
			}
			
			if (probs.length === 0) continue;
			
			probs = randomListProb(probs);
			
			let noneChance = 1 - probs.reduce((a, b) => a + b);
			
			for (let i=0; i<muts.length; i++) {
				let prob = 0;
				if (woodchips) {
					for (let j=0; j<3; j++) {
						prob += probs[i] * Math.pow(noneChance, j);
					}
				} else {
					prob = probs[i];
				}
				chances[muts[i]].push(prob);
			}
		}
	}
	
	let none = true;
	for (let i in chances) {
		let chance = 1;
		for (let j=0; j<chances[i].length; j++) {
			chance *= 1 - chances[i][j];
		}
		chance = 1 - chance;
		
		if (chance === 0) continue;
		
		none = false;
		
		let plant = plantsById[i];
		
		let elem = document.createElement("div");
		elem.innerHTML = '<div class="icon" style="background:url(images/gardenPlants.png);vertical-align:middle;width:32px;height:32px;background-position:-8px -' + (plant.icon * 48 + 8) + 'px"></div>' +
			'<span style="vertical-align:middle;">' + (chance * 100).toFixed(7) + '%</span>';
		document.getElementById("stats").appendChild(elem);
	}
	
	if (none) {
		let elem = document.createElement("div");
		elem.innerHTML = "none";
		document.getElementById("stats").appendChild(elem);
	}
}

class Tile {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.age = 3;
		
		this.plant = null;
		
		this.element = document.createElement("div");
		this.element.classList.add("tile");
		
		this.icon = document.createElement("div");
		this.icon.classList.add("tile-icon");
		this.icon.style.display = "none";
		this.element.appendChild(this.icon);
		this.element.addEventListener("click", () => {
			if (this.plant !== null) {
				this.setPlant(null);
				return;
			}
			
			if (selected !== null) {
				this.setPlant(selected, false, ageSelected);
			}
		});
	}
	
	setPlant(id, skipUpdate, age) {
		this.plant = id;
		this.age = age;
		
		if (!skipUpdate) {
			updateStats();
		}
		
		if (id === null) {
			this.icon.style.display = "none";
			return;
		}
		
		this.icon.style.display = "";
		this.icon.style.opacity = decay(this.age);
		this.icon.style.backgroundPosition = sts(this.age)+"px -" + plants[id].icon * 48 + "px";
	}
	
	setDisabled(bool) {
		if (bool) {
			this.setPlant(null, true);
			this.element.classList.add("disabled");
		} else {
			this.element.classList.remove("disabled");
		}
	}
}

function generatePlot() {
	for (let y=0; y<Math.max(maxY,6); y++) {
		for (let x=0; x<Math.max(maxX,6); x++) {
			let tile = new Tile(x, y);
			document.getElementById("gardenPlot").appendChild(tile.element);
			plot.push(tile);
		}
	}
}

function updateLevel() {
	document.getElementById("level").textContent = level + 1;
	uplim(); 
	for (let i in plot) {
		plot[i].setDisabled(true);
	}
	
	for (let y=0; y<Math.max(6,gmfl(level)[1]); y++) {
		for (let x=0; x<Math.max(6,gmfl(level)[0]); x++) {
			let tile = plot[y * Math.max(6,gmfl(level)[0]) + x]; 
			if (level>=9 && useLev) { 
				setP(tile,x,y); continue;
			} else if (!useLev) { 
				setPAlt(tile,x,y); continue;  
			}
			if (
				x < plotLimits[level][0] ||
				y < plotLimits[level][1] ||
				x >= plotLimits[level][2] ||
				y >= plotLimits[level] [3]
			) {
				tile.setDisabled(true);
			} else {
				tile.setDisabled(false);
			}
		}
	}
	
	updateStats();
}

for (let i in plants) { 
	strIdToIndex[plants[i].strId] = plants[i].id; 
} 

function init() {
	document.body.appendChild(tooltip);
	
	generatePlot();
	
	for (let i=0; i<plants.length; i++) {
		document.getElementById("gardenSeeds").appendChild(plants[i].element);
	}
	
	document.getElementById("woodchips").addEventListener("click", function() {
		woodchips = !woodchips;
		this.className = woodchips ? "" : "disabled";
		
		updateStats();
	});
	document.getElementById("woodchips").addEventListener("mouseover", function() {
		tooltipShow(this,
			'<div style="min-width:350px;padding:8px;">' +
			'<div class="icon" style="background-image:url(images/gardenPlants.png);background-position:-192px -1632px;float:left;margin-left:-8px;margin-top:-8px;"></div>' +
			'<div><div class="name">Toggle wood chips</div></div>' +
			'<div class="line"></div>' +
			'<div class="description">Triples mutation rate when enabled.</div></div>'
		);
	});
	document.getElementById("woodchips").addEventListener("mouseout", function() {
		tooltipHide();
	});
	
	document.getElementById("level-sub").addEventListener("click", function() {
		level = Math.max(0, level - 1);

		if (!useLev) { 
			useLev = true; 
			crT(); 
		} 
		updateLevel();
		updateEffects(); 
		if (level >= 8) { 
			crT();
			updateLevel();
			updateEffects(); 
		} 
		if (level <= 8 && document.getElementById('warning').classList[0] != 'inactive') {
			document.getElementById('warning').classList.add('inactive');
		}
		if (level <= 20 && document.getElementById('captureWarning').classList[0] != 'inactive') {
			document.getElementById('captureWarning').classList.add('inactive');
		}
	});
	document.getElementById("level-add").addEventListener("click", function() {
		level++; 
		useLev = true; 
		if (glfm(maxX,maxY)<level) {
			crT();
		} 
		if (level > 8) {
			document.getElementById('warning').classList.remove('inactive');
		}
		if (level > 20) {
			document.getElementById('captureWarning').classList.remove('inactive');
		}
		updateLevel();
		updateEffects(); 
	});
	
	document.getElementById("clear").addEventListener("click", function() {
		for (let i=0; i<plot.length; i++) {
			plot[i].setPlant(null, true);
		}
		
		updateStats();
	});
	document.getElementById("clear").addEventListener("mouseover", function() {
		tooltipShow(this,
			'<div style="min-width:350px;padding:8px;">' +
			'<div class="icon" style="background-image:url(images/clear.png);float:left;margin-left:-8px;margin-top:-8px;"></div>' +
			'<div><div class="name">Clear garden</div></div>' +
			'<div class="line"></div>' +
			'<div class="description">Removes all plants from your garden.</div></div>'
		);
	});
	document.getElementById("clear").addEventListener("mouseout", function() {
		tooltipHide();
	});
	document.getElementById('importButton').addEventListener('click', function() { 
		load(document.getElementById('import').value); 
	}); 
	document.getElementById('exportButton').addEventListener('click', function() { 
		let code = save(); 
		let str = document.createElement('input'); 
		str.value = code; 
		document.body.appendChild(str); 
		str.select(); 
		str.setSelectionRange(0, code.length); 
		document.execCommand('copy'); 
		document.body.removeChild(str);
	});
	document.getElementById('resize').addEventListener('click', function() { 
		let r = function(input, def) { 
			if (input == '' || input == null || typeof input === 'undefined') {
				input = def;
			} 
			return parseP(input);
		}
		cdim = [
			Math.round(Math.max(r(document.getElementById('xDim').value, gmfl(level)[0]),1)), 
			Math.round(Math.max(r(document.getElementById('yDim').value, gmfl(level)[1]),1))
		];  
		resize(); 
	});
	document.getElementById('captureButton').addEventListener('click', function() {
		download();
	});
	document.getElementById('infoButton').addEventListener('click', function() {
		toggleDarkMode(true);
		document.getElementById('info').classList.remove('inactive');
	});
	document.getElementById('xCancel').addEventListener('click', function() {
		toggleDarkMode(false);
		document.getElementById('info').classList.add('inactive');
	});
	for (let i = 0; i < 5; i++) { 
		let target = document.getElementById('stage'+i); 
		target.addEventListener('click', function() { 
			if (ageSelected != i) { 
				document.getElementById('stage'+ageSelected).classList.remove('selected'); 
				ageSelected = i; 
				target.classList.add('selected')
			} 
		}); 
	}
	
	updateStats();

	loadTheMod();
}

//mod stuff below

function glfm(x,y) { return x + y - 4; }
function gmfl(l) { if (useLev) { l++; return [Math.floor(l/2)+2,Math.ceil(l/2)+1]; } else { return cdim; } }
function ggbx(l) { if (useLev) { return 240+40*Math.ceil((Math.max(l,8)-8)/2) } else { return Math.max(40*cdim[0], 240); } }
function ggby(l) { if (useLev) { return 240+40*Math.floor((Math.max(l,8)-8)/2) } else { return Math.max(40*cdim[1], 240); } }
function uplim() { document.documentElement.style.setProperty('--gardenWidth', ggbx(level).toString()+'px'); document.documentElement.style.setProperty('--gardenHeight', ggby(level).toString()+'px'); } 
function setP(tile,x,y) { if (x>=gmfl(level)[0]||y>=gmfl(level)[1]) {tile.setDisabled(true);} else {tile.setDisabled(false);}} 
function crT() {plot = []; document.getElementById('gardenPlot').innerHTML=''; maxX = gmfl(level)[0]; maxY = gmfl(level)[1]; generatePlot();}
function inR(x,y) { if (!useLev) { return inRAlt(x,y); } if (level<9||x>=gmfl(level)[0]||y>=gmfl(level)[1]) { return false; } return true; }
function sts(stage) { return -48*Math.min(stage,3)-48; } 
function decay(stage) { return (Math.max(stage-3,0))?0.5:1; }
function updatestages(holding) { if (holding !== null) { holding=plants[holding].icon; } else { return false; } for (let i = 0; i < 5; i++) { document.getElementById('stage'+i).getElementsByClassName('seed-icon')[0].style.backgroundPosition = sts(i)+"px -"+holding*48+"px"; document.getElementById('stage'+i).getElementsByClassName('seed-icon')[0].style.opacity = decay(i); }}
function checkNonmature(obj,which) { let k = Object.keys(obj); which = k.indexOf(which);if (which==1&&k[0]=='bakerWheat'&&k[1]=='brownMold') {return 0;} if (which==1&&k[0]=='chocoroot'&&k[1]=='whiteMildew') {return 0;} if (which==0&&k.length==1) { if (k[0]=='shriekbulb'||k[0]=='doughshroom'||k[0]=='duketater') { return 0; } } return 1;}
function mode(arr,items) { if (!Array.isArray(items)) { items = [items]; } let count = 0; for (let i in items) { for (let j in arr) { if (arr[j]==items[i]) { count++; } } } return count; } const mat = [3,4]; const imt = [0,1,2]; 
function getAge(x,y) {if (x < 0 || y < 0 || x >= maxX || y >= maxY || (plot[y*maxX+x].plant == null)) { return null; } return plot[y*maxX+x].age;} 
function updateEffects() { for (let i in plot) { plot[i].suppress = checkSup(plot[i].x,plot[i].y); } } 
function checkSup(x,y) { for (let yy = -2; yy <= 2; yy++) { for (let xx = -2; xx <= 2; xx++) { let t = getTile(x+xx,y+yy);if (xx==0&&yy==0) { continue; } if (t===31) { return 1; } if (t==32) { if (xx != 2 && xx != -2 && yy != 2 && yy != -2) { return 1; } } } } return 0; }
function parseP(input) { if (input === 'null') { return null; } return parseInt(input); } 
function save() { var strr = ''; if (useLev) { strr = level+'/'; } else { strr = cdim[0]+'/'+cdim[1]+'/'; } for (let i in plot) { strr+=tl[plot[i].plant]+ag[plot[i].age];} return strr; } 
function load(str) {
	let skip = false;
	if (str.includes('/')) { 
		str = str.split('/'); 
	} else if (str.includes('END%21')) {
		skip = true; useLev = true;
		str = unescape(str); str = str.replace('!END!',''); str = b64_to_utf8(str);
		str = str.split('|')[5]; str = str.split(';')[2]; level = Math.min(parseP(str.split(',')[3]) - 1, 8); str = str.split(',')[4]; str = str.split(' ')[2]; crT(); 
		st2 = str.split(':'); str = '';
		for (let i = 0; i < st2.length; i += 2) {
			str += tl[st2[i]]; str += '3';
		}
		console.log(str);
	} else {
		return false;
	}
	if (str.length == 2) { 
		level = parseP(str[0]); 
		useLev = true; crT(); 
	} else { 
		if (!skip) {
			cdim = [str[0],str[1]]; 
			useLev = false; 
			crT(); 
			maxX = Math.max(6,cdim[0]); 
			maxY = Math.max(6,cdim[1]); 
		}
	} 
	updateLevel(); 
	uplim(); 
	if (!skip) { str = str[str.length-1]; }
	for (let i = 0; i < str.length; i+=2) { 
		plot[i/2].setPlant(parseP(rtl[str[i]]), true, parseP(str[i+1]));
	} 
	updateStats(); 
} 
function b64_to_utf8(str) {
	try{return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''));}
	catch(err)
	{return '';}
}
function dd() { return document.createElement('div'); }
function resize() { document.getElementById('warning').classList.remove('inactive'); if(cdim[0]>12||cdim[1]>12) { document.getElementById('captureWarning').classList.remove('inactive'); } useLev = false; crT(); maxX = Math.max(6,cdim[0]); maxY = Math.max(6,cdim[1]); uplim(); updateLevel(); updateEffects(); updateStats(); } 
function setPAlt(tile, x, y) { if (inRAlt(x,y)) { tile.setDisabled(false); } else { tile.setDisabled(true); } } 
function inRAlt(x,y) { x++; y++; if (x>Math.max(6,cdim[0])||y>Math.max(6,cdim[1])) {return false;} if (cdim[0]<=6) { if (x<altLims[cdim[0]][0]||x>altLims[cdim[0]][1]) {return false;} } if (cdim[1]<=6) { if (y<altLims[cdim[1]][0]||y>altLims[cdim[1]][1]) {return false;} } return true; }
function download() { let g = document.getElementById('gardenPlot'); g.classList.add('gardenBG'); html2canvas(g).then(function(r) { promptToDownload(r); }); g.classList.remove('gardenBG'); } 
function promptToDownload(canvas) { let dataUrl = canvas.toDataURL(); let downloadLink = document.createElement('a'); downloadLink.href = dataUrl; downloadLink.download = 'garden.png'; document.body.appendChild(downloadLink); downloadLink.click(); document.body.removeChild(downloadLink); }
function toggleDarkMode(t) { 
	if (t) {
		document.documentElement.style.setProperty('--darken', 0.6);
	} else {
		document.documentElement.style.setProperty('--darken', 1);
	}
}

//gonna do this otherwise somehow it doesnt work???
uplim();

function loadTheMod() {
	//why did I do this to myself
	eval('updateStats='+updateStats.toString().replace('let neigh = {};','let neigh = {}; let neighAges = {};').replace('].strId] = 0;','].strId]=0; neighAges[plants[i].strId]=[];').replace('alone = false;', 'alone=false; neighAges[plants[tile].strId].push(getAge(x+xx,y+yy));').replace('if (alone)', 'if (alone && (!checkSup(x,y)))').replace('probs = [];','probs = []; let cs = !checkSup(x,y);').replace(updateStats.toString().slice(updateStats.toString().indexOf('loop:'),updateStats.toString().indexOf('if (probs.length === 0) continue;')), 'loop:\n\t\t\tfor (let i=0; i<mutations.length; i++) { for (let j in mutations[i][0]) { if ( (neigh[j]-(mutations[i][0][j][2]?mode(neighAges[j],imt):0))<mutations[i][0][j][0] || neigh[j]>mutations[i][0][j][1] ) { continue loop; } } for (let j in mutations[i][1]) { if ((!plants[strIdToIndex[j]].fungi) || cs) { probs.push(mutations[i][1][j]); muts.push(j); }}}')); 
	eval('var updateStatsA='+updateStats.toString().replace('function updateStats()','function()').replace('x < plotLimits[level][0] ||','(!inR(x,y))').replace('y < plotLimits[level][1] ||','').replace('x >= plotLimits[level][2] ||','').replace('y >= plotLimits[level] [3]','')); eval('updateStats='+updateStats.toString().replace('TML = "";','TML = "";if(level>=9||(!useLev)){updateStatsA();return false;}'));
	 
	for (let i in mutations) { for (let key in mutations[i][0]) { eval('mutations['+i+'][0].'+key+'.push('+checkNonmature(mutations[i][0],key)+')') } } 
}
		
window.addEventListener("DOMContentLoaded", init);
