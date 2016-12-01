/*头像上传*/
var userimg = document.getElementById("userimg");

window.addEventListener('closePage', function(event) {
	bimg = event.detail.id;
	var imgvar='<img src="'+bimg+'" style="width:100%"/>';  
	userimg.innerHTML=imgvar;
});

mui.plusReady(function() {

	userimg.addEventListener("tap", function() {
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
					}
				});
			}, function(e) {
				plus.nativeUI.toast("读取拍照文件错误", toastStyle);
			});
		}, function(s) {
			console.log("error" + s);
		}, {
			filename: "_doc/head.jpg"
		})
	}

	/*相册获取照片*/
	function galleryImg() {
		plus.gallery.pick(function(file) {
			changeToLocalUrl(file);
		}, function(err) {
			console.log(JSON.stringify(err));
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
				}
			});
		});
	}

})