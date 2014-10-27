//Setup
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
document.getElementById("convert").addEventListener("click", convert);
var textColor = "rgb(255, 255, 255)";


var possibleLanguages = [
	
]


setUpSelects();
		
//Converts code from pure to formated for myBB.
//Basically takes the color value out of the editor and generates [color]-tags from that.
function convert() {
	var out = $("#output");
	$(out).html("");
	$(".ace_line").each(function() {
		var line = "";
		
		var nodes = this.childNodes;
		for(var i = 0; i < nodes.length; i++) {
			color = $(nodes[i]).css("color");
			if(color === undefined) color = textColor;
			color = rgb2hex(color);
			var cnt = nodes[i].textContent;
			line += '[color=' + color + ']' + cnt + '[/color]';
		}
		out.append(line + "\r\n");
	})
}
	
//Code used to convert from rgb() to hex value.
var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]; 
function rgb2hex(rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
function hex(x) {
	return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

//sets listeners to the selects to cahnge editor accordingly.
function setUpSelects() {
	$('#language-select').change(function() { 
		editor.getSession().setMode("ace/mode/" + this.value.toLowerCase());
	});
	$('#theme-select').change(function() {
		editor.setTheme("ace/theme/" + this.value.toLowerCase());
		console.log(this.value.toLowerCase());
		updateOutputBG(this.value.toLowerCase());
	});
}

//Updates the backgruond color according to the editor color.
//TODO In der API nachschlagen, ob es einen hock für das ändern des themes gibt, dessen abschkluss, das sollte abgegriffen werden. Scheinbar wird beim ersten mal die erste option der option gewählt, egal was man klickt, anschließend funktioniert alles wie gewollte.
function updateOutputBG(name) {
	console.log('name: ' + name);
	//var bg = $("#editor").css("background-color");	//TODO figure out why this was always failing on first change.
	if(name === 'monokai') {
		var bg = '#272822';
	} else {
		var bg = '#fff';
	}
	$("#output").css("background-color", bg);
	var cl = $("#editor").css("color");
	var clc = rgb2hex(cl);
	$("#output").css("color", clc);
}