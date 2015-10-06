function argarrmin(arr){
	var x=0;
	var y=1;
	var minimum=arr[x][y];
	for (var i=0; i<arr.length; i++){
		for (var j=0; (i!=j)&&(j<i); j++){
			if (arr[i][j]<minimum){
				x=i;
				y=j;
				minimum=arr[i][j];
			}
		}
	}
	return [x, y, minimum];
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
	
	im.src="/images/Lympho.jpg";
	 im.alt="Image not found" 
	 im.onError = function() {
	 	im.onerror=null;
	 	im.src='/Demo/images/Lympho.jpg';
	 } 
	im.onload=function(){ctx.drawImage(im,0,0)
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
var color1=rgbToHex(clusters[0]);
var color2=rgbToHex(clusters[1]);
var color3=rgbToHex(clusters[2]);

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
		console.log(argarrmin(distmatrix));
	//Form a table of agglomeration
		var aggtable=[];
		for (i=0; i<k; i++){

			//var aggobject = {iter: i,}
		}

	};
	

})