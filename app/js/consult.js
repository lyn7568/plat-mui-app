
var pageIndex = 1; // 页数
var allPages = 1; // 总页数
var table = document.body.querySelector(".mui-table-view");//咨询列表容器

var oneedval = document.getElementById("needval");//咨询/需求
var otypeval = document.getElementById("typeval");//咨询类型
var ostateval = document.getElementById("stateval");//咨询状态
var osortval = document.getElementById("sortval");//时间排序


mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentrefresh: '正在加载...',
           
            callback: pullupRefresh
        }
    }
});

//上拉加载具体业务实现
function pullupRefresh() {
    pageIndex = ++pageIndex;
    console.log('第'+pageIndex+'页');
    console.log('上拉加载更多');
    setTimeout(function() {
        getaData();
    }, 1000);
};
if(mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pulldownLoading();
		}, 500);
	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pulldownLoading();
	});
}

function getaData() {
    mui.plusReady(function() {
    	var userid = plus.storage.getItem('userid');
    	/*console.log("刷新传参"+oneedval.value+otypeval.value+ostateval.value+osortval.value);
    	console.log('加载页'+pageIndex)*/
        mui.ajax(baseUrl+'/ajax/consult/pq', {
            data: {
                "professorId":userid, //专家ID
			    "consultOrNeed":oneedval.value , //接受咨询或咨询别人的状态值，0-全部，1-别人咨询我的，2-我咨询别人的 默认为0
			    "consultType":otypeval.value, //咨询类型(技术咨询、资源咨询、其他事务)
			    "status":ostateval.value, //查询状态 0-全部，1-进行中，2-未感谢，3-未评价，4-已完成， 可以不传，默认为0
			    "timeType":osortval.value, //排序类型 0-按发起时间正序，1-按最后回复时间倒序，2-按完成时间倒序 默认为1
			    "pageSize":10, 
			    "pageNo":pageIndex //当前页码 默认为1
            },
            dataType: 'json',
            type: 'get',  
            timeout: 10000,
           
            success: function(data) {
                  
                if (data.success) {
                    console.log("成功");
                    var datalist = data.data.data;
                    var total = data.data.total;
                    var pageSize = data.data.pageSize;
                    	console.log(total)
                    	console.log(pageSize)
                    var result = '';
                    allPages = Math.ceil(total / pageSize);/*获取总的分页数*/
                   console.log(allPages)
                    if (allPages == 1) { //下拉刷新需要先清空数据
                        table.innerHTML = '';// 在这里清空可以防止刷新时白屏
                    }
                    
                    eachData(userid,datalist);
                   
                    if(pageIndex < allPages){
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);    /*能上拉*/
                    }else{
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);/*不能上拉*/
                    }
                }
            },
            error: function(xhr, type, errerThrown) {
                mui.toast('网络异常,请稍候再试');
                plus.nativeUI.closeWaiting();  
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
            }
        });
    });
};

initdata();
/*第一次加载数据*/
function initdata() {
	
    mui.plusReady(function() {
    	/*plus.nativeUI.showWaiting()//显示等待框*/
    	var userid = plus.storage.getItem('userid');
    	console.log('初始化传参'+'一：'+oneedval.value+'二'+otypeval.value+'三'+ostateval.value+'四'+osortval.value);
    	console.log()
    	plus.nativeUI.showWaiting();
        mui.ajax(baseUrl+'/ajax/consult/pq', {
            data: {
                "professorId":userid, //专家ID
			    "consultOrNeed":oneedval.value , //接受咨询或咨询别人的状态值，0-全部，1-别人咨询我的，2-我咨询别人的 默认为0
			    "consultType":otypeval.value, //咨询类型(技术咨询、资源咨询、其他事务)
			    "status":ostateval.value, //查询状态 0-全部，1-进行中，2-未感谢，3-未评价，4-已完成， 可以不传，默认为0
			    "timeType":osortval.value, //排序类型 0-按发起时间正序，1-按最后回复时间倒序，2-按完成时间倒序 默认为1
			    "pageSize":10, //每页记录数 默认为5
			    "pageNo":1 //当前页码 默认为1
            },
            dataType: 'json',
            type: 'get',  
            timeout: 10000,
            success: function(data) {
                if (data.success) {
                    console.log("成功");
                    /*plus.webview.currentWebview().show("slide-in-right",150);*/
					/*plus.nativeUI.closeWaiting();*/
                    var datalist = data.data.data;
                    console.log(datalist.length);
	                table.innerHTML = '';//清空容器
                    eachData(userid,datalist);
                    mui('#pullrefresh').pullRefresh().refresh(true);//重置下拉加载
                    mui('#pullrefresh').scroll().scrollTo(0,0);//滚动到顶部
                    
                    plus.nativeUI.closeWaiting();//关闭等待框
                }
            },
            error: function(xhr, type, errerThrown) {
                mui.toast('网络异常,请稍候再试');
            	plus.nativeUI.closeWaiting();
            }
        });
    });

};

