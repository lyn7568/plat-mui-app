mui.ready(function(){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		var con=document.getElementById("question");
		con.addEventListener("keyup", function() {
				if(this.value.length>0) {
					document.getElementById("refer").removeAttribute("disabled");
				}else if(this.value.length==0) {
					document.getElementById("refer").setAttribute("disabled","true");
				}
			})
		document.getElementById("refer").addEventListener("tap",function(){
			if(!plus.storage.getItem('userid')){
				mui.openWindow({
				url: '../html/login.html',
				id: '../html/login.html',
				show: {
					aniShow: "slide-in-right"
				},
				extras:{
					ourl:self.id
				}
			});
			return;
			}
			if(con.value.length>500) {
				plus.nativeUI.toast("内容不能超过500个字");
				return;
			}
			var userid = plus.storage.getItem('userid');
			mui.ajax(baseUrl + "/ajax/feedback/error/"+self.name, {
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				data: {
					id: self.proid,
					cnt:document.getElementById("question").value,
					user:userid
				},
				timeout: 10000, //超时设置				
				success: function(data) {
					if(data.success) {
						mui.back();
					}
				}
			})
		})
		window.addEventListener("newId", function(event) {
		alert(111)
	});
	})
})
