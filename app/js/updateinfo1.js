mui.ready(function() {		
	mui.plusReady(function(){
		alert(1);
		var ws=plus.webview.currentWebview();
		alert(ws);
		console.log(ws.name);       
	});
})          