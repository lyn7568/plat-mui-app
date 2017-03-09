//实名认证
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	$('#submit').on("click", function() {
		plus.nativeUI.showWaiting();
		var arr = $(".image-item img");
		if(arr.length == 0) {
			plus.nativeUI.toast("请上传您身份证的正反面照片", toastStyle);
		} else {
			var temp = [];
			for(var i = 0;i<arr.length;i++){
			    temp.push(arr[i].getAttribute("data-url"));
			}
			console.log(JSON.stringify(temp))
			var bts = ["是", "否"];
			plus.nativeUI.confirm("确认提交实名信息？一旦审核通过后，将不可更改。", function(e) {
				var i = e.index;
				if(i == 0) {
					typeimg(userid,temp);
				}
			}, "提示", bts);
			
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

//提交实名认证图片
function typeimg(userid,temp) {
	mui.ajax(baseUrl + "/ajax/authApply/realName", {
		data: {
			"professorId": userid,
			"fns": temp
		},
		dataType: 'json', //数据格式类型
		type: 'post', //http请求类型
		async: false,
		timeout: 10000, //超时设置
		traditional:true,//传数组必须加这个
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.success) {
				plus.nativeUI.toast("认证信息提交成功！——我们将尽快对您的信息进行认证。", toastStyle);
				var securityPage = plus.webview.getWebviewById('../html/security.html');
				mui.fire(securityPage,'sPage', {});
				var myPage = plus.webview.getWebviewById('html/myaccount.html');
				mui.fire(myPage,'mPage', {});	
				plus.nativeUI.closeWaiting();
				mui.back();
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}