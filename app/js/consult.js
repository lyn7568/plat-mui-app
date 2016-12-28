/*是否登录，要显示的，mui-content*/
var  content1 = document.getElementById('logined');
var  content2 = document.getElementById('unlogin');

var pageIndex = 1; // 页数
var allPages = 1; // 总页数
var table = document.body.querySelector("#table");//咨询列表容器

var oneedval = document.getElementById("needval");//咨询/需求
var otypeval = document.getElementById("typeval");//咨询类型
var ostateval = document.getElementById("stateval");//咨询状态
var osortval = document.getElementById("sortval");//时间排序

var ozixunpullrefresh = document.getElementById("zixunpullrefresh");//刷新容器，控制安卓和iOS容器到header距离不一样

//显示数据还是登录
function islogin() {
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');
		console.log('点击咨询,判断是否登录id=='+ userid);
		if(userid == null || userid == 'null'){
   			content1.style.display = 'none';
   		}else {
   			content2.style.display = 'none';
   		}
   		
   		if(plus.nativeUI.showWaiting()){
			plus.nativeUI.closeWaiting();//关闭等待框
		}
		
	})
}


/*登陆*/
window.addEventListener('logined', function(event) {
	var userId = event.detail.id; 
	content1.style.display = 'block';
	content2.style.display = 'none';
	
	initData();
	
	if(plus.nativeUI.showWaiting()){
		
		plus.nativeUI.closeWaiting();//关闭等待框
		mui('#zixunpullrefresh').scroll().scrollTo(0,0,100);//100毫秒滚动到顶
	}
});

/*退出*/
window.addEventListener('exited', function(event) {
	var userId = event.detail.id; 
	console.log('exited=='+userId)
	console.log(content2)
	content1.style.display = 'none';
	content2.style.display = 'block';
	document.getElementById('unlogin').style.display = 'block';
});

//显示登录,登陆或者注册
mui.plusReady(function() {
	var regBtn = document.getElementById("regBtn");
	var logBtn = document.getElementById("logBtn");
//	注册
	regBtn.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/reg.html',
			id: '../html/reg.html',
			show: {
				aniShow: "slide-in-right"
			}
		});
		
	});
	
	//登陆
	logBtn.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/login.html',
			id: '../html/login.html',
			show: {
				aniShow: "slide-in-right"
			}
		});
		
	});

});

/*初始化数据*/
//initData();

//父子页面，下拉刷新
mui.init({
	pullRefresh: {
		container: '#zixunpullrefresh',
		down: {
			callback: pulldownRefresh
		}
//		up: {
//			contentrefresh: '正在加载...',
//			callback: pullupRefresh
//		}
	}
});

 /* 父子页面，下拉刷新*/
function pulldownRefresh() {
    pageIndex = 1;
    console.log('下拉刷新');
    setTimeout(function() {
       getOnePage();
       
    }, 1000);
};


//上拉加载
function pullupRefresh() {
	pageIndex = ++pageIndex;
	
	setTimeout(function() {
		getaData();
	}, 1000);
}


if(mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#zixunpullrefresh').pullRefresh().pulldownLoading();
		}, 500);	
	});
} else {
	mui.ready(function() {
		mui('#zixunpullrefresh').pullRefresh().pulldownLoading();
	});
}


//初始化数据
function initData(){
	mui.plusReady(function() { 
		var userid = plus.storage.getItem('userid');
		plus.nativeUI.showWaiting('加载中...');//显示原生等待框
		mui.ajax(baseUrl + '/ajax/consult/pq',{
			data:{
				"professorId":userid,
			    "consultOrNeed":oneedval.value , 
			    "consultType":otypeval.value, 
			    "status":ostateval.value, 
			    "timeType":osortval.value, 
			    "pageSize":200, 
			    "pageNo":1 
			},
			dataType:'json',
			type:'get',
			timeout:10000,
			success:function(data){
				if (data.success && data.data.data != '') {
                		table.innerHTML = '';//下拉刷新，清空数据
                		var datalist = data.data.data;
					eachData(userid,datalist);
					mui('#zixunpullrefresh').pullRefresh().refresh(true);//重置下拉加载
					plus.nativeUI.closeWaiting();//关闭原生等待框
					mui('#zixunpullrefresh').pullRefresh().scrollTo(0,0,100)//回到顶部

					//滚动条样式
					var scrollEle = document.body.querySelectorAll('.mui-scrollbar-vertical');
					console.log('滚动条个数=='+scrollEle.length)
					if(scrollEle.length > 1){alert('滚动条个数大于1')
						for(var i = 0; i < scrollEle.length;i++){
							scrollEle[i].style.display = 'none';
							scrollEle[0].style.display = 'block';
							console.log(scrollEle[i].classList);
						}
					}
					
				}				
			},
			error:function(xhr,type,errorThrown){
				mui.toast('网络异常,请稍候再试'); 
				plus.nativeUI.closeWaiting();//关闭原生等待框
			}
		});
	});
};

