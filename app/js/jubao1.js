mui.ready(function() {
	mui.plusReady(function() {
		var professorId = plus.webview.currentWebview().professorId;
		var userid = plus.storage.getItem('userid');
		document.getElementById("question").addEventListener("input",function(){
			if(this.value=="") {
				document.getElementById("logun").setAttribute("disabled", "true");
			}else{
				document.getElementById("logun").removeAttribute("disabled");
			}
		})
		document.getElementById("logun").addEventListener("tap",function(){
			userFun()
		})
		function userFun() {
		
			mui.ajax(baseUrl + '/ajax/feedback/error/professor', {
				"data":{
					id: professorId,
					cnt:document.getElementById("question").value,
					user:userid
				},
				"type": "post",
				"async": true,
				"success": function(data) {
					console.log(JSON.stringify(data))
					if(data.success ) {
						document.getElementById("question").value="";
						document.getElementById("logun").setAttribute("disabled", "true");
						plus.nativeUI.toast("已发送", toastStyle);
					}
				},
				"error": function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
		
	})
})