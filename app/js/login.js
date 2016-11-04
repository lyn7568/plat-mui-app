mui.init()
mui.plusReady(function(){
	var reg = document.getElementById("reg");
	reg.addEventListener("tap",function(){
		mui.openWindow({
			url:"reg.html",
			id:"reg.html",
			show:{
            	aniShow:"slide-in-right"
  			}
		})
	})
})