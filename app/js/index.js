//首页
mui.ready(function() {
	/*定义全局变量*/
	var isLogin = document.getElementById("isLogin");
	var indexlist = document.getElementById("indexlist");
	var search = document.getElementById("search");
	
	mui.plusReady(function() {
		
		/*点击个人中心按钮*/
		isLogin.addEventListener('tap', function() {
			mui.openWindow({
				url: 'html/myaccount.html',
				id: 'html/myaccount.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		});
		
		/*点击搜索按钮*/
		search.addEventListener('focus', function() {
			var searchpage = mui.preload({
			    url: 'html/search.html',
				id: 'html/search.html',
			});
			searchpage.show("slide-in-right",150);
		});
		
		mui.ajax(baseUrl + '/ajax/professor/pqBaseInfo', {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			success: function($data) {
				var str = JSON.stringify($data.data)
				console.log(str);
				var finallist = '';
				if($data.success) {
					for(var i = 0; i < $data.data.pageSize; i++) {
						
						/*获取头像*/
						if($data.data.data[i].hasHeadImage == 1) {
							var img = "images/head/" + $data.data.data[i].id + "_m.jpg";
						} else {
							var img = "images/default-photo.jpg";
						}
						
						/*获取研究方向信息*/
						var researchAreas = $data.data.data[i].researchAreas;
						var rlist = ''
						for(var n = 0; n < researchAreas.length; n++) {
							console.log(researchAreas[n].caption);
							rlist+= '<span>' + researchAreas[n].caption + '</span>、';
						}
						
		               	//创建HTML标签  
						finallist += '<li class="mui-table-view-cell mui-media"><a class="proinfor" ';
						finallist += '<p><img class="mui-media-object mui-pull-left headimg" src="' + img + '"></p>';
						finallist += '<div class="mui-media-body">';
						finallist += '<span class="listtit">' + $data.data.data[i].name + '<img class="smallicon authicon" src="images/authicon.png"/></span>';
						finallist += '<p class="listtit2"><span>' + $data.data.data[i].title + '</span>，<span>职务</span>，<span>' + $data.data.data[i].orgName + '</span> | <span>' + $data.data.data[i].address + '</span></p>';
						finallist += '<p class="mui-ellipsis listtit3">'+rlist+'</p>';
						finallist += '<p class="mui-ellipsis listtit3"><span>设备资源名称A</span>、<span>设备资源名称B</span>、<span>设备资源名称B</span></p>';
						finallist += '</div></a></li>';
					}
				}
				indexlist.innerHTML = finallist;
				
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	});
});
