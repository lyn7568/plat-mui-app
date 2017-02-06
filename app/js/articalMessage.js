mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var proId = self.articleId;

	function proInfoMain() {
		mui.ajax(baseUrl + "/ajax/leaveWord/ql", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			data: {
				"articleId": proId
			},
			timeout: 10000, //超时设置
			success: function(data) {
				var $info = data.data || {};
				if(data.success && data.data) {
					document.getElementsByClassName(" protable")[0].innerHTML = "";
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					var $info = data.data;
					for(var i = 0; i < $info.length; i++) {
						var time = $info[i].createTime.substring(0, 4) + "年" + $info[i].createTime.substring(4, 6) + "月" + $info[i].createTime.substring(6, 8) + "日 " + $info[i].createTime.substring(8, 10) + ":" + $info[i].createTime.substring(10, 12);
						var li = document.createElement('li');
						li.className = 'mui-table-view-cell mui-media';
						var string = '<div class="proinfor">'
						if($info[i].professor.hasHeadImage) {
							string += '<img class="mui-media-object mui-pull-left headimg headRadius" src="' + baseUrl + '/images/head/' + $info[i].professor.id + '_l.jpg">'
						} else {
							string += '<img class="mui-media-object mui-pull-left headimg headRadius" src="../images/default-photo.jpg">'
						}
						string += '<div class="mui-media-body">'
						string += '<div><span class="listtit">' + $info[i].professor.name
						if($info[i].professor.authType) {
							string += '<em class="mui-icon iconfont icon-vip authicon-cu"> </em>';
						} else {
							if($info[i].professor.authStatus) {
								if($info[i].professor.authentication == 1) {
									string += '<em class="mui-icon iconfont icon-renzheng authicon-mana"></em>';
								} else if($info[i].professor.authentication == 2) {
									string += '<em class="mui-icon iconfont icon-renzheng authicon-staff"></em>';
								} else {
									string += '<em class="mui-icon iconfont icon-renzheng authicon-stu"></em>';
								}
							}
						}
						string += '</span><span class="thistime timenow">' + time + '</span></div>'
						string += '<p class="listtit3">' + $info[i].content + '</p>'
						string += '</div> </div>'
						li.innerHTML = string;
						document.getElementsByClassName(" protable")[0].appendChild(li);
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
	proInfoMain();

	function trim(str) { //删除左右两端的空格
		　　
		return str.replace(/(^\s*)|(\s*$)/g, "");　　
	}

	document.getElementById("msg-text").addEventListener("keyup", function() {
		var valueLength = document.getElementById("msg-text").value;
		var length = trim(valueLength);
		if(length) {
			document.getElementById("send").classList.add("add");
			document.getElementById("msg-type").classList.add("addColor");
		} else {
			document.getElementById("send").classList.remove("add");
			document.getElementById("msg-type").classList.remove("addColor");
		}
	});
	mui("#chatFooter").on('tap', '.add', function() {
		article();
	});

	function article() {
		mui.ajax(baseUrl + "/ajax/leaveWord", {
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			data: {
				"articleId": proId,
				"sender": userid,
				"content": document.getElementsByTagName("textarea")[0].value,
			},
			timeout: 10000, //超时设置
			success: function(data) {
				var $info = data.data || {};
				if(data.success && data.data) {
					document.getElementsByTagName("textarea")[0].value = "";
					document.getElementById("msg-type").classList.remove("addColor");
					proInfoMain();
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
});