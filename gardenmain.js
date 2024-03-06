/*
TODO:
* Implement Everdaisy & Tidygrass weed effects
* Implement all soil types
*/


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

class Plant {
	constructor(name, strId, icon) {
		this.name = name;
		this.strId = strId;
		this.icon = icon;
		
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
			selected = this.id;
		});
		this.element.addEventListener("mouseover", () => {
			tooltipShow(this.element,
				'<div style="padding:8px 4px;">' +
				'<div class="icon" style="background:url(https://orteil.dashnet.org/cookieclicker/img/gardenPlants.png);float:left;margin-left:-24px;margin-top:-4px;background-position:0px -' + this.icon * 48 + 'px;"></div>' +
				'<div class="icon" style="background:url(https://orteil.dashnet.org/cookieclicker/img/gardenPlants.png);float:left;margin-left:-24px;margin-top:-28px;background-position:-192px -' + this.icon * 48 + 'px;"></div>' +
				'<div style="background:url(https://orteil.dashnet.org/cookieclicker/img/turnInto.png);width:20px;height:22px;position:absolute;left:28px;top:24px;z-index:1000;"></div>' +
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

new Plant("Baker's wheat", "bakerWheat", 0);
new Plant("Thumbcorn", "thumbcorn", 1);
new Plant("Cronerice", "cronerice", 2);
new Plant("Gildmillet", "gildmillet", 3);
new Plant("Ordinary clover", "clover", 4);
new Plant("Golden clover", "goldenClover", 5);
new Plant("Shimmerlily", "shimmerlily", 6);
new Plant("Elderwort", "elderwort", 7);
new Plant("Bakeberry", "bakeberry", 8);
new Plant("Chocoroot", "chocoroot", 9);
new Plant("White chocoroot", "whiteChocoroot", 10);
new Plant("White mildew", "whiteMildew", 26);
new Plant("Brown mold", "brownMold", 27);
new Plant("Meddleweed", "meddleweed", 29);
new Plant("Whiskerbloom", "whiskerbloom", 11);
new Plant("Chimerose", "chimerose", 12);
new Plant("Nursetulip", "nursetulip", 13);
new Plant("Drowsyfern", "drowsyfern", 14);
new Plant("Wardlichen", "wardlichen", 15);
new Plant("Keenmoss", "keenmoss", 16);
new Plant("Queenbeet", "queenbeet", 17);
new Plant("Juicy queenbeet", "queenbeetLump", 18);
new Plant("Duketater", "duketater", 19);
new Plant("Crumbspore", "crumbspore", 20);
new Plant("Doughshroom", "doughshroom", 24);
new Plant("Glovemorel", "glovemorel", 21);
new Plant("Cheapcap", "cheapcap", 22);
new Plant("Fool's bolete", "foolBolete", 23);
new Plant("Wrinklegill", "wrinklegill", 25);
new Plant("Green rot", "greenRot", 28);
new Plant("Shriekbulb", "shriekbulb", 30);
new Plant("Tidygrass", "tidygrass", 31);
new Plant("Everdaisy", "everdaisy", 32);
new Plant("Ichorpuff", "ichorpuff", 33);


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
	if (x < 0 || y < 0 || x >= 6 || y >= 6) {
		return null;
	}
	
	return plot[y * 6 + x].plant;
}

function updateStats() {
	document.getElementById("stats").innerHTML = "";
	
	let chances = {};
	for (let i=0; i<plants.length; i++) {
		chances[plants[i].strId] = [];
	}
	
	for (let y=0; y<6; y++) {
		for (let x=0; x<6; x++) {
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
		elem.innerHTML = '<div class="icon" style="background:url(https://orteil.dashnet.org/cookieclicker/img/gardenPlants.png);vertical-align:middle;width:32px;height:32px;background-position:-8px -' + (plant.icon * 48 + 8) + 'px"></div>' +
			'<span style="vertical-align:middle;">' + (chance * 100).toFixed(2) + '%</span>';
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
				this.setPlant(selected);
			}
		});
	}
	
	setPlant(id, skipUpdate) {
		this.plant = id;
		
		if (!skipUpdate) {
			updateStats();
		}
		
		if (id === null) {
			this.icon.style.display = "none";
			return;
		}
		
		this.icon.style.display = "";
		this.icon.style.backgroundPosition = "-192px -" + plants[id].icon * 48 + "px";
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
	for (let y=0; y<6; y++) {
		for (let x=0; x<6; x++) {
			let tile = new Tile(x, y);
			document.getElementById("gardenPlot").appendChild(tile.element);
			plot.push(tile);
		}
	}
}

function updateLevel() {
	document.getElementById("level").textContent = level + 1;
	
	for (let y=0; y<6; y++) {
		for (let x=0; x<6; x++) {
			let tile = plot[y * 6 + x];
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
			'<div class="icon" style="background-image:url(https://orteil.dashnet.org/cookieclicker/img/gardenPlants.png);background-position:-192px -1632px;float:left;margin-left:-8px;margin-top:-8px;"></div>' +
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
		
		updateLevel();
	});
	document.getElementById("level-add").addEventListener("click", function() {
		level = Math.min(level + 1, 8);
		
		updateLevel();
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
			'<div class="icon" style="background-image:url(clear.png);float:left;margin-left:-8px;margin-top:-8px;"></div>' +
			'<div><div class="name">Clear garden</div></div>' +
			'<div class="line"></div>' +
			'<div class="description">Removes all plants from your garden.</div></div>'
		);
	});
	document.getElementById("clear").addEventListener("mouseout", function() {
		tooltipHide();
	});
	
	updateStats();
}

window.addEventListener("DOMContentLoaded", init);
