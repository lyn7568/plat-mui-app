 mui.ready(function () {
 	
 	var oconsulttype_ul = document.getElementById("consulttype_ul");//咨询类型容器
 	var oconsulttitle = document.getElementById("consulttitle");//咨询主题
 	var oconsultcon = document.getElementById("consultcon");//咨询内容
 	/*专家信息*/
 	var oproname = document.getElementById("proname");//专家名字
 	var oprotitle = document.getElementById("protitle");//职称
 	var oprooffice = document.getElementById("prooffice");//职位
 	var oprodepart = document.getElementById("prodepart");//所在部门
 	var oproorgName = document.getElementById("proorgName");//所在机构
 	var oproadress = document.getElementById("proadress");//所在地
 	var opromodify = document.getElementById("promodify");//是否认证
 	var oproimg = document.getElementById("proimg");//专辑头像
 	var oconsultcount = document.getElementById("consultcount");//咨询次数
 	var ostarContainer = document.getElementById("starContainer");//星级容器
 	
 	var osaveconsultBtn = document.getElementById("saveconsultBtn");//保存咨询，发送按钮
 	
 	
 	
 	/*保存咨询*/
 	function saveconsult(proId,userid) {
 		var consultType = oconsulttype_ul.querySelector('.liactive').innerText;
 		var consultcon = oconsultcon.innerText;
 		var consultTitle = oconsulttitle.value;
 		console.log(consultType);
 		console.log(consultTitle);
 		console.log(consultcon);
 		if(consultType == '' || consultType == null) {
 			mui.alert('请选择咨询类型', '');
 		};
 		if(consultTitle == '' || consultTitle == null) {
 			mui.alert('请填写咨询主题', '');
 		};
 		if(consultcon == '' || consultcon == null) {
 			mui.alert('请填写咨询内容', '');
 		};
 		var params = {
 			"consultType":consultType, //咨询类型
			"consultTitle":consultTitle, //咨询主题
			"consultContant":consultcon, //咨询内容
			"professorId":proId, //专家ID
			"consultantId":userid //咨询者ID
 		}
 		mui.ajax(baseUrl+'/ajax/consult',{
 			data:params,
 			dataType:'json',//服务器返回json格式数据
 			type:'post',//HTTP请求类型
 			timeout:10000,//超时时间设置为10秒；
 			success:function(data){
 				console.log(data.data);
 				if(data.success) {
 					mui.toast('咨询成功');
 				}else {
 					/*mui.alert('咨询失败', '');*/
 				}
 			},
 			error:function(xhr,type,errorThrown){
 				
 			}
 		});
 	};  	
 	/*专家信息*/
 	function proinfo(proId) {
 		mui.ajax(baseUrl+'/ajax/professor/editBaseInfo/'+proId,{
 			data:{'id':proId},
 			dataType:'json',//服务器返回json格式数据
 			type:'get',//HTTP请求类型
 			timeout:10000,//超时时间设置为10秒；
 			success:function(data){
 				var myData = data["data"];
 				if(myData["name"] == null || myData["name"] == undefined ) {
 					
 				}else {
 					oproname.innerText = myData["name"];//专家名字
 				}
 				if(myData["title"] == null || myData["title"] == undefined ) {
 					oprotitle.innerHTML = '';
 				}else {
 					oprotitle.innerHTML = myData["title"]+'，';//职称
 				};
 				if(myData["office"] == null || myData["office"] == undefined ) {
 					oprooffice.innerHTML = '';
 				}else {
 					oprooffice.innerHTML = myData["office"];//职位
 				};
 				if(myData["department"] == null || myData["department"] == undefined ) {
 					oprodepart.innerHTML = '';
 				}else {
 					oprodepart.innerHTML = myData["department"]+'，';//所在部门
 				}
 				if(myData["orgName"] == null || myData["orgName"] == undefined ) {
 					oproorgName.innerHTML = '';
 				}else {
 					oproorgName.innerHTML = myData["orgName"];//所在机构
 				}
 				if(myData["adress"] == null || myData["adress"] == undefined ) {
 					oproadress.innerHTML = '';
 				}else {
 					oproadress.innerHTML = '|'+myData["adress"];//所在地
 				}
 				if(myData["consultCount"] == null || myData["consultCount"] == undefined ) {
 					myData["consultCount"] = 0;
 				}else {
 					oconsultcount.innerHTML =  myData["consultCount"];//咨询次数
 				};
 				
 				var emele = document.createElement("em");
 				emele.setAttribute('class','mui-icon iconfont icon-vip');
 				
 				/*是否认证*/
 				if(myData["authentication"] == true){
					emele.classList.add('authicon');
					
				}else if(myData["authentication"] == false){
					emele.classList.add('unauthicon');
				}
				oproname.appendChild(emele);
				console.log(emele.classList);
				
				/*专家头像*/
				if(myData["hasHeadImage"] == 0) {
					oproimg.setAttribute('src','../images/default-photo.jpg');
				}else {
					oproimg.setAttribute('src',baseUrl+'/images/head/'+myData['id']+'_m.jpg');
				}
 				
 				/*星级*/
 				var starLevel = myData['starLevel'];
 				var starlist = ostarContainer.children;
 				for(var i = 0; i < starLevel; i++) {
					starlist[i].classList.remove('icon-favor');
	  				starlist[i].classList.add('icon-favorfill');
				}
 				
 				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right",150);
 				
 			},
 			error:function(xhr,type,errorThrown){
 				plus.nativeUI.toast("服务器链接超时", toastStyle);
 			}
 		});
 	}
 	
 	
 	
   	mui.plusReady(function () {
   		var userid = plus.storage.getItem('userid');
   	    var self = plus.webview.currentWebview();
   	    var proId = self.proId;
   	    var flag = self.flag;
   	    var consulttitle = self.consulttitle;//咨询主题（从资源页面传过来的）
   	    console.log(consulttitle);
   	    console.log(proId);
   	    
   	 	/*专家信息数据*/
   	    proinfo(proId);
   	    if(flag == 'ziyuan') {
   	    	oconsulttitle.value = '关于'+consulttitle+'的咨询';
   	    }
   	    
   	    /*发送保存咨询*/
   	   	osaveconsultBtn.addEventListener('tap',function() {
   	   		saveconsult(proId,userid);
   	   		if(flag == 'ziyuan'){
   	   			/*返回资源信息*/
				var ziyuaninfo = plus.webview.getWebviewById('resinforbrow.html');
				ziyuaninfo.show();
				mui.fire(ziyuaninfo,'backziyuaninfo'); 
   	   		}else if(flag == 'professor'){
   	   			/*返回专家信息*/
				var proinfo = plus.webview.getWebviewById('proinforbrow.html');
				proinfo.show();
				mui.fire(proinfo,'backproinfo',{proId:proId}); 
   	   		}
			

		});
		
   	    
   	    
   	    
   	});
   	
   	
	//鼠标点击联系目的li时添加liactive类
	mui(".aimclass").on('tap','li',function(e){
		var aimlist = document.querySelector('.aimclass').querySelectorAll("li");
		for(var i = 0 ; i < aimlist.length;i++){
			aimlist[i].classList.remove('liactive');
		}
		this.classList.add('liactive');
		
	});
   	
})