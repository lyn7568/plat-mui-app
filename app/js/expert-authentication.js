//专家认证
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var num = self.num;
    var imgarr = self.imgarr;
	$('#submit').on("click", function() {
		var arr = $(".image-item img");
		if(arr.length == 0) {
			plus.nativeUI.toast("请上传能够证明您专家身份的相关证件", toastStyle);
		} else {
			var temp = [];
			for(var i = 0;i<arr.length;i++){
			    temp.push(arr[i].getAttribute("data-url"));
			}
			var bts = ["是", "否"];
			plus.nativeUI.confirm("确认提交认证信息？一旦审核通过后，将不可更改。", function(e) {
				var i = e.index;
				if(i == 0) {
					plus.nativeUI.showWaiting();
					if(num==1){
						typeimg(userid,imgarr)
						expertimg(userid,temp);
					}else{
						expertimg(userid,temp);
					}
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
	if(imglen>=5){ 
		plus.nativeUI.toast("最多上传5张照片", toastStyle);		
	}else{
		$("#F_CKJLBS").append(html);
	}
}

//提交专家认证图片
function expertimg(userid,temp) {
	mui.ajax(baseUrl + "/ajax/authApply/expert", {
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
				plus.nativeUI.toast("认证信息提交成功！我们将尽快对您的信息进行认证，通过后您将成为科袖认证专家，获得特殊功能权限！", toastStyle);
				var myPage = plus.webview.getWebviewById('html/myaccount.html');
				mui.fire(myPage,'mPage', {});					
				var curr = plus.webview.currentWebview();
                var wvs = plus.webview.all();
                for (var i = 0, len = wvs.length; i < len; i++) {
                    if (wvs[i].getURL() == curr.getURL())
                        continue;
                    plus.webview.close(wvs[i]);
                }
                plus.nativeUI.closeWaiting();
                setTimeout(function() {
					 plus.webview.open('../index.html');
                	 curr.close();
				}, 500);
               
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}

//提交实名认证图片
function typeimg(userid,imgarr) {
	mui.ajax(baseUrl + "/ajax/authApply/realName", {
		data: {
			"professorId": userid,
			"fns": imgarr
		},
		dataType: 'json', //数据格式类型
		type: 'post', //http请求类型
		async: false,
		timeout: 10000, //超时设置
		traditional:true,//传数组必须加这个
		success: function(data) {
			//console.log(JSON.stringify(data));
			if(data.success) {
				var securityPage = plus.webview.getWebviewById('../html/security.html');
				mui.fire(securityPage,'sPage', {});					
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}