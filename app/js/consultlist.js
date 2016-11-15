//咨询
mui.ready(function() {
	
	mui.plusReady(function(){
		var userid = plus.storage.getItem('userid');
		var listContainer = document.getElementById("listContainer");//咨询列表容器
		console.log(userid);
		/*var consultStr = getConsultData(userid,0,0,0);
		var myNeedStr = getMyNeedData(userid,0,0,0);
		var allStr = allData(userid,0,0,1);
		listContainer.innerHTML = consultStr + myNeedStr;
		listContainer.innerHTML = allStr;*/
		
		var list = allData(userid,0,'',0,0);
		console.log(list);
		listContainer.innerHTML = list;

		//点击选择
		function checkedFun(i){
			mui("#middlePopover"+i).on('tap','.mui-navigate-right',function(e){
				document.getElementById("headck"+i).innerHTML = e.target.innerHTML;
				var value = e.target.getAttribute("ck"+i);
				document.getElementById("headck"+i).setAttribute('headck',value);
				document.querySelector('.mui-backdrop').style.display = 'none';
				document.getElementById("middlePopover"+i).style.display = 'none';
				var consultType;
				if(document.getElementById("headck2").getAttribute('headck') == 0){
					consultType = '';
				}else {
					consultType = document.getElementById("headck2").innerHTML;
					console.log(typeof(consultType));
				}
				//去掉样式类mui-active,要不然会多点击一次
				var oheadVal = {
					val1:document.getElementById("headck1").getAttribute('headck'),
					val2:consultType,
					val3:document.getElementById("headck3").getAttribute('headck'),
					val4:document.getElementById("headck4").getAttribute('headck')
				};
				console.log(oheadVal.val1+oheadVal.val2+oheadVal.val3+oheadVal.val4)
				
				/*allData(userid,consultOrNeed,consultType,status,timeType)
				 * userid:专家id
				 * consultOrNeed:接受咨询或咨询别人的状态值，0-全部，1-别人咨询我的，2-我咨询别人的 默认为0
				 * consultType:咨询类型(技术咨询、资源咨询、其他事务)
				 * status:查询状态 0-全部，1-进行中，2-未感谢，3-未评价，4-已完成， 可以不传，默认为0
				 * timeType:排序类型 0-按发起时间正序，1-按最后回复时间倒序，2-按完成时间倒序 默认为1
				 */
				var listdata = allData(userid,oheadVal.val1,oheadVal.val2,oheadVal.val3,oheadVal.val4);
				listContainer.innerHTML = '';
				listContainer.innerHTML = listdata;
			});
			
		};
		checkedFun(1);
		checkedFun(2);
		checkedFun(3);
		checkedFun(4);
		
		/*全部的咨询列表*/
		function allData(userid,consultOrNeed,consultType,status,timeType) {
			var allStr;
			var params = {
					"professorId":userid, //专家ID
				    "consultOrNeed":consultOrNeed, //接受咨询或咨询别人的状态值，0-全部，1-别人咨询我的，2-我咨询别人的 默认为0
				    "consultType":consultType, //咨询类型(技术咨询、资源咨询、其他事务)
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
						console.log(myData.length);
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
					proModify,
					photoUrl;
				//咨询类型和状态
				if(data[i]['consultantId'] != userid){//收到咨询
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
						}else {
							status = '已完成';
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
				//专家头像
				if(data[i]["professor"]["hasHeadImage"] == 0){
					photoUrl = "../images/default-photo.jpg";
					
				}else{
					photoUrl = "../images/head/"+data[i]["professor"]["id"]+"_m.jpg";
					
				};
				
				
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
		        htmlStr += '<img class="mui-media-object mui-pull-left headimg" src="'+photoUrl+'">';
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