//打开子页面
mui(".mui-table-view").on('tap','.itemBtn',function(){
	/*mui.openWindow({
		id:'chats.html',
	    url:'chats.html',
	    extras:{
	    	'manFlag':this.getAttribute("manFlag"),
	    	'consultId':this.getAttribute("consultId"),//自定义扩展参数，可以用来处理页面间传值
	    	'consultantId':this.getAttribute("consultantId")//咨询者id
	    }
	});*/
	
	var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框
	webviewShow = plus.webview.create("../html/chats.html",'chats.html',{},
	{'manFlag':this.getAttribute("manFlag"),'consultId':this.getAttribute("consultId"),'consultantId':this.getAttribute("consultantId")});
	
    webviewShow.addEventListener("loaded", function() {
        
    }, false);

	
});


/*由聊天页面返回咨询列表,要更新咨询状态:::自定义事件*/
var statuslist = document.querySelectorAll('.status-1');
window.addEventListener('backlist',function(event){
		//通过event.detail可获得传递过来的参数内容
		var self = plus.webview.currentWebview();
		var consultId = event.detail.consultId;
		var status = event.detail.status;
		console.log(consultId);
		mui.each(statuslist,function(index,item){
			if(item.getAttribute('consultId') == consultId) {
				//consultStatus='+myData["consultStatus"]//我的需求进行中
				//myNeedAssessStatus='+myData["assessStatus"]//我的需求，未评价/已完成
				if(status == 'myNeedAssessStatus=0'){//未评价
					this.innerHTML = '待评价';
				}
			};
		})
//		initdata();
		
	});


//点击选择
function checkedFun(i){
	
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
//		document.getElementById("middlePopover"+i).classList.remove('mui-active');
		
		oneedval.value = document.getElementById("headck1").getAttribute('headck');
		otypeval.value = document.getElementById("headck2").getAttribute('headck');
		ostateval.value = document.getElementById("headck3").getAttribute('headck');
		osortval.value = document.getElementById("headck4").getAttribute('headck');
		
		initdata();
		plus.nativeUI.closeWaiting();//关闭等待框
	});
	
};
checkedFun(1);
checkedFun(2);
checkedFun(3);
checkedFun(4);

function eachData(userid,datalist) {
	/*表格填充数据 mui.each是异步的*/
    mui.each(datalist, function(index, item) {
    	var title,
			zhicehng,
			zhiwei,
			address,
			lastReply,
			status,
			lastReplyTime,
			lastReplyCon,
			unreadCount,
			unreadStyle,
			proModify,
			photoUrl,
			consultType;
    	
    	//咨询类型和状态
		if(item['consultantId'] != userid){//收到咨询
			title = "回复:关于" + item["consultTitle"] + "的咨询";
			if(item["consultStatus"] == 0){
				status = "进行中";
			}else if(item["consultStatus"] == 1){
				status = "已完成";
			}
		}else if(item['consultantId'] == userid){//我的需求
			title = "关于" + item["consultTitle"] + "的咨询";
			if(item["consultStatus"] == 0){
				status = "进行中";
			}else if(item["consultStatus"] == 1){
				if(item["assessStatus"] == 0){
					status = '待评价';
				}else {
					status = '已完成';
				}
			}
		}
		 
		//专家职称
		(!item["professor"]["title"])? zhicehng = '' : zhicehng = item["professor"]["title"];
		(!item["professor"]["office"])? zhiwei  = ''  : zhiwei = item["professor"]["office"] + '，';
		(!item["professor"]["address"])? address = '' : address = '|'+ item["professor"]["address"];
		(item["professor"]["authentication"] == true)? proModify = 'authicon' : proModify = 'unauthicon';
		(item["professor"]["hasHeadImage"] == 0) ? photoUrl = "../images/default-photo.jpg" :photoUrl = "../images/head/"+item["professor"]["id"]+"_m.jpg";
		
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

        li.innerHTML = '<div class="coutopicbox">'
            		+ '<span class="coutheme mui-ellipsis mui-pull-left">'+title+'</span>'
            		+ '<div class="coustatus mui-pull-right"><span class="aimlabel">'+consultType+'</span>'
            		+ '<span class="status-1" consultId="'+item["consultId"]+'">'+status+'</span></div></div>'
            		+ '<a class="proinfor itemBtn" consultId="'+item["consultId"]+'" consultantId="'+item["consultantId"]+'" >'
					+ '<span class="mui-badge mui-badge-danger" style="'+unreadStyle+'">'+unreadCount+'</span>'
	        		+ '<img class="mui-media-object mui-pull-left headimg" src="'+photoUrl+'">'
            		+ '<div class="mui-media-body">'
            		+ '<span class="listtit">'+item["professor"]["name"]+'<em class="mui-icon iconfont icon-vip '+proModify+'"></em><span class="thistime">'+lastReplyTime+'</span></span>'	
            		+ '<p class="listtit2"><span>'+zhicehng+'</span><span>'+zhiwei+'</span><span>'+item["professor"]["orgName"]+'</span><span>'+address+'</span></p>'
            		+ '<p class="listtit3">'+lastReplyCon+'</p>'
            		+ '</div></a>';
            		
        table.appendChild(li,table.firstChild);
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
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		async:false,
		success:function(data){
			/*console.log(data);*/
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
				style = "display:none;"
			}else{
				style = "display:block;"
				
			}
		},
		error:function(xhr,type,errorThrown){
			
		}
	});
	
	return {"unreadCount":unreadCount,
			"style":style
	}
};