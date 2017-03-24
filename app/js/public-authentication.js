//认证公用文件

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

/*摄像头拍照*/
function getImage() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var imgurl = entry.toLocalURL();
			var task = plus.uploader.createUpload(baseUrl + "/ajax/cachedFileUpload", 
				{ method:"POST",blocksize:204800,priority:100 },
				function ( t, status ) {
					// 上传完成
					if ( status == 200 ) {
						var odata= JSON.parse(t.responseText);
						if(odata.success){
							cacheKey = odata.data[0].cacheKey;
							showImgDetail(imgurl, cacheKey);
						}
					}
				}
			);
			task.addFile( imgurl, {key:"testdoc"} );
			task.start();
			
		}, function(e) {
			plus.nativeUI.toast("读取拍照文件错误", toastStyle);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: ""
	})
}

/*相册获取照片*/
function galleryImg() {
	var cacheKey;
	plus.gallery.pick(function(file) {
		var task = plus.uploader.createUpload(baseUrl + "/ajax/cachedFileUpload", 
			{ method:"POST",blocksize:204800,priority:100 },
			function ( t, status ) {
				// 上传完成
				if ( status == 200 ) {
					var odata= JSON.parse(t.responseText);
					if(odata.success){
						cacheKey = odata.data[0].cacheKey;
						showImgDetail(file, cacheKey);
					}
				}
			}
		);
		task.addFile( file, {key:"testdoc"} );
		task.start();
	}, function(err) {
		console.log(JSON.stringify(err));
	}, {
		filter: 'image',
		multiple: false
	});
}

//删除图片
mui(document).on("click", '.del', function() {
	var $this = $(this);
	var bts = ["是", "否"];
	plus.nativeUI.confirm("是否删除图片？", function(e) {
		var i = e.index;
		if(i == 0) {
			$this.parent().remove();
		}
	}, "删除图片", bts);
});
