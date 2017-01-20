mui.ready(function() {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		var proId = self.professorId;

		function userInformation() {
			mui.ajax(baseUrl + "/ajax/consult/pqAssessHis", {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				data: {
					"professorId": proId
				},
				timeout: 10000, //超时设置
				success: function(data) {
					var str = JSON.stringify(data);
					console.log(str)
					var $info = data.data.data || {}
					if(data.success) {
						plus.nativeUI.closeWaiting();
						plus.webview.currentWebview().show("slide-in-right", 150);
						for(var i = 0; i < data.data.data.length; i++) {
							var assessTime = $info[i]["assessTime"].substr(0, 4) + "年" + $info[i].assessTime.substr(4, 2) + "月" + $info[i].assessTime.substr(6, 2) + "日" +
								$info[i].assessTime.substr(8, 2) + ":" + $info[i].assessTime.substr(10, 2);
							var li = document.createElement('li');
							li.className = 'mui-table-view-cell mui-media NoActive'
							var string = '<a class="proinfor" >'
							string += '<div class="mui-pull-left lefthead">'
							if($info[i].professor.hasHeadImage) {
								string += '<img class="mui-media-object headimg headRadius" src="' + baseUrl + '/images/head/' + $info[i].professor.id + '_l.jpg">'
							} else {
								string += '<img class="mui-media-object headimg headRadius" src="../images/default-photo.jpg">'
							}

							string += '<p class="listtit0">' + $info[i].professor.name + '</p>'
							string += '</div>'
							string += '<div class="mui-media-body">'
							string += '<div class="contit">'
							string += '<span class="mui-ellipsis listtit">' + assessTime + '</span>'
							string += '<div class="conresoult">'
							string += '<div class="levelbox">'
							string += '<span class="mui-icon iconfont icon-favor star"></span>'
							string += '<span class="mui-icon iconfont icon-favor star"></span>'
							string += '<span class="mui-icon iconfont icon-favor star"></span>'
							string += '<span class="mui-icon iconfont icon-favor star"></span>'
							string += '<span class="mui-icon iconfont icon-favor star"></span>'
							string += '</div>'
							string += '</div>'
							string += '</div>'
							string += '<p class="listtit2 conbrief">'
							if($info[i].assessContant) string += $info[i].assessContant;
							string += '</p>'
							string += '</div></a>'
							li.innerHTML = string;
							document.getElementsByClassName(" protable")[0].appendChild(li);
							var startLeval = parseInt($info[i].assessStar);
							var start = document.getElementsByClassName("NoActive")[i].getElementsByClassName("star");
							for(var j = 0; j < startLeval; j++) {
								start[j].classList.remove("icon-favor");
								start[j].classList.add("icon-favorfill");
							}
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		userInformation();
	});

});