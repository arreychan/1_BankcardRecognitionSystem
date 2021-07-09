function postImg1(){
        //执行post请求，识别图片
        jQuery("#billmodeltable").remove();//清空界面识别结果
        imgJson["textAngle"] = document.getElementById("textAngle").checked;//是否自动进行文字方向检测
        imgJson["textLine"]  = document.getElementById("textLine").checked;//是否只检测但行文字
         if(imgJson['num']==0)
         {   loadingGif1('loadingGif');
             imgJson['num']=1;//防止重复提交
          //alert(imgJson["billModel"]);
             imgJson['ocrFlag']=true;
			 
        jQuery.ajax({
            type: "post",
            url: 'lhj',
            data:JSON.stringify({"imgString":imgJson["imgString"],
                                 "billModel":imgJson["billModel"],
                                 "textAngle":imgJson["textAngle"],
                                 "textLine":imgJson["textLine"]
                                }),
          success:function(d){
              loadingGif1('loadingGif');
              imgJson['num']=0;//防止重复提交
              res = JSON.parse(d);
              imgJson["result"] = res['res'];
              imgJson["timeTake"] = res['timeTake'];
              getChildDetail1();
              W = 500;
              H = 300;
              imgJson['ocrFlag']=false;
			  
          }
        });}
        
         }


function loadingGif1(loadingGif){
        //加载请求时旋转动态图片
        var imgId=document.getElementById(loadingGif);
        if(imgId.style.display=="block")
        {imgId.style.display="none";}
        else
        {imgId.style.display="block";}}


function resize_im1(w,h, scale, max_scale){
    f=parseFloat(scale)/Math.min(h, w);
    if(f*Math.max(h, w)>max_scale){
            f=parseFloat(max_scale)/Math.max(h, w);
    }
    newW = parseInt(w*f);
    newH = parseInt(h*f);
    
    return [newW,newH,f]
}

function FunimgPreview1(imgString,avatarPreview,myCanvas) {
                
	var fr=new FileReader();
	console.log(imgString);
	
	
	  jQuery("#"+avatarPreview).attr('src',imgString);
	  imgJson.imgString = imgString;
	  
	  var image = new Image();
	  image.onload=function(){
		  var width = 500;
		  var height = 300;
		  newWH =resize_im1(width,height, 500, 300);
		  newW = "500";
		  newH = "300";
		  imgRate = 1;
		  
		  imgJson.width = width;
		  imgJson.height = height;
		  jQuery("#"+avatarPreview).attr('width',newW);
		  jQuery("#"+avatarPreview).attr('height',newH);
		  jQuery("#myCanvas").attr('width',newW);
		  jQuery("#myCanvas").attr('height',newH);
		
					  
	  };
	  image.src= imgString;
	
	  postImg1();//提交POST请求
	
	
}   

function getChildDetail1(){
  jQuery("#billmodeltable").remove();
  childResult = imgJson["result"];
  createTable1(childResult,imgJson['timeTake']);//新建table
}


  

//根据获取的数据，创建table
  //创建table
function createTable1(result,timeTake){
        //根据获取的数据，创建table
        jQuery("#mytable").empty();
        var jsObject = result;
		var str='';
		var max='0';
		
        imgBoxes=[];
        //var jsObject = [{"name":10,"value":20},{"name":10,"value":20}];
        var p = "所用时间:"+timeTake+"秒,";
		
        var tableString =p+"<span id='ligejian'></span>"+"<div >具体结果信息如下：</div>"+ "<table id='billmodeltable' class='gridtable' style='color:#ffffff;'><tr><th>序号</th><th>值</th></tr>"
                        
        for(var i=0;i<jsObject.length;i++){
            tableString+="<tr><td><p>"+jsObject[i]["name"]+"</p></td><td><p contenteditable='true'>"+jsObject[i]["text"]+"</p></td></tr>";
			var numArr=jsObject[i]["text"].match(/\d+/g);
			if(numArr!=null){
			 for ( var j = 0; j <numArr.length; j++){
				str=str+(numArr[j]);
				 //console.log(numArr[j]);
				 console.log(str);
			 }
			
			//str=+numArr.join('');
			if(parseInt(str)>parseInt(max))
				{
					max=str;
				}
				str='';
			}
			
            imgBoxes.push(jsObject[i]["box"]);
			
			//console.log(11111111);
			//console.log(str);
        }
		
		
        tableString+="</table>";
        //jQuery("#mytable").append(p);
        jQuery("#mytable").append(tableString);
    drawRbox1(imgBoxes,'myCanvas');  
  document.getElementById("ligejian").innerHTML = "所选银行卡卡号为："+max;
    }
   
        
   
    
function drawRbox1(boxes,canvasId){
       /*canvas上绘制倾斜矩形
       */
       var canvas = document.getElementById(canvasId);
      
       if(canvas.getContext){
           
            var ctx = canvas.getContext("2d");
            ctx.strokeStyle = 'rgba(106,193,233,0.5)';
            ctx.lineWidth = 5; 
			
            ctx.clearRect(0,0,500,300);
            ctx.beginPath(); 
            for(var i=0;i<imgBoxes.length;i++){
                   box=  imgBoxes[i];//x1,y1,x2,y2,x3,y3,x4,y4
                   x1=box[0]*imgRate;
                   y1=box[1]*imgRate;
                   x2=box[2]*imgRate;
                   y2=box[3]*imgRate;
                   x3=box[4]*imgRate;
                   y3=box[5]*imgRate;
                   x4=box[6]*imgRate;
                   y4=box[7]*imgRate;
                
                   ctx.moveTo(x1, y1);
                   ctx.lineTo(x2, y2);
                
                   ctx.moveTo(x2, y2);
                   ctx.lineTo(x3, y3);
                   
                   ctx.moveTo(x3, y3);
                   ctx.lineTo(x4, y4);
                   
                   ctx.moveTo(x4, y4);
                   ctx.lineTo(x1, y1);
					ctx.stroke();
               }
            
            ctx.closePath();
           }}  


function cyclePhoto(){
    if(Math.random()>0.5){
    var canvas = document.getElementById('myCanvas');
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
		
        ctx.clearRect(0,0,canvas.width,canvas.height);
        }
    }
    else{
    if(imgJson['ocrFlag']==false){
        drawRbox(imgBoxes,'myCanvas');
    }}
    
}
