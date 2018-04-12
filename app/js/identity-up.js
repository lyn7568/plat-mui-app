mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var usertype = self.usertype;
	//var authapplyid;
	console.log(self.usertype);
	console.log(userid);
	$('#submit').on("click", function() {
		var imglen = $(".image-item img").length;
		if(imglen == 0) {
			plus.nativeUI.toast("请上传能够证明您身份的相关证件", toastStyle);
		} else {
			plus.nativeUI.showWaiting();
			typename(userid, usertype);
		}
	})
})

//添加认证申请信息
function typename(userid, usertype) {
	mui.ajax(baseUrl + "/ajax/authApply", {
		data: {
			"professorId": userid,
			"applyType": usertype
		},
		dataType: 'json', //数据格式类型
		type: 'post', //http请求类型
		async: false,
		timeout: 10000, //超时设置
		success: function(data) {
			if(data.success) {
				var identityPage = plus.webview.getWebviewById('../html/identity.html');
				plus.webview.close(identityPage);
				console.log(data.data);
				var authapplyid = data.data;
				mui(".image-item img").each(function() {
					var base64 = this.getAttribute("data-preview-src");
					console.log(base64);
					typeimg(authapplyid, base64);
				});
				plus.nativeUI.closeWaiting();
			    var securityPage = plus.webview.getWebviewById('../html/security.html');
				mui.fire(securityPage,'sPage', {
					//phonetel:phoneName.value
				});
				//plus.webview.open(securityPage);
				mui.back();
				
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}

//添加申请认证图片
function typeimg(authapplyid, base64) {
	mui.ajax(baseUrl + "/ajax/authImage", {
		data: {
			"authApplyId": authapplyid,
			"base64": base64
		},
		dataType: 'json', //数据格式类型
		type: 'post', //http请求类型
		async: false,
		timeout: 10000, //超时设置
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.success) {
				plus.nativeUI.toast("认证图片上传成功", toastStyle);
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}

//选取图片的来源，拍照和相册  
function showActionSheet() {
	var actionbuttons = [{
		title: "拍照"
	}, {
		title: "相册选取"
	}];
	var actionstyle = {
		title: "选择照片",
		cancel: "取消",
		buttons: actionbuttons
	};
	plus.nativeUI.actionSheet(actionstyle, function(e) {
		if(e.index == 1) {
			getImage();
		} else if(e.index == 2) {
			galleryImg();
		}
	});
}

//获取相册照片
function galleryImg() {
	plus.gallery.pick(function(e) {
		//alert(e.files.length);
		var zm = 0;
		setTimeout(file, 200);

		function file() {
			plus.io.resolveLocalFileSystemURL(e.files[zm], function(entry) {
				// console.log(entry.toLocalURL())
				uploadHead(entry.toLocalURL())
			}, function(e) {
				plus.nativeUI.toast("读取拍照文件错误：" + e.message);
			});
			zm++;
			if(zm < e.files.length) {
				setTimeout(file, 200);
			}
		}

	}, function(e) {
		console.log("取消选择图片");
		plus.nativeUI.toast("请在系统设置中，允许科袖访问您的相册，用于上传照片。", toastStyle);
	}, {
		filename: "_doc/camera/",
		filter: "image",
		multiple: true
	});
}

//拍照  
function getImage() {
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		//alert(p);//_doc/camera/1467602809090.jpg  
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			console.log(entry.toLocalURL())
			uploadHead(entry.toLocalURL())
		}, function(e) {
			plus.nativeUI.toast("读取拍照文件错误：" + e.message);
		});
	}, function(e) {
		plus.nativeUI.toast("请在系统设置中，允许科袖访问您的相机，用于拍摄照片。", toastStyle);
	}, {
		filename: "_doc/camera/",
		index: 1
	});
}

//上传图片
function uploadHead(imgPath) {
	console.log("imgPath = " + imgPath);
	mainImage = imgPath;
	//mainImage.style.width = "60px"; 
	//mainImage.style.height = "60px"; 

	var image = new Image();
	image.src = imgPath;
	image.onload = function() {
		var imgData = getBase64Image(image);
		console.log(imgData);
		showImgDetail(imgData, mainImage);
	}
}

//将图片压缩转成base64 
function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	var width = img.width;
	var height = img.height;
	// calculate the width and height, constraining the proportions 
	/* if (width > height) { 
	     if (width > 100) { 
	         height = Math.round(height *= 100 / width); 
	         width = 100; 
	     } 
	 } else { 
	     if (height > 100) { 
	         width = Math.round(width *= 100 / height); 
	         height = 100; 
	     } 
	 } */
	canvas.width = width; /*设置新的图片的宽度*/
	canvas.height = height; /*设置新的图片的长度*/
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height); /*绘图*/
	var dataURL = canvas.toDataURL("image/jpeg", 0.8);
	return dataURL.replace("data:image/jpeg;base64,", "");
}

//删除图片
mui(document).on("tap", '.del', function() {
	var $this = $(this);
	var bts = ["是", "否"];
	plus.nativeUI.confirm("是否删除图片？", function(e) {
		var i = e.index;
		if(i == 0) {
			$this.parent().remove();
		}
	}, "删除图片", bts);
});

//拼接图片样式
function showImgDetail(newsrc, oldsrc) {
	var html = "";
	html += '<div  class="image-item" style="float: left;margin-right:10px">';
	html += '    <img id="picBig" data-preview-src="' + newsrc + '" data-preview-group="1" src="' + oldsrc + '"/>';
	html += '    <span class="del">';
	html += '        <div class="fa fa-times-circle">X</div>';
	html += '    </span>';
	html += '</div>';
	$("#F_CKJLBS").append(html);
}