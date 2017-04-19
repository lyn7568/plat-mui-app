var table1 = document.getElementById("table1");
var aflas = false;
var lasttime;
var userId;
mui.plusReady(function() {
	userId = plus.storage.getItem('userid');
	setFractionFun(userId);
})

mui.init({
	pullRefresh: {
		container: '#rawardsSet',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh,
		}
	}
});

function pullupRefresh() {
	aflas = true;
	lasttime = table1.lastChild.getAttribute("data-time");
	setTimeout(function() {
		setFractionFun(userId);
		mui('#rawardsSet').pullRefresh().endPulldownToRefresh();
	}, 1000);
}

/*获得积分*/
function setFractionFun(userId) {
	if(aflas == true) {
		var createTime = lasttime;
	} else {
		var createTime = "";
	}
	mui.ajax(baseUrl + "/ajax/growth/queryByPro", {
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		timeout: 10000, //超时设置
		data: {
			"professorId": userId,
			"createTime": createTime,
			"rows": 20
		},
		success: function(data) {
			if(aflas == true) {
				if(data.success && data.data != '') {
					var datalist = data.data;
					datalistEach(datalist);
					if(data.data.length < 20) {
						mui('#rawardsSet').pullRefresh().endPullupToRefresh(false);
					} else {
						mui('#rawardsSet').pullRefresh().endPullupToRefresh(true);
					}
				} else {
					mui('#rawardsSet').pullRefresh().endPullupToRefresh(true);
				}
			} else {
				if(data.success && data.data != '') {
					var datalist = data.data;
					datalistEach(datalist);
					if(data.data.length < 20) {
						mui('#rawardsSet').pullRefresh().endPullupToRefresh(false);
					} else {
						mui('#rawardsSet').pullRefresh().endPullupToRefresh(true);
					}
				} else {
					mui('#rawardsSet').pullRefresh().disablePullupToRefresh();
					document.getElementById("noset").classList.remove("displayNone");
				}
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}

/*获得积分数据遍历*/
function datalistEach(datalist) {
	mui.each(datalist, function(index, item) {
		var operate;
		switch(item.operate) {
			case "1":
				operate = "成功邀请一位好友";
				break;
			case "2":
				operate = "成功分享专家信息到微信";
				break;
			case "3":
				operate = "成功分享文章到微信";
				break;
			case "4":
				operate = "成功分享资源到微信";
				break;
			case "5":
				if(item.signInDays == 1) {
					operate = "每日签到";
				} else {
					operate = "连续签到" + item.signInDays + "天";
				}
				break;
			case "6":
				operate = "添加一个研究方向";
				break;
			case "7":
				operate = "给专家的研究方向点赞";
				break;
			case "8":
				operate = "自己的研究方向被点赞";
				break;
			case "9":
				operate = "发布文章";
				break;
			case "-9":
				operate = "删除文章";
				break;
			case "10":
				operate = "给别人的文章留言";
				break;
			case "11":
				operate = "自己的文章获得留言";
				break;
			case "12":
				operate = "发布资源";
				break;
			case "-12":
				operate = "删除资源";
				break;
			case "13":
				operate = "通过实名认证";
				break;
			case "14":
				operate = "成为科袖认证专家";
				break;
			case "15":
				operate = "成为企业认证用户";
				break;
			case "16":
				operate = "接受一次咨询";
				break;
			case "17":
				operate = "完成一次咨询";
				break;
			case "18":
				operate = "获得4星及以上评价";
				break;
			case "19":
				operate = "评价一次咨询";
				break;
			case "20":
				operate = "发布个人需求";
				break;
			case "21":
				operate = "发布企业需求";
				break;
			case "22":
				operate = "确认一次需求";
				break;
			case "23":
				operate = "首次绑定手机(包括注册)";
				break;
			case "24":
				operate = "首次绑定手机(包括注册)";
				break;
			case "25":
				operate = "首次绑定邮箱(包括注册)";
				break;
			case "101":
				operate = "成功邀请好友后邀请人获得积分";
				break;
			case "102":
				operate = "添加研究方向给邀请人加分";
				break;
			case "103":
				operate = "发布文章给邀请人加分";
				break;
			case "104":
				operate = "发布资源给邀请人加分";
				break;
			case "-104":
				operate = "删除资源给邀请人减分";
				break;
			case "105":
				operate = "通过实名认证给邀请人加分";
				break;
			case "106":
				operate = "成为认证专家给邀请人加分";
				break;
			case "107":
				operate = "成为企业认证用户给邀请人加分";
				break;
			case "108":
				operate = "接受咨询给邀请人加分";
				break;
			case "109":
				operate = "完成咨询给邀请人加分";
				break;
			case "110":
				operate = "获得4星及以上评价给邀请人加分";
				break;
			case "111":
				operate = "评价咨询给邀请人加分";
				break;
			case "112":
				operate = "发布个人需求给邀请人加分";
				break;
			case "113":
				operate = "发布企业需求给邀请人加分";
				break;
			case "114":
				operate = "确认一次需求给邀请人加分";
				break;
		}

		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.setAttribute("data-time", item.createTime);
		li.innerHTML = ' <div class="rewardWhy">' +
			'<p class="h1Font">' + operate + '</p>' +
			'<p class="h2Font">' + Time(item.createTime) + '</p>' +
			'</div><span class="rewardCount">' + item.score + ' 分</span></li>';
		table1.appendChild(li, table1.firstChild);
	});
}

/*时间转换*/
function Time(dealtime) {
	var s = dealtime;
	var m = s.substr(4, 2);
	var d = s.substr(6, 2);
	var h = s.substr(8, 2);
	var minute = s.substr(10, 2);
	var formatTime = m + "-" + d + " " + h + ":" + minute;
	return formatTime;
}