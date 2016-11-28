mui.ready(function(){
	var ostarContainer =document.getElementById("starContainer");//星星容器
	var oassesscon =document.getElementById("assesscon");//评价内容
	
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		var consultId = self.consultId;
		console.log(consultId);
		
	});
	
})