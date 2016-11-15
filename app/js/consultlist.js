//咨询
mui.ready(function() {
	
	 
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');
		var listContainer = document.getElementById("listContainer");//
		
		var consultStr = getConsultData(userid,0,0,0);
		var myNeedStr = getMyNeedData(userid,0,0,0);
		var allStr = allData(userid,0,0,1);
		listContainer.innerHTML = consultStr + myNeedStr;
//		listContainer.innerHTML = allStr;
		
		/*收到咨询*/
		function getConsultData(userid,status,timeType,sortType){
			var consultStr;
			var params = {
			    "professorId":userid, //专家ID
			    "status":status, //查询状态 0-全部，1-进行中，2-未感谢，3-未评价，4-已完成， 可以不传，默认为0
			    "timeType":timeType, //排序类型 0-按发起时间，1-按最后回复时间，2-按完成时间 默认为0
			    "sortType":sortType
			};
			mui.ajax(baseUrl +"/ajax/consult/pqPro",{
				data:params,
				dataType:'json',//服务器返回json格式数据
				async:false,
				type:'get',//HTTP请求类型
				success:function(data){
					
					if(!data.data.data){
						return false;
					}else{
						var myData = data.data.data;
						consultStr = handleData(userid,myData,'consult');
					}
					
				},
				error:function(xhr,type,errorThrown){
					
				}
			});
			return consultStr;
			
		};
		
		/*我的需求*/
		function getMyNeedData(userid,status,timeType,sortType){
			var myNeedStr;
			var params = {
			    "consultantId":userid, //专家ID
			    "status":status, //查询状态 0-全部，1-进行中，2-未感谢，3-未评价，4-已完成， 可以不传，默认为0
			    "timeType":timeType, //排序类型 0-按发起时间，1-按最后回复时间，2-按完成时间 默认为0
			    "sortType":sortType
			};
			mui.ajax(baseUrl +"/ajax/consult/pqCon",{
				data:params,
				dataType:'json',//服务器返回json格式数据
				async:false,
				type:'get',//HTTP请求类型
				success:function(data){
//					console.log(data);
					if(!data.data){
						return false;
					}else{
						var myData = data.data.data;
						myNeedStr = handleData(userid,myData,'myNeed');

					}
					
				},
				error:function(xhr,type,errorThrown){
					
				}
			});
			
			return myNeedStr;
		};
		
		//全部
		function allData(userid,consultOrNeed,status,timeType) {
			var allStr;
			var params = {
					"professorId":userid, //专家ID
				    "consultOrNeed":consultOrNeed, //接受咨询或咨询别人的状态值，0-全部，1-别人咨询我的，2-我咨询别人的 默认为0
				    "status":status, //查询状态 0-全部，1-进行中，2-未感谢，3-未评价，4-已完成， 可以不传，默认为0
				    "timeType":timeType, //排序类型 0-按发起时间正序，1-按最后回复时间倒序，2-按完成时间倒序 默认为1
				    "pageSize":"", //每页记录数 默认为5
				    "pageNo":"" //当前页码 默认为1
			    };
			mui.ajax(baseUrl +'/ajax/consult/pq',{
				data:params,
				dataType:'json',//服务器返回json格式数据
				type:'get',//HTTP请求类型
				async:false,
				success:function(data){
					if(!data.data){
						return false;
					}else{
						var myData = data.data.data;
						allStr = handleData(userid,myData,'all');
					}
				},
				error:function(xhr,type,errorThrown){
					
				}
			});
			
			return allStr;
		}
		

		/*咨询数据处理*/
		function handleData(userid,data,manFlag) {
			var htmlStr = '';
			for(var i = 0; i < data.length;i++){
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
					proModify;
				//咨询类型和状态
				if(manFlag == "consult") {
					title = "回复:关于" + data[i]["consultTitle"] + "的咨询";
					if(data[i]["consultStatus"] == 0){
						status = "进行中";
					}else if(data[i]["consultStatus"] == 1){
						status = "已完成";
					}
				}else if(manFlag == "myNeed"){
					title = "关于" + data[i]["consultTitle"] + "的咨询";
					if(data[i]["consultStatus"] == 0){
						status = "进行中";
					}else if(data[i]["consultStatus"] == 1){
						if(data[i]["assessStatus"] == 0){
							status = '待评价';
						}
					}
				}else if(manFlag == "all"){
					
					if(data[i]['professorId'] == userid){//收到咨询
						title = "回复:关于" + data[i]["consultTitle"] + "的咨询";
						if(data[i]["consultStatus"] == 0){
							status = "进行中";
						}else if(data[i]["consultStatus"] == 1){
							status = "已完成";
						}
					}else if(data[i]['consultantId'] == userid){//我的需求
						title = "关于" + data[i]["consultTitle"] + "的咨询";
						if(data[i]["consultStatus"] == 0){
							status = "进行中";
						}else if(data[i]["consultStatus"] == 1){
							if(data[i]["assessStatus"] == 0){
								status = '待评价';
							}
						}
					}
				}
				
				
				
				//专家职称
				if(!data[i]["professor"]["title"]){
					zhicehng = '';
				}else {
					zhicehng = data[i]["professor"]["title"]+'，';
				}
				//专家职位
				if(!data[i]["professor"]["office"]){
					zhiwei = '';
				}else {
					zhiwei = data[i]["professor"]["office"] + '，';
				}
				//专家所在地
				if(!data[i]["professor"]["address"]){
					address = '';
				}else {
					address = '|'+ data[i]["professor"]["address"];
				}
				//专家认证
				if(data[i]["professor"]["authentication" == true]){
					proModify = 'authicon';
				}else {
					proModify = 'unauthicon';
				}
				
				
				//最后回复
				lastReplyTime = lastReplyFn(userid,data[i]["consultId"]).lastReplyTime;
				lastReplyCon = lastReplyFn(userid,data[i]["consultId"]).lastReplyCon;
				
				if(lastReplyCon == undefined){
					lastReplyCon = '';
				}
				if(lastReplyTime == undefined){
					lastReplyTime = '';
				}
				//未读消息
				unreadCount = unreadConsultFn(userid,data[i]["consultId"],i).unreadCount;
				unreadStyle = unreadConsultFn(userid,data[i]["consultId"],i).style;
				
				
				htmlStr += '<li class="mui-table-view-cell mui-media"><div class="coutopicbox">';
	            htmlStr += '<span class="coutheme mui-ellipsis mui-pull-left">'+title+'</span>';
	            htmlStr += '<div class="coustatus mui-pull-right"><span class="aimlabel">'+data[i]["consultType"]+'</span>';
	            htmlStr += '<span class="status-1">'+status+'</span></div></div>';
	            htmlStr += '<a class="proinfor itemBtn" consultId="'+data[i]["consultId"]+'" consultantId="'+data[i]["consultantId"]+'"  manFlag="'+manFlag+'">';
				htmlStr += '<span class="mui-badge mui-badge-danger" style="'+unreadStyle+'">'+unreadCount+'</span>';
		        htmlStr += '<img class="mui-media-object mui-pull-left headimg" src="../images/default-photo.jpg">';
	            htmlStr += '<div class="mui-media-body">';
	            htmlStr += '<span class="listtit">'+data[i]["professor"]["name"]+'<em class="mui-icon iconfont icon-vip '+proModify+'"></em><span class="thistime">'+lastReplyTime+'</span></span>';	
	            htmlStr += '<p class="listtit2"><span>'+zhicehng+'</span><span>'+zhiwei+'</span><span>'+data[i]["professor"]["orgName"]+'</span><span>'+address+'</span></p>';
	            htmlStr += '<p class="listtit3">'+lastReplyCon+'</p>';
	            htmlStr += '</div></a></li>';
	            
	            mui("#listContainer").on('tap','.itemBtn',function(){
//					console.log(this.getAttribute("consultId"));
					 mui.openWindow({
						id:'chats',
					    url:'chats.html',
					    extras:{
					    	'manFlag':this.getAttribute("manFlag"),
					    	'consultId':this.getAttribute("consultId"),//自定义扩展参数，可以用来处理页面间传值
					    	'consultantId':this.getAttribute("consultantId")//咨询者id
					    }
					});
				});
	            
	            
			};
		
			return htmlStr;
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
						/*console.log(lastReplyTime);*/
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
		
		
		
		
		
		
		
		
		
	});	
});