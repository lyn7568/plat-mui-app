//公共文件
mui.init();
var baseUrl="http://192.168.3.173:8080",
    toastStyle={'verticalAlign':'top'}
mui.plusReady(function(){
	


    var userId = plus.storage.getItem('userid');
 });   
    function myAccount(){
		/*var productView = mui.preload({
		    url:'html/myaccount.html',
			id:'html/myaccount.html',
			show:{
				aniShow:"slide-in-bottom",
			}
		});
		productView.show(); */
		mui.openWindow({
  			url:'html/myaccount.html',
  			id:'html/myaccount.html',
  			show:{
            	aniShow:"slide-in-right"
  			}
      	});	 
	}
    
    function goHome(){
		mui.openWindow({
  			url:'../index.html',
  			id:'../index.html',
  			show:{
            	aniShow:"slide-in-right"
  			}
      	});	 
	}
    
    function goLoginFun(){
		mui.openWindow({
  			url:'../html/login.html',
  			id:'../html/login.html',
  			show:{
            	aniShow:"slide-in-right"
  			}
      	});	 
	}
    
    function goRegFun(){
		mui.openWindow({
  			url:'../html/reg.html',
  			id:'../html/reg.html',
  			show:{
            	aniShow:"slide-in-right"
  			}
      	});	 
	}

