//canvas 1
var im=new Image();
var c= c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
im.onload=function(){ctx.drawImage(im,0,0)};
im.src="images/Lympho.jpg"