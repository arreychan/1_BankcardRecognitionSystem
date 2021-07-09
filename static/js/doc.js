// JavaScript Document
function getBill(value,that,index){
        //勾选需要识别的类型
            var divStyle = document.getElementsByClassName("class_div");
            for(var i=0;i<divStyle.length;i++){
                if(index==i){
                     document.getElementById("billModel_"+i).checked=true;
                }
                else{
                    document.getElementById("billModel_"+i).checked=false;
                }
        }

        imgJson.billModel = value;
    } 
    window.onload=function(){
		getMedia();
	}
	//setInterval(cycle,700); //动画显示box   
    function getMedia() {
            var constraints = {
                video: {width: 300, height: 200},
                audio: true
            };
            //获得video摄像头区域
            var video = document.getElementById("video");
            //这里介绍新的方法，返回一个 Promise对象
            // 这个Promise对象返回成功后的回调函数带一个 MediaStream 对象作为其参数
            // then()是Promise对象里的方法
            // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
            // 避免数据没有获取到
            var promise = navigator.mediaDevices.getUserMedia(constraints);
            promise.then(function (MediaStream) {
                video.srcObject = MediaStream;
                video.play();
            });
        }

		function takePhoto() {
	      //获得Canvas对象
	      var video = document.getElementById("video");
	      var canvas = document.getElementById("myCanvas");
	      var ctx = canvas.getContext('2d');
		  var Preview = document.getElementById("Preview");
	      ctx.drawImage(video, 0, 0, 300, 200);
		  
		  

		  var strDataURI=ctx.getImageData(0,0,300,200);
		 // console.log(strDataURI);
		  jQuery("#Preview").attr("src",strDataURI);
		 // console.log(canvas.getContext('2d'));

		  var imgString=document.getElementById("myCanvas").toDataURL("image/jpg", 1);   // canvas转换成base64位
		  
	   FunimgPreview1(imgString,'Preview','myCanvas');
	   
		 
      }