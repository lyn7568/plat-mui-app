var Html = '';
	Html += '<a href="http://www.ecorr.org/2017h/">'+
				'<img src="../images/ad/hydh-2017-m.jpg" width="100%">'+
			'</a>'
	
document.getElementsByClassName("advertItem")[0].innerHTML = Html;
		
//处理点击事件，需要打开原生浏览器
mui(".advertItem").on("tap","a",function(){
	var urlHref= this.getAttribute('href');
	if (urlHref) {
		if (window.plus) {
			plus.runtime.openURL(urlHref);
		} else {
			location.href = urlHref;
		}
	}
})