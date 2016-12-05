mui.plusReady(function() {
	var img_obj = document.querySelector("#canvas_img");
	var canvas_ok = document.querySelector("#canvas_ok");
	var list = plus.webview.currentWebview();
	var userId = plus.storage.getItem('userid');
	var Orientation; 
	img_obj.setAttribute("src", list.imgurl);

	canvas_ok.addEventListener("tap", function() {
		save_img();
		imgOk = document.querySelector("#img_base64").value;
		console.log(imgOk)
		mui.ajax(baseUrl + '/ajax/image/saveHead', {
			data: {
				"id": userId,
				"base64": imgOk,
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			timeout: 10000,
			success: function(data) {
				console.log(JSON.stringify(data));
				console.log(data.success);
				if(data.success) {
					plus.nativeUI.toast("图片上传成功", toastStyle);
					mui.currentWebview.close();
					mui.back();
					var flag = list.flag;
					if(flag == 0) {
						var Page = plus.webview.getWebviewById('html/proinforupdate.html');
						mui.fire(Page, 'newId');
						var Pa = plus.webview.getWebviewById('html/myaccount.html');
						mui.fire(Pa, 'photoUser');

					} else {
					
					}
				} else {
					plus.nativeUI.toast("图片上传失败", toastStyle);

				}

			},
			error: function(data) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	})

})

//获取手机屏幕宽高
var c_w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var c_h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

var can_obj = document.querySelector("#canvas");
var img_obj = document.querySelector("#canvas_img");
var div_obj = document.querySelector("#canvas_div");

var posX = 0,
	posY = 0; //相对坐标
var scale = 0; //记录在缩放动作执行前的 缩放值
var start_X1 = 0,
	start_Y1 = 0,
	start_X2 = 0,
	start_Y2 = 0;
var start_sqrt = 0; //开始缩放比例
var sqrt = 1;
var left_x = 0,
	left_y = 0; //计算 偏移量 设置画布中的X，Y轴 (加偏移量)

img_obj.onload = function() {

	EXIF.getData(img_obj, function() {
		//alert(EXIF.pretty(this));
		EXIF.getAllTags(this);
		//alert(EXIF.getTag(this, 'Orientation'));
		Orientation = EXIF.getTag(this, 'Orientation');
		//return;
		if(Orientation == 6) {
			//alert('需要顺时针（向左）90度旋转');
			var current = 0;
			//objImg.rotate(degree); 
			current = (current + 90) % 360;
			img_obj.style.transform = 'rotate(' + current + 'deg)';
			can_obj.style.transform = 'rotate(' + current + 'deg)';
		}else{
			//alert('需要顺时针（向左）-90度旋转');
		}
	});

	load();

}

function load() {

	//设置canvas 宽度（全屏显示），高度,上下居中显示
	can_obj.width = c_w - 50;
	can_obj.height = c_w - 50;
	can_obj.style.top = (c_h - c_w - 2) / 2 + "px";
	// can_obj.style.left ="25px";

	//设置图片自适应大小及图片的居中显示
	autoResizeImage(c_w, c_h, img_obj);
	//img_obj.width=c_w - 50;
	img_obj.style.top = (c_h - img_obj.height - 50) / 2 + "px";
	img_obj.style.left = (c_w - img_obj.width) / 2 + "px";
	
	document.querySelector("#canvas_div").addEventListener('touchstart', touch, false);
	document.querySelector("#canvas_div").addEventListener('touchmove', touch, false);
	document.querySelector("#canvas_div").addEventListener('touchend', touch, false);
	ctx_img = can_obj.getContext("2d");
	var ctx_X = (can_obj.width - img_obj.width) / 2,
		ctx_Y = (can_obj.height - img_obj.height) / 2;
		
	    ctx_img.drawImage(img_obj, ctx_X, ctx_Y, img_obj.width, img_obj.height); //初始化 canvas 加入图片
    
	
	function touch(event) {
		var event = event || window.event;
		event.preventDefault(); //阻止浏览器或body 其他冒泡事件
		var mv_x1 = event.changedTouches[0].clientX,
			mv_y1 = event.changedTouches[0].clientY; //手指坐标
		var img_left = img_obj.left,
			img_top = img_obj.top; //图片坐标
		if(event.touches.length == 1) { //单指操作
			if(event.type == "touchstart") { //开始移动
				posX = mv_x1 - img_obj.offsetLeft; //获取img相对坐标
				//posd = mv_x1 - img_obj.offsetRight; //获取img相对坐标
				posY = mv_y1 - img_obj.offsetTop;
			} else if(event.type == "touchmove") { //移动中
				var _x = mv_x1 - posX; //移动坐标
				var _y = mv_y1 - posY;
				img_obj.style.left = _x + "px";
				img_obj.style.top = _y + "px";
				ctx_img.clearRect(0, 0, can_obj.width, can_obj.height); //清除画布
				console.log(Orientation);
				if(Orientation == 6) {
					ctx_img.drawImage(img_obj, _y - parseFloat(can_obj.style.top) + left_y-120 / 2, -(_x + left_x / 2 + 32), img_obj.width * sqrt, img_obj.height * sqrt); //画布内图片移动		
				} else {
					ctx_img.drawImage(img_obj, _x + left_x / 2 - 25, _y - parseFloat(can_obj.style.top) + left_y / 2, img_obj.width * sqrt, img_obj.height * sqrt); //画布内图片移动
				}
			}
		} /*else if(event.touches.length == 2) { //双指操作
			if(event.type == "touchstart") {
				scale = img_obj.style.Transform == undefined ? 1 : parseFloat(img_obj.style.Transform.replace(/[^0-9^\.]/g, "")); //获取在手指按下瞬间的放大缩小值（scale），作用，在移动时，记录上次移动的放大缩小值
				start_X1 = event.touches[0].clientX; //记录开始的坐标值,作用：在下次放大缩小后，去掉上次放大或缩小的值
				start_Y1 = event.touches[0].clientY;
				start_X2 = event.touches[1].clientX;
				start_Y2 = event.touches[1].clientY;
				start_sqrt = Math.sqrt((start_X2 - start_X1) * (start_X2 - start_X1) + (start_Y2 - start_Y1) * (start_Y2 - start_Y1)) / 200; //获取在缩放时 当前缩放的值

			} else if(event.type == "touchmove") {
				var mv_x2 = event.touches[1].clientX,
					mv_y2 = event.touches[1].clientY;
				var move_sqrt = Math.sqrt((mv_x2 - mv_x1) * (mv_x2 - mv_x1) + (mv_y2 - mv_y1) * (mv_y2 - mv_y1)) / 200; //动态获取上一次缩放值(随时变更)，在下次缩放时减去上一次的值，作用：防止累加之前的缩放
				sqrt = move_sqrt - start_sqrt + scale; //求出缩放值

				img_obj.style.webkitTransform = "scale(" + sqrt + ")"; //设置放大缩小
				img_obj.style.Transform = "scale(" + sqrt + ")";
				ctx_img.clearRect(0, 0, can_obj.width, can_obj.height); //清除画布
				var dImg_left = parseFloat(img_obj.style.left.replace("px", "")),
					dImg_top = parseFloat(img_obj.style.top.replace("px", ""));
				var w = img_obj.width,
					h = img_obj.height,
					sw = w * sqrt,
					sh = h * sqrt;
				left_x = w - sw; //计算 偏移量 设置画布中的X，Y轴 (加偏移量) 注：canvas 原点放大（canvas中图片左上角坐标），css3 scale 中点放大
				left_y = h - sh;
				ctx_img.drawImage(img_obj, dImg_left + left_x / 2 - 25, dImg_top - parseFloat(can_obj.style.top.replace("px", "")) + left_y / 2, sw, sh); //画布内图片重置
			}
		}*/
	}
}

//window.addEventListener('load', load, false);

//裁图
function save_img() {
    var base64 = can_obj.toDataURL("image/jpeg", 1);
    var subbase = base64.substring(22);
    document.querySelector("#img_base64").value = subbase;
}

//图片自适应
function autoResizeImage(maxWidth, maxHeight, objImg) {
	//var img = new Image();
	//img.src = objImg.src;
	//var hRatio;
	//var wRatio;
	//var ratio = 1;
	var w = objImg.width;
	var h = objImg.height;

	//alert(w);
	//alert(h);
	wRatio = maxWidth / w;
	hRatio = maxHeight / h;

	if(w > maxWidth) {
		if(w > h) {
			objImg.height = maxWidth - 50;
			//alert('1')
		} else {
			objImg.width = c_w - 46;
			//objImg.height=maxHeight;
			// alert('2')
		}
	} else {
		objImg.width = maxWidth - 50;
		objImg.height = maxWidth - 50;
	}
	/* if(w < maxWidth && h < maxHeight){
	 	objImg.width=maxWidth-50;
	 	objImg.height=maxWidth-50;
	 	alert('2')
	 }
	 if(w > maxWidth && h < maxHeight){
	 	objImg.width=maxWidth-50;
	 	objImg.height=maxWidth-50;
	 	alert('3')
	 }*/
	/*if (w < maxWidth && h < maxHeight) {
	      return;
	      alert('1')
	  }
	  if (maxWidth == 0 && maxHeight == 0) {
	      ratio = 1;
	      alert('2')
	  } else if (maxWidth == 0) {
	      if (hRatio < 1) {
	          ratio = hRatio;
	          alert('3')
	      }
	  } else if (maxHeight == 0) {
	      if (wRatio < 1) {
	          ratio = wRatio;
	          alert('4')
	      }
	  } else if (wRatio < 1 || hRatio < 1) {
	      ratio = (wRatio <= hRatio ? wRatio : hRatio);
	      alert('5')
	  } else {
	      ratio = (wRatio <= hRatio ? wRatio : hRatio) - Math.floor(wRatio <= hRatio ? wRatio : hRatio);
	      alert('6')
	  }
	  if (ratio < 1) {
	      if (ratio < 0.5 && w < maxWidth && h < maxHeight) {
	          ratio = 1 - ratio;
	      }
	      w = w * ratio;
	      h = h * ratio;
	      alert('7')
	      objImg.width=maxWidth-45;
	  	objImg.height=maxHeight;
	  }*/
	// objImg.height = h+50;
	//objImg.width = w;
}

