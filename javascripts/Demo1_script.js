function avgcolor(node1,node2){
	var color1=node1.color,
		color2=node2.color,
		size1=node1.size,
		size2=node2.size,
		color=color1;
	for (i=0; i<color1.length; i++){
		color[i]=Math.floor((size1*color1[i]+size2*color2[i])/(size1+size2));
	}
	return color;
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
    	var k = 30;
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
       	 	//imgData.data[i] = 255 - imgData.data[i];
        	//imgData.data[i+1] = 255 - imgData.data[i+1];
        	//imgData.data[i+2] = 255 - imgData.data[i+2];
       		//imgData.data[i+3] = 255;
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
    	var count=[]; for (i=0; i<k; i++){count.push(0)};
    	for (i = 0; i < imgData.data.length; i += 4) {
    		x=[imgData.data[i],imgData.data[i+1],imgData.data[i+2]];
    		d=[];
    		for (j=0; j<clusters.length; j++){d.push(distance(x,clusters[j]))};
       		ix=argmin(d);
       		count[ix]++;
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
		var tree=[]; for (i=0;i<k;i++){tree[i]={"nodeid": i,"distance":0,"children":[], "color":clusters[i], "size":count[i]}};
		for (i=0; i<k-1; i++){
			count[tree.length]=count[step.x]+count[step.y];
			cxy=[step.x, step.y];
			clusterind = {"nodeid":tree.length, "distance":step.mindist,"children":cxy,"parent":null,"color":avgcolor(tree[step.x],tree[step.y]),"size":count[tree.length]};
			distances.push(step.mindist);
			tree[step.x].parent = tree.length;
			tree[step.y].parent = tree.length;
			tree.push(clusterind);
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
		var jsonstring= function(node){
			if (tree[node].children[1]===undefined) {
				obj={
					name: tree[node].nodeid,
					parent: tree[node].parent,
					color: rgbToHex(tree[node].color),
					size: 40*tree[node].size/tree[tree.length-1].size
				}
				return obj;
			} else
			{
				obj={
					name: tree[node].nodeid,
					parent: tree[node].parent,
					color: rgbToHex(tree[node].color),
					size: 40*tree[node].size/tree[tree.length-1].size,
					children: [jsonstring(tree[node].children[0]),jsonstring(tree[node].children[1])]
				}
				//var str="{'name':"+ tree[node].nodeid +", 'parent':"+tree[node].parent+", 'children': ["+jsonstring(tree[node].children[0])+", "+jsonstring(tree[node].children[1])+"]"
			return obj};
		}
		jsontree=jsonstring(tree.length-1);

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
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });


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
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

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
      .style("stroke",function(d){ return d.target.color})
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

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

	}//end onload;
	

})//end ondocumentready