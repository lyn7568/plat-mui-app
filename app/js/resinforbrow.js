//资源信息页面 
var oresorcename = document.getElementById("resorcename"); //资源名称标题
var oproname = document.getElementById("proname"); //专家名称
var oprotitle = document.getElementById("protitle"); //专家职称
var oprooffice = document.getElementById("prooffice"); //专家职务
var oproorgName = document.getElementById("proorgName"); //专家所属机构
var oproadress = document.getElementById("proadress"); //专家所在地
var opromodify = document.getElementById("promodify"); //专家认证
var oproimg = document.getElementById("proimg"); //专家头像

var oresourceName = document.getElementById("resourceName"); //资源名称
var oyongtu = document.getElementById("yongtu"); //应用用途
var oziyuanimg = document.getElementById("ziyuanimg"); //资源图片
var ofield = document.getElementById("field"); //学术领域
var oapply = document.getElementById("apply"); //应用行业
var odetail = document.getElementById("detail"); //详细描述
var ohezuo = document.getElementById("hezuo"); //合作备注

var ofielddiv = document.getElementById("fielddiv");//学术领域容器
var oapplydiv =document.getElementById("applydiv");//应用行业容器
var odetaildiv =document.getElementById("detaildiv");//详细描述容器
var ohezuodiv =document.getElementById("hezuodiv");//合作备注容器

var oconsult = document.getElementById("consult"); //咨询
var oconsultBtn = document.getElementById("consultBtn"); //咨询按钮

var proId;

function ziyuaninfo(resourceId) {
	mui.plusReady(function() {
		
		mui.ajax(baseUrl + '/ajax/resource/' + resourceId, {
			data: {
				'resourceId': resourceId
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.success) {
					console.log(data);
					var mydata = data.data;
					//专家信息
					proId = mydata['professor']['id']; //专家id
					(mydata['resourceName']) ? oresorcename.innerHTML = mydata['resourceName']: oresorcename.innerHTML = ''; //资源名称
					(mydata['resourceName']) ? oresourceName.innerHTML = mydata['resourceName']: oresourceName.innerHTML = ''; //资源名称
					(mydata['professor']['name']) ? oproname.innerHTML = mydata['professor']['name']: oproname.innerHTML = ''; //专家姓名
					(mydata['professor']['title']) ? oprotitle.innerHTML = mydata['professor']['title'] + '，': oprotitle.innerHTML = ''; //专家职称
					(mydata['professor']['office']) ? oprooffice.innerHTML = mydata['professor']['office']: oprooffice.innerHTML = ''; //专家职务
					(mydata['professor']['orgName']) ? oproorgName.innerHTML = mydata['professor']['orgName']: oproorgName.innerHTML = ''; //专家所属机构
					(mydata['professor']['address']) ? oproadress.innerHTML = mydata['professor']['address']: oproadress.innerHTML = ''; //专家所在地
					(mydata['professor']['authentication']) ? opromodify.classList.add('authicon'): opromodify.classList.add('unauthicon'); //专家认证
					(mydata['professor']['hasHeadImage']) ? oproimg.setAttribute('src', '../images/head/' + mydata['professor']['id'] + '_m.jpg'): oproimg.setAttribute('src', '../images/default-photo.jpg'); //专家头像
	
					//资源基本信息
					(mydata['images']['imageSrc']) ? oziyuanimg.setAttribute('src', mydata['images']['imageSrc']): oziyuanimg.setAttribute('src', '../images/default-resource.jpg'); //资源图片
					(mydata['supportedServices']) ? oyongtu.innerHTML = mydata['supportedServices']: oyongtu.innerHTML = ''; //应用用途
	
					//学术领域
					if(mydata['subject']) {
						if(mydata['subject'].indexOf(',') != -1) {//字符串是否包含,
							var fieldlist = mydata['subject'].split(",");
							console.log(fieldlist.length);
							for(var i = 0; i < fieldlist; i++) {
								var oli = document.createElement('li');
								oli.innerText = fieldlist[i];
								ofield.appendChild(oli);
							}
						}else {
							var oli = document.createElement('li');
							oli.innerText = mydata['subject'];
							ofield.appendChild(oli);
						}
						
					} else {
						ofielddiv.style.display = 'none';
					}
	
					//应用行业
					if(mydata['industry']) {
						if(mydata['industry'].indexOf(',') != -1) {//字符串是否包含,
							var applylist = mydata['industry'].split(",");
							console.log(applylist.length);
							for(var i = 0; i < applylist; i++) {
								var oli = document.createElement('li');
								oli.innerText = fieldlist[i];
								oapply.appendChild(oli);
							}
						}else {
							var oli = document.createElement('li');
							oli.innerText = mydata['industry'];
							oapply.appendChild(oli);
						}
					}else {
						oapplydiv.style.display = 'none';
					}
	
					//详细描述
					if(mydata['descp']) {
						odetail.innerHTML = mydata['descp']
					}else {
						odetaildiv.style.display = 'none';
					}
					
					//合作备注
					if(mydata['cooperationNotes']) {
						ohezuo.innerHTML = mydata['cooperationNotes'];
					}else {
						ohezuodiv.style.display = 'none';
					}
					
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right",150);
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	})
	
}

mui.plusReady(function() {
	var yesExpert = document.getElementById("yesExpert");
	var noExpert = document.getElementById("noExpert");
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var resourceId = self.resourceId;
	console.log(resourceId);
	//资源信息
	ziyuaninfo(resourceId);

	//点击咨询打开咨询申请
	oconsult.addEventListener('tap', function() {
		var flag = 'ziyuan';
		var consulttitle = oresorcename.innerHTML;
		var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框
		webviewShow = plus.webview.create("../html/consultapply.html",'consultapply.html',{},
		{'proId': proId,'flag': flag,'consulttitle': consulttitle});
		
	    webviewShow.addEventListener("loaded", function() {
	        
	    }, false);
		
	});
	/*咨询成功,返回资源信息*/
	window.addEventListener('backziyuaninfo',function(event){
		
//		ozixun.classList.add('displayNone');
	});
	

	ifCollection();

	yesExpert.addEventListener('tap', function() {
		var $this = this;
		collectionExpert($this);
	});

	noExpert.addEventListener('tap', function() {
		var $this = this;
		cancelCollectionExpert($this);
	});

	/*判断是否收藏资源*/
	function ifCollection() {
		mui.ajax(baseUrl + '/ajax/watch/hasWatch', {
			data: {
				"professorId": userid,
				"watchObject": resourceId
			},
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success && data.data != null) {
					yesExpert.style.display = "none";
					noExpert.style.display = "block";
				} else {
					yesExpert.style.display = "block";
					noExpert.style.display = "none";
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*收藏资源*/
	function collectionExpert($this) {
		mui.ajax(baseUrl + '/ajax/watch', {
			data: {
				"professorId": userid,
				"watchObject": resourceId,
				"watchType": 2
			},
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					$this.style.display = "none";
					noExpert.style.display = "block";
					//resourceId = data.data;
					//console.log(resourceId)
					plus.nativeUI.toast("资源收藏成功", toastStyle);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*取消收藏资源*/
	function cancelCollectionExpert($this) {
		//console.log(returnId)
		// console.log(userid)
		mui.ajax({
			url: baseUrl + '/ajax/watch/delete',
			data: {
				professorId: userid,
				watchObject: resourceId
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					$this.style.display = "none";
					yesExpert.style.display = "block";
					plus.nativeUI.toast("取消收藏资源", toastStyle);
				}
			},
			error: function(data) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	}

});