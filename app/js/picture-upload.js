mui.ready(function(){
	mui.plusReady(function() {
		//获取手机屏幕宽高
		var c_w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var c_h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		var can_obj = document.querySelector("#canvas");
		var can_obj2 = document.querySelector("#canvas2");
		var img_obj = document.querySelector("#canvas_img");
		var img_obj2 = document.querySelector("#canvas_img2");
		var div_obj = document.querySelector("#canvas_div");
		var canvas_ok = document.querySelector("#canvas_ok");
		var list = plus.webview.currentWebview();
		var userId = plus.storage.getItem('userid');
		var Orientation;
		var angle = 0;
		var flag = list.flag;
		var headFlag = list.headFlag;
		var resouFlag = list.resouFlag;
		var toph = (c_h - c_w - 1) / 2;
		var bottomh = (c_h - c_w + 99) / 2;
		var posX = 0,
			posY = 0; //相对坐标
		var _x = 0,
			_y = 0;
		var left_x = 0,
			left_y = 0; //计算 偏移量 设置画布中的X，Y轴 (加偏移量)
	
		img_obj.setAttribute("src", list.imgurl);
		can_obj.width = c_w - 50;
		can_obj.height = c_w - 50;
		can_obj.style.top = (c_h - c_w - 2) / 2 + "px";
		div_obj.style.borderWidth = toph + "px 23px " + bottomh + "px 24px";
		//旋转角度
		function rotateImage(deg) {
			can_obj2.width = img_obj.height;
			can_obj2.height = img_obj.width;
			var ctx = can_obj2.getContext("2d");
			ctx.save();
			ctx.translate(img_obj.height / 2, img_obj.width / 2);
			ctx.rotate(deg * Math.PI / 180);
			ctx.drawImage(img_obj, -img_obj.width / 2, -img_obj.height / 2);
			ctx.restore();
			document.getElementById("canvas_img2").src = can_obj2.toDataURL();
			var imgh = document.getElementById("canvas_img2");
			setTimeout(function() {
				autoResizeImage(c_w, c_h, imgh); 
			}, 100);
		}
		//初始化图片加载完成
		img_obj.onload = function() {
			EXIF.getData(img_obj, function() {
				EXIF.getAllTags(this);
				Orientation = EXIF.getTag(this, 'Orientation');
				//alert(Orientation)
				if(Orientation == 6) {
					angle = 0;
					rotateImage(90);
				} else if(Orientation == 3) {
					angle = 0;
					rotateImage(180);
				} else if(Orientation == 8) {
					angle = 0;
					rotateImage(270);
				} else {
					var imgsrc = img_obj.getAttribute("src");
					document.getElementById("canvas_img2").src = imgsrc;
					var imgh = document.getElementById("canvas_img2");
					setTimeout(function() {
						autoResizeImage(c_w, c_h, imgh)
					}, 100);
				}
				imageMove();
			});
		}
	
		//手指移动图片
		function imageMove() {
			document.querySelector("#canvas_div").addEventListener('touchstart', touch, false);
			document.querySelector("#canvas_div").addEventListener('touchmove', touch, false);
			document.querySelector("#canvas_div").addEventListener('touchend', touch, false);
			ctx_img = can_obj.getContext("2d");
	
			function touch(event) {
				var event = event || window.event;
				event.preventDefault(); //阻止浏览器或body 其他冒泡事件
				var mv_x1 = event.changedTouches[0].clientX,
					mv_y1 = event.changedTouches[0].clientY; //手指坐标
				var img_left = img_obj2.left,
					img_top = img_obj2.top; //图片坐标
				if(event.touches.length == 1) { //单指操作
					if(event.type == "touchstart") { //开始移动
						posX = mv_x1 - img_obj2.offsetLeft; //获取img相对坐标
						//posd = mv_x1 - img_obj.offsetRight; //获取img相对坐标
						posY = mv_y1 - img_obj2.offsetTop;
					} else if(event.type == "touchmove") { //移动中
						_x = mv_x1 - posX; //移动坐标
						_y = mv_y1 - posY;
						img_obj2.style.left = _x + "px";
						img_obj2.style.top = _y + "px";
					}
				}
			}
		}
	
		//裁剪确定的图片
		function save_img() {
			var ctx_X = (can_obj.width - img_obj2.width) / 2,
				ctx_Y = (can_obj.height - img_obj2.height) / 2;
			if(_x == 0) {
				ctx_img.drawImage(img_obj2, ctx_X, ctx_Y, img_obj2.width, img_obj2.height); //初始化 canvas 加入图片
			} else {
				ctx_img.drawImage(img_obj2, _x + left_x / 2 - 25, _y - parseFloat(can_obj.style.top) + left_y / 2, img_obj2.width, img_obj2.height); //初始化 canvas 加入图片
			}
			var base64 = can_obj.toDataURL("image/jpeg", 1);
			var subbase = base64.substring(22);
			document.querySelector("#img_base64").value = subbase;
		}
	
		//图片自适应
		function autoResizeImage(maxWidth, maxHeight, objImg) {
			var w = objImg.width;
			var h = objImg.height;
			wRatio = maxWidth / w;
			hRatio = maxHeight / h;
			if(w > maxWidth) {
				if(w > h) {
					objImg.height = maxWidth - 50;
				} else {
					objImg.width = c_w - 46;
				}
			} else {
				objImg.width = maxWidth - 50;
				objImg.height = maxWidth - 50;
			}
			objImg.style.top = (c_h - objImg.height - 50) / 2 + "px";
			objImg.style.left = (c_w - objImg.width) / 2 + "px";
		}
	
		//提交图片
		canvas_ok.addEventListener("tap", function() {
			save_img();
			//return;
			imgOk = document.querySelector("#img_base64").value;
			//alert(angle)
			console.log(flag);
			console.log(list.resourceId);
			//alert(angle)
			if(flag == 1) {
				var urlAdd = baseUrl + "/ajax/images/saveResImg";
				var $data = {
					"resourceId": list.resourceId,
					"base64": imgOk,
					"angle": angle,
				}
			} else {
				var urlAdd = baseUrl + '/ajax/image/saveHead';
				var $data = {
					"id": userId,
					"base64": imgOk,
					"angle": angle,
				}
			}
			mui.ajax(urlAdd, {
				data: $data,
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				timeout: 10000,
				success: function(data) {
					if(data.success) {
						plus.nativeUI.toast("图片上传成功", toastStyle);
						if(flag == 0) {
							if(headFlag == 2) {
								var Page = plus.webview.getWebviewById('html/studentUpdata.html');
								mui.fire(Page, 'newId');
							} else if(headFlag == 1) {
								var Page = plus.webview.getWebviewById('html/companyUpdata.html');
								mui.fire(Page, 'newId', {
									rd: 1
								});
							} else if(headFlag == 0) {
								var Page = plus.webview.getWebviewById('html/proinforupdate.html');
								mui.fire(Page, 'newId', {
									rd: 1
								});
							} else if(headFlag == 4) {
								var Page = plus.webview.getWebviewById('html/researcher.html');
								mui.fire(Page, 'newId', {
									rd: 1
								});
							}
							var Pa = plus.webview.getWebviewById('html/myaccount.html');
							mui.fire(Pa, 'photoUser');
						} else if(flag == 1) {
							if(resouFlag == 0) {
								var Page = plus.webview.getWebviewById('html/proinforupdate.html');
								mui.fire(Page, 'newId', {
									rd: 1
								});
							} else if(resouFlag == 1) {
								var Page = plus.webview.getWebviewById('html/companyUpdata.html');
								mui.fire(Page, 'newId', {
									rd: 1
								});
							} else if(resouFlag == 2) {
								var Page = plus.webview.getWebviewById('html/studentUpdata.html');
								mui.fire(Page, 'newId', {
									rd: 1
								});
							}
							var Pa = plus.webview.getWebviewById('resinforupdate.html');
							mui.fire(Pa, 'resourceMess');
						}
						var ifllimg = plus.webview.getWebviewById('../html/fillinfo.html');
						mui.fire(ifllimg, 'showimg');
						mui.currentWebview.close();
						mui.back();
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
})