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
 	var ofinished = document.getElementById("finished");//点击完成咨询，进入合作历史评价
 	var nameli = document.getElementById("nameli");//认证
 	var clickFlag=true;
 	
 	var osaveconsultBtn = document.getElementById("saveconsultBtn");//保存咨询，发送按钮
 	
 	
 	
 	/*保存咨询*/
 	function saveconsult(proId,userid) {
 		var consultType = oconsulttype_ul.querySelector('.liactive').innerText;
// 		var consultcon = oconsultcon.innerText;
		var consultcon = oconsultcon.innerText;
 		var consultTitle = oconsulttitle.value;
 		console.log(consultType);
 		console.log(consultTitle);
 		console.log(consultcon);
 		if(consultType == '' || consultType == null) {
 			mui.toast('请选择咨询类型', '');
 			return 0;
 		};
 		if(consultTitle == '' || consultTitle == null ) {
 			mui.toast('请填写咨询主题', '');
 			return 0;
 		};
 		if(consultcon == '' || consultcon == null || consultcon=='请详细描述您遇到的问题') {
 			mui.toast('请填写咨询内容', '');
 			return 0;
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
 				//console.log('咨询申请返回值=='+data.data);
 				if(data.success) {
 					plus.nativeUI.toast("咨询申请成功！专家会很快与您联系，请在咨询列表中查看专家回复的信息", toastStyle);
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
 				if(data.success){
 					var myData = data["data"];
 					
 					console.log(JSON.stringify(myData))
 					
	 				if(myData["name"]){
	 					oproname.innerText = myData["name"];//专家名字
	 				};
	 				if(myData["title"]){
	 					oprotitle.innerHTML = myData["title"]+', ';//职称
	 				}
	 				if(myData["office"]){
	 					oprooffice.innerHTML = myData["office"]+', ';//职位
	 				}
	 				if(myData["department"]){
	 					oprodepart.innerHTML = myData["department"]+', ';//所在部门
	 				}
	 				if(myData["orgName"]){
	 					oproorgName.innerHTML = myData["orgName"];//所在机构
	 				}
	 				if(myData["address"]){
	 					oproadress.innerHTML = ' | '+myData["address"];//所在地
	 				}
	 				var starLevel = myData['starLevel'];
	 				if(myData["consultCount"]) {
	 					oconsultcount.innerHTML =  myData["consultCount"];//咨询次数
	 					if(!starLevel){
	 						clickFlag=false;
						document.getElementById("NoActive").classList.add("NoActive");
						document.getElementsByClassName("levelbox")[0].style.display = "none";
						document.getElementById("accessHistory").classList.remove("mui-navigate-right");
	 					}
	 				}else {
	 					ofinished.style.display="none"; 
	 				};
	 				if(!myData.authType&&(myData.authentication == 2||myData.authentication == 3)){
	 					ofinished.style.display="none"; 
	 				}
	 				/*是否认证*/
					if(myData.authType) {
						nameli.classList.add('icon-vip');
						nameli.classList.add('authicon-cu');
					} else {
						if(myData.authStatus==3) {
							if(myData.authentication == 1) {
								nameli.classList.add('icon-renzheng');
								nameli.classList.add('authicon-mana');
//								nameli.innerHTML = "<span>科研</span>";
							} else if(myData.authentication == 2) {
								nameli.classList.add('icon-renzheng');
								nameli.classList.add('authicon-staff');
//								nameli.innerHTML = "<span>企业</span>";
							} else {
								nameli.classList.add('icon-renzheng');
								nameli.classList.add('authicon-stu');
//								nameli.innerHTML = "<span>学生</span>";
							}
						}
					}
					
					/*专家头像*/
					if(myData["hasHeadImage"] == 0) {
						oproimg.setAttribute('src','../images/default-photo.jpg');
					}else {
						oproimg.setAttribute('src',baseUrl+'/images/head/'+myData['id']+'_l.jpg');
					}
	 				
	 				/*星级*/
	 				
	 				var starlist = ostarContainer.children;
	 				for(var i = 0; i < starLevel; i++) {
						starlist[i].classList.remove('icon-favor');
		  				starlist[i].classList.add('icon-favorfill');
					}
	 				
	 				plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right",150);
 					
 				}
 				
 			},
 			error:function(xhr,type,errorThrown){
 				plus.nativeUI.toast("服务器链接超时", toastStyle);
 			}
 		});
 	}

 	/*咨询申请字数限制*/
	function checkLen(obj) {  
		var maxChars = 300;//最多字符数  
		if (obj.innerText.length > maxChars) {
			obj.innerText = obj.innerText.substring(0,maxChars); 
		}
		var curr = maxChars - obj.innerText.length;  
		document.getElementById("count").innerHTML = curr.toString(); 	
	};
 	oconsultcon.addEventListener('keyup',function(){
		checkLen(oconsultcon);
	});
 	
 	
 	
   	mui.plusReady(function () {
   		var userid = plus.storage.getItem('userid');
   	    var self = plus.webview.currentWebview();
   	    var proId = self.proId;
   	    var flag = self.flag;
   	    var consulttitle = self.consulttitle;//咨询主题（从资源页面传过来的）
   	    
   	    
   	 	/*专家信息数据*/
   	    proinfo(proId);
   	    if(flag == 'ziyuan') {
   	    	oconsulttitle.value='关于'+consulttitle+'的咨询' ;
   	    	var lilist = oconsulttype_ul.querySelectorAll('li');
   	    	var oziyuanspan = document.getElementById("ziyuanspan");
   	    	for(var i = 0 ; i < lilist.length; i++){
   	    		lilist[i].classList.remove('liactive');
   	    		lilist[i].querySelector("em").classList.remove('icon-check'); 
   	    		lilist[1].classList.add('liactive');
   	    		lilist[1].querySelector("em").classList.add('icon-check');;
   	    	}
   	    	
   	    }
   	    
   	    /*发送保存咨询*/
   	   	osaveconsultBtn.addEventListener('tap',function() {
   	   		var oSflag=saveconsult(proId,userid);
   	   		if(oSflag!=0) {
// 	   			return;
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
   	   		}
   	   		
		});
		
		/*专家的历史和评价*/
		ofinished.addEventListener('tap', function() {
			if(!clickFlag) return;
			mui.openWindow({
				url: '../html/coophistory-other.html',
				id: 'html/coophistory-other.html',
				show: {
				autoShow: false,
			},
			extras: {
				professorId: proId
			}

			});
		});
   	});
   	
   	
	//鼠标点击联系目的li时添加liactive类
	mui(".aimclass").on('tap','li',function(e){
		var aimlist = document.querySelector('.aimclass').querySelectorAll("li");
		for(var i = 0 ; i < aimlist.length;i++){
			aimlist[i].classList.remove('liactive');
			aimlist[i].querySelector('em').classList.remove('icon-check');
		}
		this.classList.add('liactive');
		this.querySelector("em").classList.add("icon-check");
	});
})