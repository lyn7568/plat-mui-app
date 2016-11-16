mui.ready(function() {		
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');		
		var ws=plus.webview.currentWebview();		
		var str = JSON.stringify(ws);	
    	console.log(str);  
    	console.log(userid)
    	console.log(baseUrl);
    	var oDt=document.getElementsByClassName("frmtype");
    	oDt[0].value=ws.name;
    	oDt[1].value=ws.orgName;
    	oDt[2].value=ws.department;
    	oDt[3].value=ws.office; 
    	oDt[4].value=ws.title;
    	oDt[5].value=ws.address;
    	function trim(str) { //删除左右两端的空格
　　     			return str.replace(/(^\s*)|(\s*$)/g, "");
　　			 }
    	oDt[0].addEventListener("blur",function(){
    		var length=trim(oDt[0].value);
    		if(!length) 
    		plus.nativeUI.toast("姓名不能为空");
    	});
    	oDt[1].addEventListener("blur",function(){
    		var length=trim(oDt[1].value);
    		if(!length)     			
  		plus.nativeUI.toast("所在机构不能为空");
    	});
    	
    	function savePro() {
    		alert(3);
    		var mess= {};
    			mess.name=oDt[0].value;
    			mess.orgName=oDt[1].value;
		    	mess.department=oDt[2].value;
		    	mess.office=oDt[3].value;
		    	mess.title=oDt[4].value;		    	
		    	mess.address=oDt[5].value;
		    	mess.id=userid;
    		   	
    		console.log(mess);
    		var mess1 = JSON.stringify(mess);
    		console.log(mess1);    		
    		$.ajax({
				"url" :baseUrl+'/ajax/professor',
				"type" : "PUT" ,
				"async":true,
				"data" :mess1,
				"beforeSend":function(xhr,settings){console.log(JSON.stringify(settings))},
				"contentType" :"application/json",					
				"success" : function(data) {					
					if (data.success) 
					{
						
					} 
					else
					{
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
					}
				}
			});
			alert(5);
		}
    	
    	document.getElementsByClassName("topsave")[0].addEventListener("click",function(){
    		var length1=trim(oDt[1].value);
    		var length2=trim(oDt[1].value);
    		alert(1);
    		console.log(length1);
    		console.log(length2);
    		if(length1&&length2) {
    			alert(2);
    			savePro();
    		}else if(!length1&&length2) {
    			plus.nativeUI.toast("姓名不能为空");
    		}else if(length1&&!length2) {
    			plus.nativeUI.toast("所在机构不能为空");
    		}else if(!length1&&!length2) {
    			plus.nativeUI.toast("姓名不能为空&&所在机构不能为空");
    		}
    		
    	});  
	});
})              