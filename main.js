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

var maxX = 6; var maxY = 6; var cdim = [6, 6]; var useLev = true; var ageSelected = 3; var importStr = ''; var target = document.styleSheets.length - 1; //target is for fonts dying, usually 1
var tl = {0:'=',1:'a',2:'b',3:'c',4:'d',5:'e',6:'f',7:'g',8:'h',9:'i',10:'j',11:'k',12:'l',13:'m',14:'n',15:'o',16:'p',17:'q',18:'r',19:'s',20:'t',21:'u',22:'v',23:'w',24:'x',25:'y',26:'z',27:'!',28:'@',29:'#',30:'$',31:'%',32:'^',33:'&',34:'*',undefined:';',null:';'}; 
var rtl = Object.fromEntries(Object.entries(tl).map(([key, value]) => [value, key])); var ag = {undefined:'3',0:'0',1:'1',2:'2',3:'3',4:'4',100:'5',101:'6',102:'7',103:'8',104:'9'}; 
var strIdToIndex = {}; var altLims = [0,[3,3],[3,4],[2,4],[2,5],[1,5],[1,6]]; var plotCSS = 28; 
for (let i in document.styleSheets[target].cssRules) { if (document.styleSheets[target].cssRules[i].selectorText == '#gardenPlot') { plotCSS = i; } }

