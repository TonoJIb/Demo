var mask; 
function avgcolor(node1,node2){
	var color1=node1.color,
		color2=node2.color,
		size1=node1.size,
		size2=node2.size,
		color=[0,0,0];
	for (i=0; i<color1.length; i++){
		color[i]=((size1*color1[i]+size2*color2[i])/(size1+size2));
	}
	return color;
}
function isinarr(value,arr) {
	for (i=0;i<arr.length;i++){
		if (arr[i]==value) return true
	}
	return false;
}
function argarrmin(arr){
	var x=0;
	var y=0;
	
	var minimum=1000;

	for (var i=0; i<arr.length; i++){
		if (arr[i]===undefined) continue;
		for (var j=0; (i!=j)&&(j<i); j++){
			if (arr[i][j]===undefined) continue;
			if (arr[i][j]<minimum){
				x=i;
				y=j;
				minimum=arr[i][j];
			}
		}
	}
	return {"x":x, "y":y, "mindist":minimum};
}
function distance(point1, point2)
{
  var rs = 0;
  var gs = 0;
  var bs = 0;

 
  rs = point2[0] - point1[0];
  rs = 0.1*rs * rs;
 
  gs = point2[1] - point1[1];
  gs = gs * gs;

  bs = point2[2] - point1[2];
  bs = 5*bs * bs;
 
  return Math.sqrt( rs + gs +bs);
}
function argmin(arr){
	var min = arr[0];
	var minIndex = 0;

	for (var i = 1; i < arr.length; i++) {
    	if (arr[i] < min) {
        	minIndex = i;
        	min = arr[i];
    	}
    }
    return minIndex;

}

