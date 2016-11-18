mui.ready(function() {
	
	var ozixun = document.getElementById("zixun");
	
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var proId = JSON.parse(self.id).proid;

		/*点击咨询*/
		ozixun.addEventListener('tap',function() {
			mui.openWindow({
			    url:'consultapply.html',
			    id:'consultapply.html',
			    extras:{'proId':proId}
			});
			
		});
		
	});
})
