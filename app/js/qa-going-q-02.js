mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		self.show("slide-in-right", 150);
	var title=self.title;
	document.getElementsByClassName("qa-title")[0].innerHTML=title;
	var con=document.getElementById("question");
		con.addEventListener("input", function() {
			if(this.value.length>0) {
				document.getElementById("fontAdd").innerHTML = this.value.length;
				this.value=this.value.substr(0,500);
			}else if(this.value.length==0) {
			}
			document.getElementById("fontAdd").innerHTML = this.value.length;
		})
	
	var imgStr=[]
	document.getElementsByClassName("topsave")[0].addEventListener("tap",function(){
		mui(".image-item .imgU").each(function() {
			imgStr.push(this.getAttribute("data-preview-src"));
		});
		
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/qa-going-q-03.html", 'qa-going-q-03.html', {}, {
			cnt: con.value,
			img: imgStr.join(",")
		});
	})
	
})
    var reUrl=baseUrl+'/data/question/';
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
				var task = plus.uploader.createUpload(baseUrl + "/ajax/question/upload", 
					{ method:"POST",blocksize:204800,priority:100 },
					function ( t, status ) {
						// 上传完成
						if ( status == 200 ) {
							console.log(JSON.stringify(t))
							var odata= JSON.parse(t.responseText);
							console.log(JSON.stringify(odata))
							if(odata.success){
								var origurl = odata.data[0].uri
								showImgDetail(origurl);
							}
						}
					}
				);
				task.addFile( imgurl, {key:"testwdoc"} );
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
		plus.gallery.pick(function(file) {
			var task = plus.uploader.createUpload(baseUrl + "/ajax/question/upload", 
				{ method:"POST",blocksize:204800,priority:100 },
				function ( t, status ) {
					// 上传完成
					if ( status == 200 ) {
						var odata= JSON.parse(t.responseText);
						if(odata.success){
							var origurl = odata.data[0].uri
							showImgDetail(origurl);
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
				$("#F_CKJLB").show()
			}
		}, "删除图片", bts);
	});
	
	//拼接图片样式
	function showImgDetail(oldsrc) {
		var newsrc=reUrl+oldsrc
		var html = "";
		html += '<div class="image-item" style="float: left;margin-right:10px">';
		html += '    <div class="imgU" data-preview-src="' + oldsrc + '" data-preview-group="1" style="background-image:url(' + newsrc + ');width:65px;height:65px;background-size:cover;border-radius:6px;overflow:hidden"></div>';
		html += '    <span class="del">';
		html += '        <div class="fa fa-times-circle">X</div>';
		html += '    </span>';
		html += '</div>';
		$("#F_CKJLBS").append(html);
		var imglen = $(".image-item .imgU").length;
		if(imglen==3){ 
			$("#F_CKJLB").hide()
		}else{
			$("#F_CKJLB").show()
		}
	}