//加载第一页数据
function getOnePage(){
	mui.plusReady(function() { 
		var userid = plus.storage.getItem('userid');
		 var pageIndex = 1;
		mui.ajax(baseUrl + '/ajax/consult/pq',{
			data:{
				"professorId":userid,
			    "consultOrNeed":oneedval.value , 
			    "consultType":otypeval.value, 
			    "status":ostateval.value, 
			    "timeType":osortval.value, 
			    "pageSize":200, 
			    "pageNo":pageIndex 
			},
			dataType:'json',
			type:'get',
			timeout:10000,
			
			success:function(data){
				if (data.success) {
					if(pageIndex == 1){
						table.innerHTML = '';//下拉刷新，清空数据
	                		var datalist = data.data.data;

						eachData(userid,datalist);

						var scrollEle = document.body.querySelectorAll('.mui-scrollbar-vertical');
						console.log('滚动条个数=='+scrollEle.length)
						if(scrollEle.length > 1){alert('滚动条个数大于1')
							for(var i = 0; i < scrollEle.length;i++){
								scrollEle[i].style.display = 'none';
								scrollEle[0].style.display = 'block';
								console.log(scrollEle[i].classList);
							}
						}
						mui('#zixunpullrefresh').pullRefresh().refresh(true);//重置下拉加载
						 mui('#zixunpullrefresh').pullRefresh().endPulldownToRefresh();
					}
				};
			},
			error:function(xhr,type,errorThrown){
				mui.toast('网络异常,请稍候再试'); 
			}
		});
	});
}


//父子页面的上拉加载ajax
function getaData() {
    mui.plusReady(function() {
    	var userid = plus.storage.getItem('userid');
        mui.ajax(baseUrl+'/ajax/consult/pq', {
            data: {
                "professorId":userid, 
			    "consultOrNeed":oneedval.value ,
			    "consultType":otypeval.value, 
			    "status":ostateval.value, 
			    "timeType":osortval.value, 
			    "pageSize":200, 
			    "pageNo":pageIndex 
            },
            async:false,
            dataType: 'json',
            type: 'get',  
            timeout: 10000,
            success: function(data) {
                if (data.success) {
                    var datalist = data.data.data;
                    var total = data.data.total;
                    var pageSize = data.data.pageSize;
                    allPages = Math.ceil(total / pageSize);/*获取总的分页数*/
                   
                    if (allPages == 1) { //下拉刷新需要先清空数据
                        table.innerHTML = '';// 在这里清空可以防止刷新时白屏
                    }
                    console.log('第'+pageIndex+'页');
                    if(pageIndex == 1){
                    		table.innerHTML = '';
                    }
                    eachData(userid,datalist);
                    if(pageIndex < allPages){
                        mui('#zixunpullrefresh').pullRefresh().endPullupToRefresh(false);    /*能上拉*/
                    }else{
                        mui('#zixunpullrefresh').pullRefresh().endPullupToRefresh(true);/*不能上拉*/
                    }
                }
            },
            error: function(xhr, type, errerThrown) {
                mui.toast('网络异常,请稍候再试');
                mui('#zixunpullrefresh').pullRefresh().endPullupToRefresh(true);
            }
        });
    });
};




