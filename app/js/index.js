//首页
mui.ready(function() {
	/*定义全局变量*/
	var isLogin = document.getElementById("isLogin");
	var indexlist = document.getElementById("indexlist");
	
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
		
		mui.ajax(baseUrl + '/ajax/professor/qa', {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			success: function($data) {
				var str = JSON.stringify($data.data)
				console.log(str);
				var finallist='';
				if($data.success){
					for(var i = 0 ; i < $data.data.pageSize; i++){
					   //创建HTML标签  
					   finallist +='<li class="mui-table-view-cell mui-media"><a class="proinfor" ';
					   finallist +='<img class="mui-media-object mui-pull-left headimg" src="images/default-photo.jpg">';
					   finallist +='<div class="mui-media-body">';
					   finallist +='<span class="listtit">'+$data.data.data[i].name+'<img class="smallicon authicon" src="images/authicon.png"/></span>';
					   finallist +='<p class="listtit2"><span>'+ $data.data.data[i].title +'</span>，<span>职务</span>，<span>'+ $data.data.data[i].orgName +'</span> | <span>所在地</span></p>';
					   finallist +='<p class="mui-ellipsis listtit3"><span>'+ $data.data.data[i].industry +'</span>、<span>研究方向标题B</span></p>';
					   finallist +='<p class="mui-ellipsis listtit3"><span>设备资源名称A</span>、<span>设备资源名称B</span>、<span>设备资源名称B</span></p>';
					   finallist +='</div></a></li>';
					}
			    }
				indexlist.innerHTML=finallist;
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	});
});