function componentToHex(c) {
    c=Math.floor(c);
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(x) {
    return "#" + componentToHex(x[0]) + componentToHex(x[1]) + componentToHex(x[2]);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
//canvas 1

$( document ).ready(function() {
	var im=new Image();
	var c = document.getElementById("InitCanvas");
	var ctx = c.getContext("2d");
	var c1 = document.getElementById("DestCanvas");
	var ctx1 = c1.getContext("2d");
	if (document.URL=="http://localhost:8000/"){
		im.src= "/images/Lympho.jpg";
	} else {
		im.src= "/Demo/images/Lympho.jpg";
	}
	
	im.alt="Image not found"; 
	
	
	im.onload=function(){ctx.drawImage(im,0,0);
		var imgData = ctx.getImageData(0, 0, c.width, c.height);
    	// invert colors
    	var i;
    	var k = 50;
    	var j;
    	var clusters=[];// = [[0, 0, 0],[0, 0, 0],[0,0,0]];
    	var div = document.getElementById("axis");
    	var str =[];
    	var color = ["red", "green", "blue"];
    	//initializing neural gas nodes

    	for (i = 0; i < k; i += 1){
    		clusters.push([0, 0, 0]);
    		var rind=4*Math.floor((Math.random() * imgData.data.length) / 4);
    		for (j = 0; j < 3; j++){
    			clusters[i][j] = imgData.data[rind+j];
    			
    			//str=[str+color[j]+': '+clusters[i][j]+'; '];
    		}
    		var txt = "Cluster"+(i+1)+": ["+str+"] <br>";
    		//str=[];
    		//$("#axis").append(txt);
    	}
 		var x; //input vector
 		var d; //distance massive
 		var ix;//index of winner
 		var eps=0.1;
    	for (i = 0; i < imgData.data.length; i += 4) {

       		x=[imgData.data[i],imgData.data[i+1],imgData.data[i+2]];
       		d=[];
    		for (j=0; j<clusters.length; j++){d.push(distance(x,clusters[j]))};
       		ix=argmin(d);
       		for (j=0; j<3;j++){
       			clusters[ix][j]=clusters[ix][j]+eps*(x[j]-clusters[ix][j]);
       		}
    	}
//var color1=rgbToHex(clusters[0]);
//var color2=rgbToHex(clusters[1]);
//var color3=rgbToHex(clusters[2]);

    	//$("#axis").css("background", ("-webkit-linear-gradient(top,"+color1+","+color2+","+color3+")"));
    	//for (i = 0; i < k; i += 1){
    	//	for (j = 0; j < 3; j++){
    	//		
    	//		str=[str+color[j]+': '+clusters[i][j]+'; '];

    	//	}
    	//	var txt = "Cluster"+(i+1)+": ["+str+"] <br>";
    		//str=[];
    		//$("#axis").append(txt);
    	//}
    	//for (kk=0;kk<clusters.length;kk++){
    	//	for (i=0;i<3;i++) {clusters[kk][i]=Math.floor(clusters[kk][i])}
    	//}
    	mask=[];
    	var count=[]; for (i=0; i<k; i++){count.push(0)};
    	for (i = 0; i < imgData.data.length; i += 4) {
    		x=[imgData.data[i],imgData.data[i+1],imgData.data[i+2]];
    		d=[];
    		for (j=0; j<clusters.length; j++){d.push(distance(x,clusters[j]))};
       		ix=argmin(d);
       		count[ix]++;
       		mask.push(ix);
       		//if (mask[mask.length-1]>30) {console.log(ix)}
    		imgData.data[i]=clusters[ix][0];
    		imgData.data[i+1]=clusters[ix][1];
    		imgData.data[i+2]=clusters[ix][2];
    		imgData.data[i+3]=255;
    	}
    
    	ctx1.putImageData(imgData, 0, 0);
    	for (i=0; i<count.length; i++){
    		//console.log(count[i]);
    	}

//form distance matrix
		
		distmatrix=[]; 
		for (i=0; i<k; i++){
			str=[];
			for(j=0; j<k; j++){
				str.push(0);
			}
			distmatrix.push(str);
		};
		for (i=0; i<k; i++){
			for (j=0; j<i; j++){
				distmatrix[i][j]=distance(clusters[i],clusters[j]);
				distmatrix[j][i]=distmatrix[i][j];
			}
		}

		//console.log(argarrmin(distmatrix));
	//Form a table of agglomeration
		var aggtable=[];
		var aggobject={"distance":0,"clusters":clusters};
		aggtable.push(aggobject);
		var step = argarrmin(distmatrix);
		var clustersind={}; 
		var cx, cy, cxy, newD; //temp variables
		var distances=[0]; //agglomeration distances this will increase on each step by new agglomeration distance
		var initdistmatrix=distmatrix; //make a copy of distmatrix
		var newline=[];
		var alpha=0.5, //algorithm parameters
			alpha1,
			alpha2;
		var beta=0;
		var gamma=0.5;
		var undef=newline[1];
		var Itree=[]; for (i=0;i<k;i++){Itree[i]={"nodeid": i,"distance":0,"children":[], "color":clusters[i], "size":count[i]}};
		for (i=0; i<k-1; i++){
			count[Itree.length]=count[step.x]+count[step.y];
			cxy=[step.x, step.y];
			clusterind = {"nodeid":Itree.length, "distance":step.mindist,"children":cxy,"parent":null,"color":avgcolor(Itree[step.x],Itree[step.y]),"size":count[Itree.length]};
			distances.push(step.mindist);
			Itree[step.x].parent = Itree.length;
			Itree[step.y].parent = Itree.length;
			Itree.push(clusterind);
			alpha1=count[step.x]/(count[step.x]+count[step.y]);
			alpha2=count[step.y]/(count[step.x]+count[step.y]);
			beta = -(count[step.x]*count[step.y])/((count[step.x]+count[step.y])*(count[step.x]+count[step.y]));
			gamma=0;
			//distmatrix.correction
			newline=[];
			dxy = distmatrix[step.x][step.y];
			delete distmatrix[step.x];
			delete distmatrix[step.y];
			for (j=0; j<distmatrix.length;j++){
				if (distmatrix[j]===undefined) 
				{	newline.push(undef);
					continue;}
				
				newD=alpha1*distmatrix[j][step.x]+alpha2*distmatrix[j][step.y]+beta*dxy+gamma*Math.abs(distmatrix[j][step.x]-distmatrix[j][step.y]);
				distmatrix[j].push(newD);
				newline.push(newD);
				distmatrix[j][step.x]=undef;
				distmatrix[j][step.y]=undef;
			}
			newline.push(0);
			distmatrix.push(newline);

			step = argarrmin(distmatrix);

		}
		// forming json
		var jsontree;
		var obj;
		var getchildren=function(d) {
    		if (Itree[d].children===null) return []
    		if (Itree[d].children[1]===undefined) return []
    		var foresons=[];
			foresons=foresons.concat(Itree[d].children[0]);
			foresons=foresons.concat(Itree[d].children[1]);
    		foresons=foresons.concat(getchildren(Itree[d].children[0]));
			foresons=foresons.concat(getchildren(Itree[d].children[1]));
			return foresons;
		}
		var jsonstring= function(node){
			if (Itree[node].children[1]===undefined) {
				obj={
					name: Itree[node].nodeid,
					parent: Itree[node].parent,
					color: Itree[node].color,
					size: 40*Itree[node].size/Itree[Itree.length-1].size
				}
				return obj;
			} else
			{
				obj={
					name: Itree[node].nodeid,
					parent: Itree[node].parent,
					color: Itree[node].color,
					size: 40*Itree[node].size/Itree[Itree.length-1].size,
					children: [jsonstring(Itree[node].children[0]),jsonstring(Itree[node].children[1])],
					allchildren: getchildren(Itree[node].nodeid)
				}
				//var str="{'name':"+ tree[node].nodeid +", 'parent':"+tree[node].parent+", 'children': ["+jsonstring(tree[node].children[0])+", "+jsonstring(tree[node].children[1])+"]"
			return obj};
		}
		jsontree=jsonstring(Itree.length-1);

		// a tree
		var margin = {top: 20, right: 120, bottom: 20, left: 120},
    		width = 960 - margin.right - margin.left,
    		height = 800 - margin.top - margin.bottom;

		var i = 0,
    		duration = 750,
    		root;

		var tree = d3.layout.tree()
    				 .size([height, width]);

		var diagonal = d3.svg.diagonal()
    		.projection(function(d) { return [d.y, d.x]; });

		var svg = d3.select("#axis")
								   .append("svg")
    							   .attr("width", width + margin.right + margin.left)
    							   .attr("height", height + margin.top + margin.bottom)
  								   .append("g")
    							   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  		root = jsontree;
  		root.x0 = height / 2;
  		root.y0 = 0;

  		function collapse(d) {
    		if (d.children) {
      			d._children = d.children;
      			d._children.forEach(collapse);
      			d.children = null;
    		}
  		}





  		//root.children.forEach(collapse);

  		update(root);

 		d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 80; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", function(d){return d.size})
      .style("stroke", function(d) { return d._children ? "#ee3333" : "#666666"; })
      .style("fill", function(d) { return rgbToHex(d.color); });


  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", function(d){return d.size})
      .style("stroke", function(d) { return d._children ? "#ee3333" : "#666666"; })
      .style("fill", function(d) { return rgbToHex(d.color); });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .style("stroke",function(d){ return rgbToHex(d.target.color)})
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
var foresons = [];
var curmask=[];
for (i=0;i<mask.length;i++){curmask.push(mask[i]);}
// Toggle children on click.
function click(d) {

    var canvas = document.getElementById("DestCanvas");
    var ctx = canvas.getContext("2d");
    var imgData = ctx.getImageData(0, 0, c.width, c.height);
  	if (d.children) {
	var col = d.color;
    	for (var i = 0; i < mask.length; i++) {
    	d.allchildren.forEach(function(id){
    	    	
            if(mask[i]==id) {
        	imgData.data[4*i] = col[0];
        	imgData.data[4*i+1] = col[1];
        	imgData.data[4*i+2] = col[2];
       		imgData.data[4*i+3] = 255;
       		curmask[i]=d.name;
        } 
    })

    }; //forEach

	d._children = d.children;
    d.children = null;
    
  } else {
    
    d.children = d._children;
    d._children = null;
    for (var i = 0; i < mask.length; i++) {
    if (curmask[i]==d.name){
    	var findnewcolor=function(d1) {
    		var newcolor;
    		if (d1.children===null) return {"name":d1.name, "color":(d1.color)}
    		if (d1.children===undefined) return {"name":d1.name, "color":(d1.color)}
    		if (d1.allchildren.length==2){
    			if (mask[i]==d1.children[0].name) return {"name":d1.children[0].name, "color":(d1.children[0].color)};
    			if (mask[i]==d1.children[1].name) return {"name":d1.children[1].name, "color":(d1.children[1].color)};
    		}
    		if (isinarr(mask[i],d1.children[0].allchildren)){
    			newcolor = findnewcolor(d1.children[0]);
    		} else {newcolor = findnewcolor(d1.children[1]); }
    	
    		return newcolor;	
    	}
    	var nc=findnewcolor(d);
    	curmask[i]= nc.name;
    	imgData.data[4*i] = nc.color[0];
        imgData.data[4*i+1] = nc.color[1];
        imgData.data[4*i+2] = nc.color[2];
       	imgData.data[4*i+3] = 255;

    } 
    		
	}

  }
  update(d);
  ctx.putImageData(imgData, 0, 0);
}

	}//end onload;
	

})//end ondocumentready