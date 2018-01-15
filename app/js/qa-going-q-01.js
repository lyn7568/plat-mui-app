mui.ready(function(){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		var con=document.getElementById("question");
		con.addEventListener("input", function() {
			if(this.value.length>0) {
				document.getElementById("fontAdd").innerHTML = this.value.length;
				this.value=this.value.substr(0,50);
			}else if(this.value.length==0) {
			}
			document.getElementById("fontAdd").innerHTML = this.value.length;
		})
		document.getElementsByClassName("topsave")[0].addEventListener("tap",function(){
			if(con.value.length>50) {
				plus.nativeUI.toast("提问不可超过50个字");
				return;
			}
			if(con.value.length<5 || con.value.length==0) {
				plus.nativeUI.toast("提问不得少于5个字");
				return;
			}
			var lastStr=con.value.substr(con.value.length-1,1)
			if(lastStr !="?" && lastStr !="？") {
				plus.nativeUI.toast("提问最好以问号结尾");
				return;
			}
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-going-q-02.html", 'qa-going-q-02.html', {}, {
				title: con.value
			});
		})
	})
})
