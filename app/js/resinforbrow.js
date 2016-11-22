//资源信息页面 

mui.plusReady(function() {
	var yesExpert = document.getElementById("yesExpert");
	var noExpert = document.getElementById("noExpert");
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var resourceId = self.resourceId;

	ifCollection();

	yesExpert.addEventListener('tap', function() {
		var $this = this;
		collectionExpert($this);
	});
	
	noExpert.addEventListener('tap',function() {
		var $this=this;
		cancelCollectionExpert($this);
	});

	/*判断是否收藏资源*/
	function ifCollection() {
		mui.ajax(baseUrl + '/ajax/watch/hasWatch', {
			data: {
				"professorId": userid,
				"watchObject": resourceId
			},
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success && data.data != null) {
					yesExpert.style.display = "none";
					noExpert.style.display = "block";
				} else {
					yesExpert.style.display = "block";
					noExpert.style.display = "none";
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*收藏资源*/
	function collectionExpert($this) {
		mui.ajax(baseUrl + '/ajax/watch', {
			data: {
				"professorId": userid,
				"watchObject": resourceId,
				"watchType": 2
			},
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					$this.style.display = "none";
					noExpert.style.display = "block";
					//resourceId = data.data;
					//console.log(resourceId)
					plus.nativeUI.toast("资源收藏成功", toastStyle);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*取消收藏资源*/
	function cancelCollectionExpert($this) {
		//console.log(returnId)
		// console.log(userid)
		mui.ajax({
			url: baseUrl + '/ajax/watch/delete',
			data: {
				professorId: userid,
				watchObject: resourceId
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					$this.style.display = "none";
					yesExpert.style.display = "block";
					plus.nativeUI.toast("取消收藏资源", toastStyle);
				}
			},
			error: function(data) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	}

});