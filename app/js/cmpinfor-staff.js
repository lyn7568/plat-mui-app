mui.ready(function() {
	mui.plusReady(function() {
		mui(".cmpClassNum").on("tap","li",function(){
			var oStringText=this.innerText;
			var arr=new Array();
			arr[0]=plus.webview.getWebviewById("cmpinfor-basic.html");
			arr[1]=plus.webview.getWebviewById("cmpinfor-trend.html");			
			arr[2]=plus.webview.getWebviewById("cmpinfor-staff.html");
			if(oStringText=="介绍"){
				arr[0].show();
			}else if(oStringText=="动态"){
				arr[1].show();
			}else if(oStringText=="员工"){
				return;
			}
		})
	});
})