class Plant {
	constructor(name, strId, icon, fungi, mature, ageTick, ageTickR) {
		this.name = name;
		this.strId = strId;
		this.icon = icon;
		this.fungi = fungi;
		this.mature = mature;
		this.ageTick = ageTick;
		this.ageTickR = ageTickR;
		
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

	//this 'age' parameter is for the in-game age, which is 0-99
	getStage(age) {
		if (age < this.mature) {
			if (age >= this.mature*0.666) {
				return 2;
			} 
			if (age >= this.mature*0.333) {
				return 1;
			}
			return 0;
		} else {
			if (age + Math.ceil(this.ageTick + this.ageTickR) > 99) {
				return 4;
			}
			return 3;
		}
	}
}

new Plant("Baker's wheat", "bakerWheat", 0, false, 35, 7, 2);
new Plant("Thumbcorn", "thumbcorn", 1, false, 20, 6, 2);
new Plant("Cronerice", "cronerice", 2, false, 55, 0.4, 0.7);
new Plant("Gildmillet", "gildmillet", 3, false, 40, 2, 1.5);
new Plant("Ordinary clover", "clover", 4, false, 35, 1, 1.5);
new Plant("Golden clover", "goldenClover", 5, false, 50, 4, 12);
new Plant("Shimmerlily", "shimmerlily", 6, false, 70, 5, 6);
new Plant("Elderwort", "elderwort", 7, false, 90, 0.3, 0.5);
new Plant("Bakeberry", "bakeberry", 8, false, 50, 1, 1);
new Plant("Chocoroot", "chocoroot", 9, false, 25, 4, 0);
new Plant("White chocoroot", "whiteChocoroot", 10, false, 25, 4, 0);
new Plant("White mildew", "whiteMildew", 26, true, 70, 8, 12);
new Plant("Brown mold", "brownMold", 27, true, 70, 8, 12);
new Plant("Meddleweed", "meddleweed", 29, true, 50, 10, 6);
new Plant("Whiskerbloom", "whiskerbloom", 11, false, 60, 2, 2);
new Plant("Chimerose", "chimerose", 12, false, 30, 1, 1.5);
new Plant("Nursetulip", "nursetulip", 13, false, 60, 0.5, 2);
new Plant("Drowsyfern", "drowsyfern", 14, false, 30, 0.05, 0.1);
new Plant("Wardlichen", "wardlichen", 15, false, 65, 5, 4);
new Plant("Keenmoss", "keenmoss", 16, false, 65, 4, 5);
new Plant("Queenbeet", "queenbeet", 17, false, 80, 1, 0.4);
new Plant("Juicy queenbeet", "queenbeetLump", 18, false, 85, 0.04, 0.08);
new Plant("Duketater", "duketater", 19, false, 95, 0.4, 0.1);
new Plant("Crumbspore", "crumbspore", 20, true, 65, 3, 3);
new Plant("Doughshroom", "doughshroom", 24, true, 85, 1, 2);
new Plant("Glovemorel", "glovemorel", 21, true, 80, 3, 18);
new Plant("Cheapcap", "cheapcap", 22, true, 40, 6, 16);
new Plant("Fool's bolete", "foolBolete", 23, true, 50, 5, 25);
new Plant("Wrinklegill", "wrinklegill", 25, true, 65, 1, 3);
new Plant("Green rot", "greenRot", 28, true, 65, 12, 13);
new Plant("Shriekbulb", "shriekbulb", 30, false, 60, 3, 1);
new Plant("Tidygrass", "tidygrass", 31, false, 40, 0.5, 0);
new Plant("Everdaisy", "everdaisy", 32, false, 75, 0.3, 0);
new Plant("Ichorpuff", "ichorpuff", 33, true, 35, 1, 1.5);

plants[null] = {'deselect':()=>{}}; // thanks.

window.addEventListener("DOMContentLoaded", ()=>{
	// modified from orteils code.
	document.getElementById('import').addEventListener('keydown',function(e){
		if (e.keyCode!=13)
		{
			e.stopPropagation();
		}
		else document.getElementById('importPromptButton').click();
	},true);
	
	document.getElementById('xDim').addEventListener('keydown',function(e){
		if (e.keyCode!=13)
		{
			e.stopPropagation();
		}
		else {
			yDim.focus();
			yDim.click();
		}
	},true);
	
	document.getElementById('yDim').addEventListener('keydown',function(e){
		if (e.keyCode!=13)
		{
			e.stopPropagation();
		}
		else document.getElementById('resize').click();
	},true);
	
	var keys=[];
	window.addEventListener('keyup',function(e){
		keys[e.keyCode]=0;
	});
	
	window.addEventListener('keydown',function(e){
		if (e.keyCode==9)
		{
			var next;
			//tab to shift through ages
			if (e.shiftKey) next = (ageSelected + 4) % 5;
			else next = (ageSelected + 1) % 5;
			eval(`stage${next}.click()`); // i'm lazy ok
			e.preventDefault();
		}
		else if (e.keyCode==37)
		{
			var next;
			if (!e.shiftKey) {
				if (selected != null) next = selected - (selected % 7) + (((selected % 7) + 6) % 7);
				else next = 0;
				if (next == 34) next = 33;
				plants[selected].deselect();
				selected = next;
				plants[selected].select();
				updatestages(selected);
				e.preventDefault();
			}
			else {
				next = (ageSelected + 4) % 5;
				eval(`stage${next}.click()`); // i'm lazy ok
			}
		}
		else if (e.keyCode==39)
		{
			var next;
			if (!e.shiftKey) {
				if (selected != null) next = selected - (selected % 7) + (((selected % 7) + 1) % 7);
				else next = 0;
				if (next == 34) next = 28;
				plants[selected].deselect();
				selected = next;
				plants[selected].select();
				updatestages(selected);
				e.preventDefault();
			}
			else {
				next = (ageSelected + 1) % 5;
				eval(`stage${next}.click()`); // i'm lazy ok
			}
		}
		else if (e.keyCode==38)
		{
			var next;
			if (selected != null) next = (selected % 7) + (((Math.floor(selected/7) % 5) + 4) % 5) * 7;
			else next = 0;
			if (next == 34) next = 27;
			plants[selected].deselect();
			selected = next;
			plants[selected].select();
			updatestages(selected);
			e.preventDefault();
		}
		else if (e.keyCode==40)
		{
			var next;
			if (selected != null) next = (selected % 7) + (((Math.floor(selected/7) % 5) + 1) % 5) * 7;
			else next = 0;
			if (next == 34) next = 6;
			plants[selected].deselect();
			selected = next;
			plants[selected].select();
			updatestages(selected);
			e.preventDefault();
		}
		else if (e.keyCode==65)
		{
			var next;
			if (selected != null) next = selected - (selected % 7) + (((selected % 7) + 6) % 7);
			else next = 0;
			if (next == 34) next = 33;
			plants[selected].deselect();
			selected = next;
			plants[selected].select();
			updatestages(selected);
			e.preventDefault();
		}
		else if (e.keyCode==68)
		{
			var next;
			if (selected != null) next = selected - (selected % 7) + (((selected % 7) + 1) % 7);
			else next = 0;
			if (next == 34) next = 28;
			plants[selected].deselect();
			selected = next;
			plants[selected].select();
			updatestages(selected);
			e.preventDefault();
		}
		else if (e.keyCode==87)
		{
			var next;
			if (selected != null) next = (selected % 7) + (((Math.floor(selected/7) % 5) + 4) % 5) * 7;
			else next = 0;
			if (next == 34) next = 27;
			plants[selected].deselect();
			selected = next;
			plants[selected].select();
			updatestages(selected);
			e.preventDefault();
		}
		else if (e.keyCode==83)
		{
			var next;
			if (selected != null) next = (selected % 7) + (((Math.floor(selected/7) % 5) + 1) % 5) * 7;
			else next = 0;
			if (next == 34) next = 6;
			plants[selected].deselect();
			selected = next;
			plants[selected].select();
			updatestages(selected);
			e.preventDefault();
		}
		keys[e.keyCode]=1;
	});
	
	window.addEventListener('visibilitychange',function(e){
		keys=[];//reset all key pressed on visibility change (should help prevent ctrl still being down after ctrl-tab)
	});
});

let mutations = [
	[{"bakerWheat": [2, 8, 1]}, {"bakerWheat": 0.2, "thumbcorn": 0.05, "bakeberry": 0.001}],
	[{"bakerWheat": [1, 8, 1], "thumbcorn": [1, 8, 1]}, {"cronerice": 0.01}],
	[{"thumbcorn": [2, 8, 1]}, {"thumbcorn": 0.1, "bakerWheat": 0.05}],
	[{"cronerice": [1, 8, 1], "thumbcorn": [1, 8, 1]}, {"gildmillet": 0.03}],
	[{"cronerice": [2, 8, 1]}, {"thumbcorn": 0.02}],
	[{"bakerWheat": [1, 8, 1], "gildmillet": [1, 8, 1]}, {"clover": 0.03, "goldenClover": 0.0007}],
	[{"clover": [1, 8, 1], "gildmillet": [1, 8, 1]}, {"shimmerlily": 0.02}],
	[{"clover": [2, 4, 1]}, {"clover": 0.007, "goldenClover": 0.0001}],
	[{"clover": [4, 8, 1]}, {"goldenClover": 0.0007}],
	[{"shimmerlily": [1, 8, 1], "cronerice": [1, 8, 1]}, {"elderwort": 0.01}],
	[{"wrinklegill": [1, 8, 1], "cronerice": [1, 8, 1]}, {"elderwort": 0.002}],
	[{"bakerWheat": [1, 8, 1], "brownMold": [1, 8, 0]}, {"chocoroot": 0.1}],
	[{"chocoroot": [1, 8, 1], "whiteMildew": [1, 8, 0]}, {"whiteChocoroot": 0.1}],
	[{"whiteMildew": [1, 8, 1], "brownMold": [0, 1, 0]}, {"brownMold": 0.5}],
	[{"brownMold": [1, 8, 1], "whiteMildew": [0, 1, 0]}, {"whiteMildew": 0.5}],
	[{"meddleweed": [1, 3, 1]}, {"meddleweed": 0.15}],
	
	[{"shimmerlily": [1, 8, 1], "whiteChocoroot": [1, 8, 1]}, {"whiskerbloom": 0.01}],
	[{"shimmerlily": [1, 8, 1], "whiskerbloom": [1, 8, 1]}, {"chimerose": 0.05}],
	[{"chimerose": [2, 8, 1]}, {"chimerose": 0.005}],
	[{"whiskerbloom": [2, 8, 1]}, {"nursetulip": 0.05}],
	[{"chocoroot": [1, 8, 1], "keenmoss": [1, 8, 1]}, {"drowsyfern": 0.005}],
	[{"cronerice": [1, 8, 1], "keenmoss": [1, 8, 1]}, {"wardlichen": 0.005}],
	[{"cronerice": [1, 8, 1], "whiteMildew": [1, 8, 1]}, {"wardlichen": 0.005}],
	[{"wardlichen": [1, 1, 1]}, {"wardlichen": 0.05}],
	[{"greenRot": [1, 8, 1], "brownMold": [1, 8, 1]}, {"keenmoss": 0.1}],
	[{"keenmoss": [1, 1, 1]}, {"keenmoss": 0.05}],
	[{"chocoroot": [1, 8, 1], "bakeberry": [1, 8, 1]}, {"queenbeet": 0.01}],
	[{"queenbeet": [8, 8, 1]}, {"queenbeetLump": 0.001}],
	[{"queenbeet": [2, 8, 1]}, {"duketater": 0.001}],
	
	[{"crumbspore": [1, 1, 1]}, {"crumbspore": 0.07}],
	[{"crumbspore": [1, 8, 1], "thumbcorn": [1, 8, 1]}, {"glovemorel": 0.02}],
	[{"crumbspore": [1, 8, 1], "shimmerlily": [1, 8, 1]}, {"cheapcap": 0.04}],
	[{"doughshroom": [1, 8, 1], "greenRot": [1, 8, 1]}, {"foolBolete": 0.04}],
	[{"crumbspore": [2, 8, 1]}, {"doughshroom": 0.005}],
	[{"doughshroom": [1, 1, 1]}, {"doughshroom": 0.07}],
	[{"doughshroom": [2, 8, 1]}, {"crumbspore": 0.005}],
	[{"crumbspore": [1, 8, 1], "brownMold": [1, 8, 1]}, {"wrinklegill": 0.06}],
	[{"whiteMildew": [1, 8, 1], "clover": [1, 8, 1]}, {"greenRot": 0.05}],
	
	[{"wrinklegill": [1, 8, 1], "elderwort": [1, 8, 1]}, {"shriekbulb": 0.001}],
	[{"elderwort": [5, 8, 1]}, {"shriekbulb": 0.001}],
	[{"duketater": [3, 8, 0]}, {"shriekbulb": 0.005}],
	[{"doughshroom": [4, 8, 0]}, {"shriekbulb": 0.002}],
	[{"queenbeet": [5, 8, 1]}, {"shriekbulb": 0.001}],
	[{"shriekbulb": [1, 1, 0]}, {"shriekbulb": 0.005}],
	
	[{"bakerWheat": [1, 8, 1], "whiteChocoroot": [1, 8, 1]}, {"tidygrass": 0.002}],
	[{"tidygrass": [3, 8, 1], "elderwort": [3, 8, 1]}, {"everdaisy": 0.002}],
	[{"elderwort": [1, 8, 1], "crumbspore": [1, 8, 1]}, {"ichorpuff": 0.002}]
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

	let functionalLoops = 1; 
	if (leftToggleableStatuses.si) { functionalLoops += 1.05; }
	if (leftToggleableStatuses.si) { functionalLoops += 1.005; }
	if (leftToggleableStatuses.woodchips) { functionalLoops *= 3; }
	
	for (let y=0; y<maxY; y++) {
		for (let x=0; x<maxX; x++) {
			if (getTile(x, y) !== null || plot[y * maxX + x].isNull) {
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
				chances["meddleweed"].push((leftToggleableStatuses.woodchips ? 0.1 : 1) * 0.002);
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

			let repeats = {};
			for (let i=0; i<plants.length; i++) {
				repeats[plants[i].strId] = -1; //-1 for not existing, if it is not -1 then it represents index
			}
			for (let i=0; i < probs.length; i++) {
				if (repeats[muts[i]] >= 0) {
					probs[repeats[muts[i]]] = 1 - (1 - probs[repeats[muts[i]]]) * (1 - probs[i]);
					probs.splice(i, 1);
					muts.splice(i, 1);
				} else {
					repeats[muts[i]] = i;
				}
			}
			
			probs = randomListProb(probs);
			
			let noneChance = 1 - probs.reduce((a, b) => a + b); //1 - the sum of all values in probs
			
			for (let i=0; i<muts.length; i++) {
				let prob = 0;
				/*
				if (leftToggleableStatuses.woodchips) {
					for (let j=0; j<3; j++) {
						prob += probs[i] * Math.pow(noneChance, j);
					}
				} else {
					prob = probs[i];
				}
				*/
				prob += probs[i] * ((1 - Math.pow(noneChance, functionalLoops)) / (1 - noneChance)); 
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
		this.isNull = false;
		
		this.plant = null;
		
		this.element = document.createElement("div");
		this.element.classList.add("tile");
		
		this.icon = document.createElement("div");
		this.icon.classList.add("tile-icon");
		this.icon.style.display = "none";
		this.element.appendChild(this.icon);
		this.element.addEventListener("click", e => {
			if (e.shiftKey && leftToggleableStatuses.nullTile) {
				this.setNull(!this.isNull);
				return;
			}
			
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

	setNull(bool, skipUpdate) {
		this.isNull = bool;
		this.element.classList.remove('tile');
		this.element.classList.remove('invisTile');
		if (this.isNull) {
			this.element.classList.add('invisTile');
		} else {
			this.element.classList.add('tile');
		}
		if (!skipUpdate) { updateStats(); }
	}

	activeStatus() {
		if (this.element.classList.value.includes('disabled')) {
			return false;
		}
		return true;
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

var cachedSave = '';

//not braining rn
function getKeepBoundary(newSize, original, preLev) {
	//order: right first, then clockwise
	//format: [left bound, right bound, up bound, down bound]
	let order = 0; //0 is right, 1 is down, etc.
	if (preLev) {
		order = (preLev + 3) % 4; 
	}
	let bound = [0, original[0] - 1, 0, original[1] - 1];

	if (order == 0 || order == 2) {
		let temp = adjustHorizontal(newSize, original, bound, order);
		bound = temp[0];
		order = temp[1] + 3;
		order = order % 4;
		bound = adjustVertical(newSize, original, bound, order)[0];
	} else {
		let temp = adjustVertical(newSize, original, bound, order);
		bound = temp[0];
		order = temp[1] + 3;
		order = order % 4;
		bound = adjustHorizontal(newSize, original, bound, order)[0];
	}
	return bound;
}

function adjustHorizontal(newSize, original, bound, order) {
	if (newSize[0] == original[0]) { return [bound, order]; }
	let leftComplete = false;
	let rightComplete = false;
	for (let i = 0; i < 10000; i++) {
		if (newSize[0] < original[0]) {
			let newBound = sliceSide(bound, order);
			if (newBound[1] - newBound[0] >= newSize[0]) { bound = newBound; continue; } else {
				if (order == 0) { rightComplete = true; } else { leftComplete = true; }
			}
		}
		else if (newSize[0] > original[0]) {
			if (bound[1] + 1 <= newSize[0]) { bound[1]++; } else { completionCounter++; }
		}
		if (leftComplete && rightComplete) {
			return [bound, order];
		}

		order += 2; order = order % 4;
	}
	return [bound, order];
}

function adjustVertical(newSize, original, bound, order) {
	if (newSize[1] == original[1]) { return [bound, order]; }
	let topComplete = false;
	let bottomComplete = false;
	for (let i = 0; i < 10000; i++) {
		if (newSize[1] < original[1]) {
			let newBound = sliceSide(bound, order);
			if (newBound[3] - newBound[2] >= newSize[1]) { bound = newBound; continue; } else {
				if (order == 1) { bottomComplete = true; } else { topComplete = true; }
			}
		}
		else if (newSize[0] > original[0]) {
			if (bound[3] + 1 <= newSize[1]) { bound[3]++; } else { completionCounter++; }
		}
		if (bottomComplete && topComplete) {
			return [bound, order];
		}

		order += 2; order = order % 4;
	}
	return [bound, order];
}

var orderToArr = {
	0: 1,
	1: 3,
	2: 0,
	3: 2
}

function sliceSide(arr, order) {
	if (order == 0) {
		arr[1] = Math.max(arr[1] - 1, arr[0] + 1);
		return arr;
	} else if (order == 1) {
		arr[3] = Math.max(arr[3] - 1, arr[2] + 1);
		return arr;
	} else if (order == 2) {
		arr[0] = Math.min(arr[0] + 1, arr[1] - 1);
		return arr;
	} else if (order == 3) {
		arr[2] = Math.min(arr[2] + 1, arr[3] - 1);
		return arr;
	}
	console.log('something went wrong in function sliceSide');
	return false;
}

var leftToggleableStatuses = {};
var leftOn = 0;
var rightOn = 0;
const leftToggleableList = [{
	id: 'woodchips',
	image: 'images/gardenPlants.png',
	posX: -192,
	posY: -1632,
	name: 'Toggle wood chips',
	desc: 'Triples mutation rate when enabled, but also reduces the chance of weed spawns by 90%.'
}, {
	id: 'si',
	image: 'images/icons.png',
	posX: -34*48,
	posY: -25*48,
	name: 'Toggle Supreme Intellect',
	desc: 'Increases mutation rate by 5% when enabled.'
}, {
	id: 'rb',
	image: 'images/icons.png',
	posX: -32*48,
	posY: -25*48,
	name: 'Toggle Reality Bending',
	desc: 'Increases mutation rate by 10% of Supreme Intellect when enabled. Stacks additively with Supreme Intellect.'
}, {
	id: 'nullTile',
	image: 'images/null_tile_toggle.png',
	name: 'Toggle null tiles',
	desc: 'Toggling this on allows you to turn tiles null by shift-clicking them.<br>Note: null tiles do not exist in-game.'
}];
const rightActivatableList = [{
	id: 'clear',
	image: 'images/clear.png',
	name: 'Clear garden',
	desc: 'Removes all plants from your garden.<br>Shift-click to clear all null tiles, or toggle all null tiles if there are none present.',
	func: function(e) {
		if (e.shiftKey) {
			let hasNulls = false;
			for (let i=0; i<plot.length; i++) {
				if (plot[i].isNull) { hasNulls = true; break; }
			}
			for (let i=0; i<plot.length; i++) {
				plot[i].setNull(!hasNulls);
			} 
		} else {
			for (let i=0; i<plot.length; i++) {
				plot[i].setPlant(null, true);
			}
		}
	}
}];
function createAllTools() {
	document.getElementById('leftToggleable').addEventListener('click', function() {
		updateStats();
	});
	document.getElementById('rightActivatable').addEventListener('click', function() {
		updateStats();
	});

	//create all tools
	let leftToggleableInnerHTML = '';
	for (let i in leftToggleableList) {
		let me = leftToggleableList[i];
		leftToggleableStatuses[me.id] = me.defaultState??false;
		leftToggleableInnerHTML += '<button id="'+me.id+'" class="'+(leftToggleableStatuses[me.id]?'':'toggleOff')+'" style="width:48px;height:48px;float:left;background: url('+me.image+');background-position:'+(me.posX??0)+'px '+(me.posY??0)+'px;border:none;display:none;"></button>';
	}
	document.getElementById('leftToggleable').innerHTML = leftToggleableInnerHTML;
	for (let i in leftToggleableList) {
		let me = leftToggleableList[i];
		document.getElementById(me.id).addEventListener('click', function() {
			leftToggleableStatuses[me.id] = !leftToggleableStatuses[me.id];
			document.getElementById(me.id).className = leftToggleableStatuses[me.id] ? '' : 'toggleOff';
		});
		if (me.func) {
			document.getElementById(me.id).addEventListener('click', function(e) { me.func(e); });
		}
		document.getElementById(me.id).addEventListener('mouseout', function() { tooltipHide(); });
		document.getElementById(me.id).addEventListener('mouseover', function() {
			tooltipShow(document.getElementById(me.id), 
				'<div style="min-width:350px;padding:8px;">' +
				'<div class="icon" style="background-image:url('+me.image+');background-position:'+(me.posX??0)+'px '+(me.posY??0)+'px;float:left;margin-left:-4px;margin-top:-4px;"></div>' +
				'<div><div class="name">'+me.name+'</div></div>' +
				'<div class="line"></div>' +
				'<div class="description">'+me.desc+'</div></div>'	
			);
		});
	}
	let rightActivatableInnerHTML = '';
	for (let i in rightActivatableList) {
		let me = rightActivatableList[i];
		rightActivatableInnerHTML += '<button id="'+me.id+'" class="'+(leftToggleableStatuses[me.id]?'':'iconDisabled')+'" style="width:48px;height:48px;float:left;background: url('+me.image+');background-position:'+(me.posX??0)+'px '+(me.posY??0)+'px;border:none;display:none;"></button>';
	}
	document.getElementById('rightActivatable').innerHTML = rightActivatableInnerHTML;
	for (let i in rightActivatableList) {
		let me = rightActivatableList[i];
		document.getElementById(me.id).addEventListener('click', function(e) { me.func(e); });
		document.getElementById(me.id).addEventListener('mouseout', function() { tooltipHide(); });
		document.getElementById(me.id).addEventListener('mouseover', function() {
			tooltipShow(document.getElementById(me.id), 
				'<div style="min-width:350px;padding:8px;">' +
				'<div class="icon" style="background-image:url('+me.image+');background-position:'+(me.posX??0)+'px '+(me.posY??0)+'px;float:left;margin-left:-4px;margin-top:-4px;"></div>' +
				'<div><div class="name">'+me.name+'</div></div>' +
				'<div class="line"></div>' +
				'<div class="description">'+me.desc+'</div></div>'	
			);
		});
	}

	document.getElementById(leftToggleableList[leftOn].id).style.display = '';
	document.getElementById(leftToggleableList[leftOn].id).className = 'toggleOff';
	document.getElementById(rightActivatableList[rightOn].id).style.display = '';
}
function cycleLeft(reversed) {
	document.getElementById(leftToggleableList[leftOn].id).style.display = 'none';
	if (reversed) { leftOn--; } else { leftOn++; }
	if (leftOn >= leftToggleableList.length) { leftOn = 0; }
	if (leftOn < 0) { leftOn = leftToggleableList.length - 1; }
	document.getElementById(leftToggleableList[leftOn].id).style.display = '';
}
function cycleRight(reversed) {
	document.getElementById(rightActivatableList[rightOn].id).style.display = 'none';
	if (reversed) { rightOn--; } else { rightOn++; }
	if (rightOn >= rightActivatableList.length) { rightOn = 0; }
	if (rightOn < 0) { rightOn = rightActivatableList.length - 1; }
	document.getElementById(rightActivatableList[rightOn].id).style.display = '';
}

function init() {
	document.body.appendChild(tooltip);
	
	generatePlot();
	
	for (let i=0; i<plants.length; i++) {
		document.getElementById("gardenSeeds").appendChild(plants[i].element);
	}

	document.getElementById('gardenMask').addEventListener('click', function() {
		closePrompt();
	});
	document.getElementById('mid').addEventListener('mousedown', function(e) { if (e.shiftKey) { e.preventDefault(); } });

	createAllTools();
	
	document.getElementById("level-sub").addEventListener("click", function() {
		cachedSave = save(); 
		
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
		cachedSave = save();
		
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
	
	document.getElementById('importButton').addEventListener('click', function() { 
		triggerPrompt('import');
		document.getElementById('textareaPrompt').focus();
		document.getElementById('textareaPrompt').value = '';
	}); 
	document.getElementById('importPromptButton').addEventListener('click', function() {
		load(document.getElementById('textareaPrompt').value); 
		document.getElementById('textareaPrompt').value = '';
		closePrompt();
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
		cachedSave = save();
		
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
	document.getElementById('cycleSet').addEventListener('mouseover', function() {
		tooltipShow(this,
			'<div style="min-width:350px;padding:8px;">' +
			'<div class="description">Cycles the tools on the left and right of the leveling box.<br>(Alternative hotkey: Z for left, C for right; Shift to cycle the opposite direction)</div></div>'
		);
	});
	document.getElementById("cycleSet").addEventListener("mouseout", function() {
		tooltipHide();
	});
	document.getElementById("cycleLeft").addEventListener('click', function(e) {
		cycleLeft(e.shiftKey);
	});
	document.getElementById("cycleRight").addEventListener('click', function(e) {
		cycleRight(e.shiftKey);
	});
	document.addEventListener('keydown', function(e) {
		if (e.key.toLowerCase() != 'z' && e.key.toLowerCase() != 'c') { return; }
		if (e.key.toLowerCase() == 'z') { cycleLeft(e.shiftKey); }
		else if (e.key.toLowerCase() == 'c') { cycleRight(e.shiftKey); }
	});
	document.getElementById('infoButton').addEventListener('click', function() {
		triggerPrompt('info');
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

function triggerPrompt(id) {
	toggleDarkMode(true);
	document.getElementById(id).classList.remove('inactive');
	document.getElementById('gardenMask').style.display = '';
}
function closePrompt() {
	toggleDarkMode(false);
	const promptAnchor = document.getElementById('promptAnchor');
	for (let i = 0; i < promptAnchor.children.length; i++) {
		promptAnchor.children[i].classList.remove('inactive');
		promptAnchor.children[i].classList.add('inactive');
	}
	document.getElementById('gardenMask').style.display = 'none';
}

//mod stuff below

function glfm(x,y) { return x + y - 4; }
function gmfl(l) { if (useLev) { l++; return [Math.floor(l/2)+2,Math.ceil(l/2)+1]; } else { return cdim; } }
function ggbx(l) { if (useLev) { return 240+40*Math.ceil((Math.max(l,8)-8)/2) } else { return Math.max(40*cdim[0], 240); } }
function ggby(l) { if (useLev) { return 240+40*Math.floor((Math.max(l,8)-8)/2) } else { return Math.max(40*cdim[1], 240); } }
function uplim() { 
	document.documentElement.style.setProperty('--gardenWidth', ggbx(level).toString()+'px'); 
	document.documentElement.style.setProperty('--gardenHeight', ggby(level).toString()+'px'); 
	try { 
		if (ggby(level) > window.innerHeight) { document.getElementById('container').style.transform = 'translateY(0%)'; document.getElementById('container').style.top = '0%'; } else { document.getElementById('container').style.transform = 'translateY(-50%)'; document.getElementById('container').style.top = '50%'; } 
		document.getElementById('gardenBGDiv').style.width = document.getElementById('container').offsetWidth+'px';
	} catch { }
} 
function setP(tile,x,y) { if (x>=gmfl(level)[0]||y>=gmfl(level)[1]) {tile.setDisabled(true);} else {tile.setDisabled(false);}} 
function crT() {
	plot = []; 
	document.getElementById('gardenPlot').innerHTML=''; 
	maxX = gmfl(level)[0]; 
	maxY = gmfl(level)[1]; 
	generatePlot();
}
function inR(x,y) { if (!useLev) { return inRAlt(x,y); } if (level<9||x>=gmfl(level)[0]||y>=gmfl(level)[1]) { return false; } return true; }
function sts(stage) { return -48*Math.min(stage,3)-48; } 
function decay(stage) { return (Math.max(stage-3,0))?0.5:1; }
function updatestages(holding) { if (holding !== null) { holding=plants[holding].icon; } else { return false; } for (let i = 0; i < 5; i++) { document.getElementById('stage'+i).getElementsByClassName('seed-icon')[0].style.backgroundPosition = sts(i)+"px -"+holding*48+"px"; document.getElementById('stage'+i).getElementsByClassName('seed-icon')[0].style.opacity = decay(i); }}
function mode(arr,items) { if (!Array.isArray(items)) { items = [items]; } let count = 0; for (let i in items) { for (let j in arr) { if (arr[j]==items[i]) { count++; } } } return count; } const mat = [3,4]; const imt = [0,1,2]; 
function getAge(x,y) {if (x < 0 || y < 0 || x >= maxX || y >= maxY || (plot[y*maxX+x].plant == null)) { return null; } return plot[y*maxX+x].age;} 
function updateEffects() { for (let i in plot) { plot[i].suppress = checkSup(plot[i].x,plot[i].y); } } 
function checkSup(x,y) { for (let yy = -2; yy <= 2; yy++) { for (let xx = -2; xx <= 2; xx++) { let t = getTile(x+xx,y+yy);if (xx==0&&yy==0) { continue; } if (t===31) { return 1; } if (t==32) { if (xx != 2 && xx != -2 && yy != 2 && yy != -2) { return 1; } } } } return 0; }
function parseP(input) { if (input === 'null') { return null; } return parseInt(input); } 
function save() { var strr = ''; if (useLev) { strr = level+'/'; } else { strr = cdim[0]+'/'+cdim[1]+'/'; } for (let i in plot) { strr+=tl[plot[i].plant]+ag[(plot[i].age??3)+(plot[i].isNull?100:0)];} return strr; } 
function load(str, noResize) {
	if (typeof noResize === 'undefined') { noResize = false; }
	let skip = false;
	if (str.includes('/')) { 
		str = str.split('/'); 
	} else if (str.includes('END%21')) {
		skip = true; useLev = true;
		str = unescape(str); str = str.replace('!END!',''); str = b64_to_utf8(str);
		str = str.split('|')[5]; str = str.split(';')[2]; level = Math.min(parseP(str.split(',')[3]) - 1, 8); str = str.split(',')[4]; str = str.split(' ')[2]; str = str.slice(0, str.length-1); crT(); console.log(str);
		st2 = str.split(':'); str = '';
		for (let i = 0; i < st2.length; i += 2) {
			let temp = st2[i]; if (temp == '0') { temp = null; } else { temp = parseP(temp)-1; }
			str += tl[temp]; 
			if (temp != null) { str += plants[temp].getStage(parseP(st2[i+1])).toString(); } else { str += '3'; }
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
		let agePlusNull = parseP(str[i+1]);
		if (agePlusNull > 4) {
			agePlusNull -= 5;
			plot[i/2].setNull(true);
		}
		plot[i/2].setPlant(parseP(rtl[str[i]]), true, agePlusNull);
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
function resize() { document.getElementById('warning').classList.remove('inactive'); if(cdim[0]>12||cdim[1]>12) { document.getElementById('captureWarning').classList.remove('inactive'); } else if (document.getElementById('captureWarning').classList[0] != 'inactive') { document.getElementById('captureWarning').classList.add('inactive'); } useLev = false; crT(); maxX = Math.max(6,cdim[0]); maxY = Math.max(6,cdim[1]); uplim(); updateLevel(); updateEffects(); updateStats(); } 
function setPAlt(tile, x, y) { if (inRAlt(x,y)) { tile.setDisabled(false); } else { tile.setDisabled(true); } } 
function inRAlt(x,y) { x++; y++; if (x>Math.max(6,cdim[0])||y>Math.max(6,cdim[1])) {return false;} if (cdim[0]<=6) { if (x<altLims[cdim[0]][0]||x>altLims[cdim[0]][1]) {return false;} } if (cdim[1]<=6) { if (y<altLims[cdim[1]][0]||y>altLims[cdim[1]][1]) {return false;} } return true; }
function download() { 
	let g = document.getElementById('gardenPlot'); 
	if (level < 8 || ((!useLev) && (cdim[0] < 6 || cdim[1] < 6))) { forceResize(); }g.classList.add('gardenBG'); 
	html2canvas(g).then(function(r) { promptToDownload(r); }); 
	g.classList.remove('gardenBG'); if (level < 8 || ((!useLev) && (cdim[0] < 6 || cdim[1] < 6))) { reapply(); } } 
function promptToDownload(canvas) { let dataUrl = canvas.toDataURL(); let downloadLink = document.createElement('a'); downloadLink.href = dataUrl; downloadLink.download = 'garden.png'; document.body.appendChild(downloadLink); downloadLink.click(); document.body.removeChild(downloadLink); }
function toggleDarkMode(t) { 
	if (t) {
		document.documentElement.style.setProperty('--darken', 0.6);
	} else {
		document.documentElement.style.setProperty('--darken', 1);
	}
}
var backupPlot = [];
function forceResize() {
	backupPlot = [];
	for (let i in plot) {
		backupPlot.push(plot[i]);
	}
	let realX = gmfl(level)[0];
	let realY = gmfl(level)[1];
	plot = []; document.getElementById('gardenPlot').innerHTML=''; 
	for (let y=0; y<realY; y++) {
		for (let x=0; x<realX; x++) {
			let tile = new Tile(x, y);
			document.getElementById("gardenPlot").appendChild(tile.element);
			plot.push(tile);
		}
	}
	for (let i in plot) {
		plot[i].setDisabled(false);
	}
	document.documentElement.style.setProperty('--gardenWidth', (realX * 40).toString()+'px'); 
	document.documentElement.style.setProperty('--gardenHeight', (realY * 40).toString()+'px'); 
	let c = 0;
	for (let i in backupPlot) {
		if (backupPlot[i].activeStatus()) {
			plot[c].setPlant(backupPlot[i].plant, true, backupPlot[i].age);
			plot[c].setNull(backupPlot[i].isNull, true);
			c++;
		}
	}
}
function reapply() { 
	uplim(); crT(); updateLevel();
	for (let i in plot) {
		if (plot[i].activeStatus()) {
			plot[i].setPlant(backupPlot[i].plant, true, backupPlot[i].age);
			plot[i].setNull(backupPlot[i].isNull, true);
		}
	}
	maxX = Math.max(6, gmfl(level)[0]);
	maxY = Math.max(6, gmfl(level)[1]);

	updateEffects();
	updateStats();
}

//gonna do this otherwise somehow it doesnt work???
uplim();

function loadTheMod() {
	//why did I do this to myself
	eval('updateStats='+updateStats.toString().replace('let neigh = {};','let neigh = {}; let neighAges = {};').replace('].strId] = 0;','].strId]=0; neighAges[plants[i].strId]=[];').replace('alone = false;', 'alone=false; neighAges[plants[tile].strId].push(getAge(x+xx,y+yy));').replace('if (alone)', 'if (alone && (!checkSup(x,y)))').replace('probs = [];','probs = []; let cs = !checkSup(x,y);').replace(updateStats.toString().slice(updateStats.toString().indexOf('loop:'),updateStats.toString().indexOf('if (probs.length === 0) continue;')), 'loop:\n\t\t\tfor (let i=0; i<mutations.length; i++) { for (let j in mutations[i][0]) { if ( (neigh[j]-(mutations[i][0][j][2]?mode(neighAges[j],imt):0))<mutations[i][0][j][0] || neigh[j]>mutations[i][0][j][1] ) { continue loop; } } for (let j in mutations[i][1]) { if ((!plants[strIdToIndex[j]].fungi) || cs) { probs.push(mutations[i][1][j]); muts.push(j); }}}')); 
	eval('var updateStatsA='+updateStats.toString().replace('function updateStats()','function()').replace('x < plotLimits[level][0] ||','(!inR(x,y))').replace('y < plotLimits[level][1] ||','').replace('x >= plotLimits[level][2] ||','').replace('y >= plotLimits[level] [3]','')); eval('updateStats='+updateStats.toString().replace('TML = "";','TML = "";if(level>=9||(!useLev)){updateStatsA();return false;}'));
}
		
window.addEventListener("DOMContentLoaded", init);
