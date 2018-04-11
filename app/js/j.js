 mui.ready(function() {
 	mui.plusReady(function() {
 		client1()
 		if(mui.os.ios) {
 			plus.push.addEventListener("click", function(msg) {
 				plus.push.clear();
 				plus.webview.getLaunchWebview().show();
 				plus.webview.getWebviewById("html/consult_home.html").show();
 				mui(".mui-tab-item").each(function(index) {
 					if(index == 2) {
 						this.classList.add("mui-active");
 					} else {
 						this.classList.remove("mui-active");
 					}
 				})
 			});
 		} else {

 			plus.push.addEventListener("receive", function(msg) {
 				//plus.push.clear();
 				plus.webview.getLaunchWebview().show();
 				plus.webview.getWebviewById("html/consult_home.html").show();
 				mui(".mui-tab-item").each(function(index) {
 					if(index == 2) {
 						this.classList.add("mui-active");
 					} else {
 						this.classList.remove("mui-active");
 					}
 				})
 			}, false);
 		}
 	});

 })