mui.ready(function() {
	
	var ozixun = document.getElementById("zixun");
	
	
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var proId = self.proid;
		console.log(proId);
		/*点击咨询,切换到咨询页*/
		ozixun.addEventListener('tap',function() {
			mui.openWindow({
			    url:'consultapply.html',
			    id:'consultapply.html',
			    extras:{'proId':proId}
			});
		});
		
		/*咨询成功,返回专家信息*/
		window.addEventListener('backproinfo',function(event){
			var proid = event.detail.proId;
			console.log(proid);
			ozixun.classList.add('displayNone');
		});
		
		
		
	});
})
