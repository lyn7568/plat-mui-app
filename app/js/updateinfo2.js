mui.ready(function() {		
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');		
		var ws=plus.webview.currentWebview();		
		var str = JSON.stringify(ws);	    	
    	document.getElementsByClassName("borderarea")[0].innerText=ws.descp;  
    	document.getElementsByClassName("topsave")[0].addEventListener("tap",function(){
    		mui.ajax(baseUrl + '/ajax/professor/descp', {
				data:{
					"id": userid,
 					"descp":document.getElementsByClassName("borderarea")[0].innerText 
				},
				dataType: 'json', //数据格式类型
				async: false,
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(data.success);
					if(data.success) {
						ws.close();
						var web=plus.webview.getWebviewById("html/proinforupdate.html");
						mui.fire(web,"newId");						
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
    	});
	});
})    