//判断对方是否有聊天内容,加回复：。。。
function isChat(consultId,userid) {
	var length = 0;
	mui.ajax(baseUrl+'/ajax/tidings/qacon',{
		data:{
			"consultId":consultId
		},
		async:false,
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			var myData = data.data;
			for(var i = 0; i < myData.length; i++ ){
				if(myData[i]['professor']['id'] !=userid){
					length++;
				}
			}
			
		},
		error:function(xhr,type,errorThrown){
			//根据消息id查询消息失败
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
	return length;	
}

//更新读取状态
function setReadState(consultId) {
		mui.ajax(baseUrl+'/ajax/consult/readStatus',{
			data:{"consultId":consultId}, //咨询ID
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){

			},
			error:function(xhr,type,errorThrown){
				
			}
		});
}

//打开子页面
mui(".mui-table-view").on('tap','.itemBtn',function(){
	var o_this = this;
	
	mui.plusReady(function() {
		
		var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框
		//更新读取状态
		setReadState(o_this.getAttribute("consultId"));
		webviewShow = plus.webview.create("../html/chats.html",'chats.html',{},
		{'consultId':o_this.getAttribute("consultId"),'consultantId':o_this.getAttribute("consultantId"),'readState':1});
		//当聊天页面加载完再打开
	    webviewShow.addEventListener("loaded", function() {
	        
	    }, false);
	
	});
	
});


/*由聊天页面返回咨询列表,要更新咨询状态,和更新未读信息:::自定义事件*/
window.addEventListener('backlist',function(event){
		var self = plus.webview.currentWebview();
		var consultId = event.detail.consultId;
		var status = event.detail.status;
		//由聊天页返回咨询，改变咨询状态，和咨询状态样式
		mui('.status').each(function(index,item){
			if(this.getAttribute('consultId') == consultId) {
				if(status == 'myNeedAssessStatus=0'){
					this.classList.remove('status-1');
					this.classList.add('status-2');
					this.innerHTML = '待评价';
				}else if(status == 'myNeedAssessStatus=1'){
					this.classList.remove('status-1');
					this.classList.add('status-3');
					this.innerHTML = '已完成';
				}
			};
		});
		
		//由聊天页返回咨询页，改变未读状态
		mui('.readstate').each(function(index,item){
			if(this.getAttribute('class').indexOf('displayBlock') != -1){//包含displayBlock	
				console.log(this.getAttribute('consultId'));
				if(this.getAttribute('consultId') == consultId){
					this.classList.remove('displayBlock');
					this.classList.add('displayNone');
					console.log(this.classList);
				}
			}
		});
	});
	
function eachData(userid,datalist) {
	
	/*表格填充数据 mui.each是异步的*/
    mui.each(datalist, function(index, item) {
    	var title,lastReply,status,statusStyle,lastReplyTime,lastReplyCon,
			unreadCount,unreadStyle,proModify,photoUrl,consultType,
			chatlength;
		
	var modifyaddEle = '';//添加不同认证
		
		//过滤professor为空
		if(item["professor"]){
			
			chatlength = isChat(item['consultId'],userid);//判断对方是否有发出消息
			if(chatlength == 0){
				title =  item["consultTitle"];	
			}else{
				title = "回复:" + item["consultTitle"];
			}
	//		console.log(title)
		    	//咨询类型和状态
		    	if(item["consultStatus"] == 0){//进行中，我的需求和收到咨询
		    		status = "进行中";
				statusStyle = 'status-1';
		    	}else if(item["consultStatus"] == 1){
		    		if(item['consultantId'] != userid){//收到咨询
		    			status = "已完成";
					statusStyle = 'status-3';
		    		}else {//我的需求
		    			if(item["assessStatus"] == 0){
						status = '待评价';
						statusStyle = 'status-2';
					}else {
						status = '已完成';
						statusStyle = 'status-3';
					}
		    		}
		    	}
		    	
			
			//认证
			if(item["professor"].authType) {
				proModify = 'icon-vip authicon-cu';
			} else {
				if(item["professor"].authStatus) {
					if(item["professor"].authentication == 1) {
						proModify = 'icon-renzheng authicon-mana';
//						modifyaddEle = "<span >科研</span>";
						
						
					} else if(item["professor"].authentication == 2) {
						proModify = 'icon-renzheng authicon-staff';
//						modifyaddEle = "<span>企业</span>";
						
					} else {
						
						proModify = 'icon-renzheng authicon-stu';
//						modifyaddEle = "<span>学生</span>";
						
					}
				}
			}
			
			(item["professor"]["hasHeadImage"] == 0) ? photoUrl = "../images/default-photo.jpg":photoUrl = baseUrl + "/images/head/" + item["professor"].id + "_m.jpg";
			
			//咨询类型，只取两个字
			if(item["consultType"]) {
				consultType = item["consultType"].substr(0,2);
			}
			
			//最后回复
			lastReplyTime = lastReplyFn(userid,item["consultId"]).lastReplyTime;
			lastReplyCon = lastReplyFn(userid,item["consultId"]).lastReplyCon;
			
			if(lastReplyCon == undefined){
				lastReplyCon = '';
			}
			if(lastReplyTime == undefined){
				lastReplyTime = '';
			}
			//未读消息
			unreadCount = unreadConsultFn(userid,item["consultId"],index).unreadCount;
			unreadStyle = unreadConsultFn(userid,item["consultId"],index).style;
	    	
	        var li = document.createElement('li');
	        li.className = 'mui-table-view-cell mui-media'; 
	        
	        var str = '';
	       	str += '<div class="coutopicbox"><span class="coutheme mui-ellipsis mui-pull-left">'+title+'</span>'
	       				+ '<div class="coustatus mui-pull-right"><span class="aimlabel">'+consultType+'</span>'
	            		+ '<span class="'+statusStyle+' status" consultId="'+item["consultId"]+'">'+status+'</span></div></div>'
	            		+ '<a class="proinfor itemBtn" consultId="'+item["consultId"]+'" consultantId="'+item["consultantId"]+'" >'
						+ '<span class="mui-badge mui-badge-danger readstate '+unreadStyle+'" consultId="'+item["consultId"]+'">'+unreadCount+'</span>'
		        		+ '<img class="mui-media-object mui-pull-left headimg headRadius" src="'+photoUrl+'">'
	            		+ '<div class="mui-media-body">'
	            		+ '<span class="listtit">'+item["professor"]["name"]+'<em id="nameli" class="mui-icon iconfont '+proModify+'">'+modifyaddEle+'</em><span class="thistime">'+lastReplyTime+'</span></span>';
	        str += '<p class="listtit2">';
	        if(item["professor"]["title"]){
	        	str += '<span>'+item["professor"]["title"]+'</span>, ';
	        };
	        if(item["professor"]["office"]){
	        	str += '<span>'+item["professor"]["office"]+'</span>, ';
	        };
	        if(item["professor"]["orgName"]){
	        	str += '<span>'+item["professor"]["orgName"]+'</span>';
	        };
	        if(item["professor"]["address"]){
	        	str += '<span>  | '+item["professor"]["address"]+'</span>';
	        };
	        
	        str +='</p><p class="listtit3 onlyone">'+lastReplyCon+'</p></div></a>';
	        
			li.innerHTML = str;
	        table.appendChild(li,table.firstChild);
	    }
    });
	
};

/*最后回复*/
function lastReplyFn(sendId,consultId){
	var lastReplyTimeData,lastReplyTime,lastReplyCon;
	mui.ajax(baseUrl + '/ajax/tidings/qaLastRevovery',{
		data:{
			"consultId":consultId, //咨询ID
		    "senderId":sendId //登录者ID
		},
		dataType:'json',
		type:'get',
		timeout:10000,
		async:false,
		success:function(data){
			if(data["data"] == null || data["data"] == "" || data["data"] == undefined){
				lastReplyTimeData = '';
				lastReplyTime = '';
				lastReplyCon = '';
			}
			else{
				lastReplyTimeData = data["data"]["createTime"];
				lastReplyTime =lastReplyTimeData.substr(0,4) + "-" + lastReplyTimeData.substr(4,2) + "-" + lastReplyTimeData.substr(6,2) + " " + lastReplyTimeData.substr(8,2)+ ":" +lastReplyTimeData.substr(10,2);
				lastReplyCon = data["data"]["tidingsContant"];
			}
		},
		error:function(xhr,type,errorThrown){
			
		}
	});
	return  {
		"lastReplyTime":lastReplyTime,
		"lastReplyCon":lastReplyCon
	};
};

/*未读消息*/
function unreadConsultFn (senderId,consultId,i){
	var unreadCount,style;
	mui.ajax(baseUrl +'/ajax/tidings/qaNotReadTidings',{
		data:{
			"senderId":senderId, //发送者ID
			"consultId":consultId //咨询ID
		},
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		async:false,
		success:function(data){
			unreadCount = data["data"];
			if(unreadCount == 0){
				style = 'displayNone';
			}else{
				style = 'displayBlock';
				
			}
		},
		error:function(xhr,type,errorThrown){
			
		}
	});
	
	return {"unreadCount":unreadCount,
			"style":style
	}
};

//点击选择
function checkedFun(i){
	mui.plusReady(function(){
		mui("#middlePopover"+i).on('tap','.mui-navigate-right',function(e){
			allPages = 1;
			pageIndex = 1;
			plus.nativeUI.showWaiting(); //显示等待框
			document.getElementById("headck"+i).innerHTML = this.innerHTML;
			var value = this.getAttribute("ck"+i);
			document.getElementById("headck"+i).setAttribute('headck',value);
			document.querySelector('.mui-backdrop').style.display = 'none';
			document.getElementById("middlePopover"+i).style.display = 'none';
			
			//去掉样式类mui-active,要不然会多点击一次
			document.getElementById("middlePopover"+i).classList.remove('mui-active');
			
			//咨询类型传值不同，传""(空)，技术咨询、资源咨询、其他事务
			otypeval.value = document.getElementById("headck2").getAttribute('headck');
			if(otypeval.value == 0) {
				otypeval.value = '';
			}else {
				otypeval.value = document.getElementById("headck2").innerHTML;
			}
			oneedval.value = document.getElementById("headck1").getAttribute('headck');
			ostateval.value = document.getElementById("headck3").getAttribute('headck');
			osortval.value = document.getElementById("headck4").getAttribute('headck');
			
			 initData();
			
			
//			mui('#zixunpullrefresh').scroll().scrollTo(0,0,100);//100毫秒滚动到顶
			plus.nativeUI.closeWaiting();//关闭等待框
		});
		
	});
};
checkedFun(1);
checkedFun(2);
checkedFun(3);
checkedFun(4);