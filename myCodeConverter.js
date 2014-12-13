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
	
	//The last color used to enable as few color tags as possible.
	var lastColor = null;
	$(".ace_line").each(function() {
		var line = "";
		
		//Iterate over all children generated via ACE.
		var nodes = this.childNodes;
		for(var i = 0; i < nodes.length; i++) {
			color = $(nodes[i]).css("color");
			if(color === undefined) color = textColor;
			color = rgb2hex(color);
			
			//Get the content for this color.
			//Replace < with html special character to help html-tags go through.
			var cnt = nodes[i].textContent.replace('<', '&lt;');
			if (/^\s+$/.test(cnt)) {
				
				//cnt contains only whitespaces, no need for color tags.
				line += cnt;
			}else if(color !== lastColor && lastColor === null) {
				
				//The first color is starting.
				line += '[color=' + color + ']' + cnt ;
				lastColor = color;
			} else if(color !== lastColor) {
				
				//A colorchange is happening with a color existing.
				line += '[/color][color=' + color + ']' + cnt;
				lastColor = color;
			} else {
				
				//Staying on the same color
				line += cnt;
			}
		}
		out.append(line + "\r\n");
	})
	
	//Close the last color tag.
	out.append('[/color]');
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

//sets listeners to the selects to change editor accordingly.
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
//TODO Check if there is an API hook for theme changing in ACE. Looks like the the first change of themes always uses the top most selection.
function updateOutputBG(name) {
	console.log('name: ' + name);
	//var bg = $("#editor").css("background-color");	//TODO figure out why this was always failing on first change.
	//TODO this should be more generic. That caused problem, see above todo.
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