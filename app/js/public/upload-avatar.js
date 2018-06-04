/*头像上传*/
var userimg = document.getElementById("userimg");
var flag;
var headFlag;
var resouFlag;
mui.plusReady(function() {
	
	var ws = plus.webview.currentWebview();
	var resourceId = ws.resourceId;
	var web = plus.webview.getWebviewById("html/proinforupdate.html");
	var web1 = plus.webview.getWebviewById("resinforupdate.html");
	
	userimg.addEventListener("click", function() {
		flag = this.getAttribute("flag");
		headF = this.getAttribute("headFlag");
		resouF = this.getAttribute("resouFlag");
		console.log(resouFlag)
		console.log(headF);
		console.log(flag);
		if(mui.os.plus) {
			var a = [{
				title: "拍照"
			}, {
				title: "从手机相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "修改头像",
				cancel: "取消",
				buttons: a
			}, function(b) {
				switch(b.index) {
					case 0:
						break;
					case 1:
						getImage(); //照相机
						break;
					case 2:
						galleryImg(); //相册
						break;
					default:
						break
				}
			})
		}
	})

	/*摄像头拍照*/
	function getImage() {
		var c = plus.camera.getCamera();
		c.captureImage(function(e) {
			plus.io.resolveLocalFileSystemURL(e, function(entry) {
				mui.openWindow({
					url: '../html/picture-upload.html',
					id: 'html/picture-upload.html',
					show: {
						aniShow: "slide-in-right"
					},
					extras: {
						imgurl: entry.toLocalURL(),
						flag: flag,
						resourceId: resourceId,
						headFlag: headF,
						resouFlag: resouF
					}
				});
			}, function(e) {
				plus.nativeUI.toast("读取拍照文件错误", toastStyle);
			});
		}, function(s) {
			console.log(JSON.stringify(s));
			if(s.code==11)
			plus.nativeUI.toast("请在系统设置中，允许科袖访问您的相机，用于拍摄照片。", toastStyle);
		}, {
			filename: ""
		})
	}

	/*相册获取照片*/
	function galleryImg() {
		plus.gallery.pick(function(file) {
			changeToLocalUrl(file);
		}, function(err) {
			console.log(JSON.stringify(err));
			if(err.code==8) 
			plus.nativeUI.toast("请在系统设置中，允许科袖访问您的相册，用于上传照片。", toastStyle);
		}, {
			filter: 'image',
			multiple: false
		});
	}

	function changeToLocalUrl(path) {
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			mui.openWindow({
				url: '../html/picture-upload.html',
				id: 'html/picture-upload.html',
				show: {
					aniShow: "slide-in-right"
				},
				extras: {
					imgurl: entry.toLocalURL(),
					flag: flag,
					resourceId: resourceId,
					headFlag: headF,
					resouFlag: resouF
				}
			});
		});
	}

})