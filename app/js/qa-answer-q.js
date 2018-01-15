mui.ready(function(){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview(),
			anid=self.anid,
			quid =self.quid,
			qutit=self.qutit,
			qucnt=self.qucnt;
		var userid = plus.storage.getItem('userid'),
			username = plus.storage.getItem('username');
		if(qucnt){
			document.getElementById("question").value=qucnt
		}
		document.getElementById("questionTit").innerHTML=qutit
		plus.nativeUI.closeWaiting();
		self.show("slide-in-right", 150);
		
		var con=document.getElementById("question")
		document.getElementsByClassName("topsave")[0].addEventListener("tap",function(){
			if(con.value.length<10) {
				plus.nativeUI.toast("回答不得少于10个字");
				return;
			}
			var typeurl,dataStr={},tip
			if(qucnt){
				typeurl='/ajax/question/answer/modify'
				dataStr={
					"id": anid,
					"cnt": con.value,
					"uid": userid,
					"uname": username
				}
				tip="回答修改成功"
			}else{
				typeurl='/ajax/question/answer'
				dataStr={
					"qid": quid,
					"cnt": con.value,
					"uid": userid,
					"uname": username
				}
				tip="回答发布成功"
			}
			mui.ajax(baseUrl + typeurl, {
				data: dataStr,
				dataType: 'json',
				async: false,
				type: 'POST',
				success: function(data) {
					if(data.success) {
						plus.nativeUI.toast(tip, toastStyle);
						mui.back();
					}
				}
			});
			
		})
	})
})
