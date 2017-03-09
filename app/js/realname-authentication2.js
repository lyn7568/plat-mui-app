//实名认证
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	$('#submit').on("click", function() {
		var arr = $(".image-item img");
		if(arr.length == 0) {
			plus.nativeUI.toast("请上传您身份证的正反面照片", toastStyle);
		} else {
			var temp = [];
			for(var i = 0;i<arr.length;i++){
			    temp.push(arr[i].getAttribute("data-url"));
			}
			mui.openWindow({
				url: '../html/expert-authentication.html',
				id: 'expert-authentication.html',
				show: {
					aniShow: "slide-in-right"
				},
				extras:{
			        num:1,
			        imgarr:temp
			    }
			});
		}
	})
})

//拼接图片样式
function showImgDetail(file, cacheKey) {
	var html = "";
	html += '<div  class="image-item" style="float: left;margin-right:10px">';
	html += '    <img id="picBig" data-preview-src="" data-preview-group="1" data-url="'+ cacheKey +'" src="' + file + '"/>';
	html += '    <span class="del">';
	html += '        <div class="fa fa-times-circle">X</div>';
	html += '    </span>';
	html += '</div>';
	var imglen = $(".image-item img").length;
	if(imglen>=3){ 
		plus.nativeUI.toast("最多上传3张照片", toastStyle);		
	}else{
		$("#F_CKJLBS").append(html);
	}
}
