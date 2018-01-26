mui.ready(function(){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview(),
			aflag=self.aflag,
			qutit=self.qutit,
			quid =self.quid;
			
		var userid = plus.storage.getItem('userid'),
			username = plus.storage.getItem('name');
			
		document.getElementById("questionTit").innerHTML=qutit
		
		plus.nativeUI.closeWaiting();
		self.show("slide-in-right", 150);
		
		if(aflag){
			var anid=self.anid,
				qucnt=self.qucnt;
			document.getElementById("question").value=qucnt
			var con=document.getElementById("question")
			document.getElementsByClassName("topsave")[0].addEventListener("tap",function(){
				if(con.value.length<10) {
					plus.nativeUI.toast("回答不得少于10个字");
					return;
				}
				mui.ajax(baseUrl + '/ajax/question/answer/modify', {
					data: {
						"id": anid,
						"cnt": con.value,
						"uid": userid,
						"uname": username
					},
					dataType: 'json',
					type: 'POST',
					success: function(data) {
						if(data.success) {
							console.log("xiugai"+JSON.stringify(data))
							plus.nativeUI.toast("回答修改成功", toastStyle);
							
							mui.back()
						}
					}
				})
			});
		}else{
			var con=document.getElementById("question")
			document.getElementsByClassName("topsave")[0].addEventListener("tap",function(){
				if(con.value.length<10) {
					plus.nativeUI.toast("回答不得少于10个字");
					return;
				}
				mui.ajax(baseUrl + '/ajax/question/answer', {
					data: {
						"qid": quid,
						"cnt": con.value,
						"uid": userid,
						"uname": username
					},
					dataType: 'json',
 					type: 'POST',
					success: function(data) {
						console.log("fabu"+JSON.stringify(data))
						if(data.success) {
							plus.nativeUI.toast("回答发布成功", toastStyle);
							
							var questionPage = plus.webview.getWebviewById('qa-question-show.html');
							mui.fire(questionPage, 'afterAnswer', {
								"quid": quid
							});
						  	plus.webview.currentWebview().close()
						}
					}
				});
			})
		}
		
	})
})
