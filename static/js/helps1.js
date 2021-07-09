function postImg(){
        //执行post请求，识别图片
        jQuery("#billmodeltable").remove();//清空界面识别结果
        imgJson["textAngle"] = document.getElementById("textAngle").checked;//是否自动进行文字方向检测
        imgJson["textLine"]  = document.getElementById("textLine").checked;//是否只检测但行文字
         if(imgJson['num']==0)
         {   loadingGif('loadingGif');
             imgJson['num']=1;//防止重复提交
          //alert(imgJson["billModel"]);
             imgJson['ocrFlag']=true;
			 console.log("========");
			 console.log(imgJson["imgString"]);
        jQuery.ajax({
            type: "post",
            url: 'lhj',
            data:JSON.stringify({"imgString":imgJson["imgString"],
                                 "billModel":imgJson["billModel"],
                                 "textAngle":imgJson["textAngle"],
                                 "textLine":imgJson["textLine"]
                                }),
          success:function(d){
              loadingGif('loadingGif');
			 	window.location.hash = '#lanhaijin';
              imgJson['num']=0;//防止重复提交
              res = JSON.parse(d);
              imgJson["result"] = res['res'];
              imgJson["timeTake"] = res['timeTake'];
              getChildDetail();
              W = 500;
              H = 300;
              imgJson['ocrFlag']=false;
          }
        });}
        
         }


function loadingGif(loadingGif){
        //加载请求时旋转动态图片
        var imgId=document.getElementById(loadingGif);
        if(imgId.style.display=="block")
        {imgId.style.display="none";}
        else
        {imgId.style.display="block";}
		
}


function resize_im(w,h, scale, max_scale){
    f=parseFloat(scale)/Math.min(h, w);
    if(f*Math.max(h, w)>max_scale){
            f=parseFloat(max_scale)/Math.max(h, w);
    }
    newW = parseInt(w*f);
    newH = parseInt(h*f);
    
    return [newW,newH,f]
}


function FunimgPreview(avatarSlect,avatarPreview,myCanvas) {
                //avatarSlect 上传文件控件
                //avatarPreview 预览图片控件
                jQuery("#"+avatarSlect).change(function () {
                var obj=jQuery("#"+avatarSlect)[0].files[0];
                
                var fr=new FileReader();
                fr.readAsDataURL(obj);

                fr.onload=function () {

                      //jQuery("#"+avatarPreview).attr('src',this.result);
                     console.log("====0======");
					  console.log(this.result);
                      var image = new Image();
                      
					  imgRate = 1;
					  imgJson.width = 500;
					  imgJson.height = 300;
					  jQuery("#"+avatarPreview).attr('width',500);
					  jQuery("#"+avatarPreview).attr('height',300);
					  jQuery("#"+'myCanvas1').attr('width',500);
					  jQuery("#"+'myCanvas1').attr('height',300);
					  console.log("====1======");
					  console.log(this.result);
					  image.src= this.result;
					  var imgStr = this.result;
					  var canvas = document.getElementById("myCanvas1");
					  var ctx = canvas.getContext('2d');
					  var Preview = document.getElementById("Preview1");
					  document.getElementById("Preview1").src = this.result;
					  console.log(image.src);
					  image.onload=function(){
							ctx.drawImage(image, 0, 0, 500, 300);
						  var strDataURI=ctx.getImageData(0,0,500,300);
						  //jQuery("#Preview1").attr("src",strDataURI);
						  console.log(this.result);
						  var imgString=document.getElementById("myCanvas1").toDataURL("image/jpg", 1);
						  
						  console.log(imgString);
						  imgJson.imgString = imgStr;
						  //box = {"xmin":0,"ymin":0,"xmax":jQuery("#"+'myCanvas').width(),"ymax":jQuery("#"+'myCanvas').height()};                         //createNewCanvas(this.result,'myCanvas',box);
						  
					  
							postImg();//提交POST请求
					  };
					  
					
                };//fr.onload
                
                })//jQuery("#"+avatarSlect)
 }
    
function getChildDetail(){
  jQuery("#billmodeltable").remove();
  childResult = imgJson["result"];
  createTable(childResult,imgJson['timeTake']);//新建table
	
}


  

//根据获取的数据，创建table
  //创建table
function createTable(result,timeTake){
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
    //drawRbox(imgBoxes,'myCanvas1');  
  document.getElementById("ligejian").innerHTML = "所选银行卡卡号为："+max;
    }
   
    
function drawRbox(boxes,canvasId){
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


function cycle1(){
    if(Math.random()>0.5){
    var canvas = document.getElementById('myCanvas1');
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,500,300);
        }
    }
    else{
    if(imgJson['ocrFlag']==false){
        drawRbox(imgBoxes,'myCanvas1');
    }}
    
}
