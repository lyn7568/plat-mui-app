mui.plusReady(function() {
	var userId = plus.storage.getItem('userid');
	myFraction();
	plus.nativeUI.closeWaiting();
	plus.webview.getWebviewById("html/rewards-list.html").show("slide-in-right", 150);
	plus.navigator.setStatusBarBackground( "#1fc4f9" );
	/*当前积分*/
	function myFraction() {
		mui.ajax(baseUrl + "/ajax/growth/queryScore", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			data: {
				"professorId": userId
			},
			success: function(data) {
				var self = plus.webview.currentWebview();
				if(data.success && data.data) {
					document.getElementById("totalFraction").innerText = parseInt(data.data.inviteScore + data.data.myScore);
					document.getElementById("setFraction").innerText = data.data.myScore;
					document.getElementById("rewardFraction").innerText = data.data.inviteScore;
					var scornum = self.score.replace(/%/, "");
					if(scornum > 5){
						document.getElementById("scorePercent").innerText=self.score;
					}else{
						document.getElementById("scorePercenthtml").innerHTML="请再接再厉";
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
})
/*按钮点击切换*/
mui("#listnav").on("tap", "li", function() {
	var dataid = this.getAttribute("data-id");
	var arr = new Array();
	arr[0] = plus.webview.getWebviewById("rewards-list01.html");
	arr[1] = plus.webview.getWebviewById("rewards-list02.html");
	if(dataid == 1) {
		arr[0].show();
	} else if(dataid == 2) {
		arr[1].show();
	}
})
