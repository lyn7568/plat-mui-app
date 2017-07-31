mui.plusReady(function() {
//document.getElementById("searchval").focus()
//	if(mui.os.ios) {
//		var webView = plus.webview.currentWebview().nativeInstanceObject();
//		webView.plusCallMethod({
//			"setKeyboardDisplayRequiresUserAction": false
//		});
//	} else {
//		var webview = plus.android.currentWebview();
//		plus.android.importClass(webview);
//		webview.requestFocus();
//		var Context = plus.android.importClass("android.content.Context");
//		var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
//		var main = plus.android.runtimeMainActivity();
//		var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
//		imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
//	}
	
	var search = {
		oAjaxGet: function(url, obj, oType, oFun) {
			mui.ajax(url, {
				data: obj,
				dataType: 'json', //服务器返回json格式数据
				type: oType, //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				traditional: true,
				success: function(data) {
					if(data.success) {
						setTimeout(function() {
							document.getElementById("searchval").focus()
						}, 500)

						oFun(data.data);
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		},
		keyWord: function(data) {
			if(data.lennth == 0) {
				return;
			}
			for(var i = 0; i < data.length; i++) {
				var li = document.createElement('li');
				li.innerHTML = data[i].caption;
				document.getElementsByClassName("hotsearchNew")[0].appendChild(li);
			}
		},
		createWin: function(keyValue) {
			document.activeElement.blur();
			mui.openWindow({
				url: '../html/searchListNew2.html?content=1',
				id: '../html/searchListNew2.html',
				show: {
					autoShow: false,
					aniShow: "fade-in",
				},
				extras: {
					key: keyValue,
					qiFlag: 1
				}
			});
			
		}
	}

	search.oAjaxGet(baseUrl + "/ajax/dataDict/qlHotKey", {}, "get", search.keyWord);

	mui(".hotsearchNew").on("tap", "li", function() {
		search.createWin(this.innerHTML);
	});

	/*按键字搜索*/
	document.getElementById("searchval").addEventListener("keyup", function(e) {
		if(e.keyCode == 13) {
			search.createWin(this.value);
		}
	})

})