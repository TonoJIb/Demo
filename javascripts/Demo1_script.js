//canvas 1
$( document ).ready(function() {
var im=new Image();
var c = document.getElementById("InitCanvas");
var ctx = c.getContext("2d");
var c1 = document.getElementById("DestCanvas");
var ctx1 = c1.getContext("2d");
im.src="/images/Lympho.jpg";
im.onload=function(){ctx.drawImage(im,0,0)
	var imgData = ctx.getImageData(0, 0, c.width, c.height);
    // invert colors
    var i;
    for (i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i];
        imgData.data[i+1] = 255 - imgData.data[i+1];
        imgData.data[i+2] = 255 - imgData.data[i+2];
        imgData.data[i+3] = 255;
    }
    ctx1.putImageData(imgData, 0, 0);


};
})