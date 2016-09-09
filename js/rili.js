+ function($) {
	"use strict";

	var today = new Date();

	var formatNumber = function (n) {
		return n < 10 ? "0" + n : n;
	};

	var initMonthes = ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ');

	var initYears = (function () {
		var arr = [];
		for (var i = 1950; i <= 2030; i++) { arr.push(i); }
		return arr;
	})();

	var defaults = {

		rotateEffect: false,  //为了性能

		value: [today.getFullYear(), formatNumber(today.getMonth()+1)],

		onChange: function (picker, values, displayValues) {
			createTabledate(picker.cols[0].value,picker.cols[1].value);
		},

		formatValue: function (p, values, displayValues) {
			return displayValues[0] + '-' + values[1];
		},

		cols: [
			// Years
			{
				values: initYears
			},
			// Months
			{
				values: initMonthes
			}
		]
	};
	//月份变更事件
	$.fn.datePicker = function(params) {
		return this.each(function() {
			if(!this) return;
			var p = $.extend(defaults, params);
			$(this).picker(p);
			if (params.value) $(this).val(p.formatValue(p, p.value, p.value));
		});
	};

}(Zepto);


//阻止冒泡
function stopBubble(e){
	if(e && e.stopPropagation){// 别的浏览器
		e.stopPropagation();
	}else{ //IE
		window.event.cancelBubble=true;
	}
}

//根据传入的年月，创建对应的table日期,并且在每个td中创建a标签用于事件，与样式内边框的设置
function createTabledate(year,yue){
	var rilitabledele=withClass("aboluo-rilitbody");
	if(rilitabledele!="" && rilitabledele!=null && rilitabledele!='undefined'){
	rilitabledele.parentNode.removeChild(rilitabledele);
	}
	var rilitable=newElement('tbody');
	rilitable.setAttribute("class","aboluo-rilitbody");
	var rili=withClass("aboluo-rilitable");
	rili.appendChild(rilitable);
	//先得到当前月第一天是星期几,然后根据这个星期算前面几天的上个月最后几天.
	var date=setdateinfo(year,yue,1);
	var weekday=date.getDay();
	var pervLastDay;
	if(weekday!=0){
		pervLastDay=weekday-1;
	}else{
		pervLastDay=weekday+6;
	}
	//得到上个月最后一天;
	var pervMonthlastDay=getPervMonthLastDay(year,yue);
	//上月最后几天循环
	var lastdays=pervMonthlastDay-pervLastDay+1;
	var tr=newElement('tr');
	tr.style.borderBottom="1px solid #e3e4e6";
	for(var i=lastdays;i<=pervMonthlastDay;i++){
		var td=newElement("td");
		var a=getA(parseInt(yue)-1==0?parseInt(year)-1:year,parseInt(yue)-1==0?12:parseInt(yue)-1,i);
		a.style.color="#BFBFC5";
//		a.href ='javascript:pervA('+parseInt(yue)-1==0?parseInt(year)-1:year+','+parseInt(yue)-1==0?12:parseInt(yue)-1+','+i+');';
		td.appendChild(a);
		//td.setAttribute("class","aboluo-pervMonthDays");
		tr.appendChild(td);
	}
	//这个月开始的循环
	var startDays=8-weekday==8?1:8-weekday;
	for(var i=1;i<=startDays;i++){
		var td=newElement("td");
		var b=getA(year,yue,i);
		td.appendChild(b);
		tr.appendChild(td);
	}
	rilitable.appendChild(tr);
	//指定年月最后一天
	var currMonthLashDay=getCurrMonthLashDay(year,yue);
	//当月除开第一行的起点
	var currmonthStartDay=currMonthLashDay-(currMonthLashDay-startDays)+1;
	//当月还剩余的天数
	var syts=currMonthLashDay-startDays;
	//循环次数
	var xhcs=0;
	if(check(syts/7)){
	//是小数
	xhcs=Math.ceil(syts/7);//向上取整
	}else{
	xhcs=syts/7;	
	}
	
	//这是下个月开始的变量;
	var jilvn=1;
	for(var i=0;i<xhcs;i++){
		var tr1=newElement('tr');
		if(i!=xhcs-1){
			tr1.style.borderBottom="1px solid #e3e4e6";
		}
		for(var n=1;n<=7;n++){
			var td=newElement('td');
			if(startDays==0){
				var c=getA(parseInt(yue)+1==parseInt(13)?parseInt(year)+1:year,parseInt(yue)+1==parseInt(13)?1:parseInt(yue)+1,jilvn);
				c.style.color="#BFBFC5";
				td.appendChild(c);
				td.setAttribute("class","aboluo-nextMonthDays");
				jilvn++;
				tr1.appendChild(td);
				continue;
			}else{
				startDays++;
				var d=getA(year,yue,startDays);
				td.appendChild(d);
				if(startDays==currMonthLashDay){
					startDays=0;
				}
				tr1.appendChild(td);
			}
		}
		rilitable.appendChild(tr1);
	}
	setHolidayred();//设置星期六星期天的样式
	setA(); //设置td中a的事件
	setSleepTimeByDay();//设置日历中每天的睡眠时长
}

//遍历每天并通过匹配日期赋值
function setSleepTimeByDay(){
	//模拟每日睡眠时长数据
	var obj = {'2016-9-9':'11.5','2016-9-8':'10.5'};//这里的数据由后台低通，这里只作为演示
	$('td a').each(function(){
		for(var key in obj){
			if(new Date(key).getTime()== new Date($(this).attr('date')).getTime()){
				var html = '<p>'+$(this).html()+'</p>';//天
				html += '<p>'+obj[key]+'</p>';//睡眠时长
				$(this).html(html);
			}
		}
	});
}

//给上一个月最后几天点击跳转月份
function pervA(year,yue,day){
	createTabledate(year,yue);  //创建对应的table(日期)
	updateSelect(year,yue);    //改变年月select值
}

//给上一个月最后几天点击跳转月份
function nextA(year,yue,day){
	createTabledate(year,yue);
	updateSelect(year,yue);
}

function updateSelect(year,yue){
	var selectmonth=withID("aboluo-selectmonth");
	var selectyear=withID("aboluo-yearSelect");
	selectmonth.value=yue;
	selectyear.value=year;
}



//遍历table将date事件等
function setHolidayred(){
	var rows=withClass("aboluo-rilitbody").rows;
	for(var i=0;i<rows.length;i++){
		for(var j=0;j<rows[i].cells.length;j++){
			var cell=rows[i].cells[j];
			var a=rows[i].cells[j].childNodes[0];
			var adate=a.getAttribute("date");
			var arr=adate.split("-");
			var date=new Date();
			var year=date.getFullYear();
			var month=date.getMonth();
			var day=date.getDate();
			if(arr[0]==year && arr[1]==month+1 && arr[2]==day){
				//cell.setAttribute("class","aboluo-tdcurrToday");
				a.setAttribute("class","aboluo-currToday");
			}
			if(j>=rows[i].cells.length-2 ){
				if(cell.getAttribute("class")!="aboluo-nextMonthDays" && cell.getAttribute("class")!="aboluo-pervMonthDays"){
					a.style.color="#000";
				}
			}
		}
	}
}


function formatByYearyueday(year,yue,day){
	year=year.toString();
	yue=yue.toString();
	day=day.toString();
	return year+"-"+(yue.length<2?'0'+yue:yue)+"-"+(day.length<2?'0'+day:day);
}

function formatByDate(date){
	date=date.substring(0,10);
	var daxx=date.toString().split("-");
	return daxx[0]+"-"+(daxx[1].length<2?'0'+daxx[1]:daxx[1])+"-"+(daxx[2].length<2?'0'+daxx[2]:daxx[2]);
}

//给tbody中的td中的A设置事件，上个月的天数,这个月的天数,下个月的天数三种对应的事件
//这里还有个功能就是判断当前的A中日期是不是数据库中有带状态的日期,如果是就给相当的样式
function setA(){
	var tbody=withClass("aboluo-rilitbody");
	var arr=tbody.getElementsByTagName("a");
	for(var i=0;i<arr.length;i++){
		var date=arr[i].getAttribute("date");
		arr[i].setAttribute("onclick","javascript:selectedA('"+date+"',this);javascript:stopBubble(this);");
	}
}

//a点击选中样式,先清除再设置选中样式
function setaclass(year,yue,day){
	var a=withClass("aboluo-aclick");
		a.className="";
		var date=new Date();
		var year1=date.getFullYear();
		var month1=date.getMonth();
		var day1=date.getDate();
		if(year1==year && yue==month1+1 && day1==day){
		}else{
			var tbody=withClass("aboluo-rilitbody");
			var arr=tbody.getElementsByTagName("a");
			for(var i=0;i<arr.length;i++){
				var date=arr[i].getAttribute("date");
				var datearr=date.split("-");
				if(datearr[0]==year && datearr[1]==yue && datearr[2]==day){
					arr[i].setAttribute("class","aboluo-aclick");
				}
			}
		}

}


//获取当前选取的日期
function getAclickDomDate(){
	var aclick=withClass("aboluo-aclick");
	if(aclick==""){
		//说明没选,那么就给当天,按12月算
		var date=new Date();
		return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
	}else{
		return aclick.getAttribute("date");
	}
}

//获取当前选中的a元素
function getAclickDom(){
	var aclick=withClass("aboluo-aclick");
	if(aclick==""){
		//说明没选,那么就给当天,按12月算
		return withClass("aboluo-currToday");
	}else{
		return aclick;
	}
}


//创建元素
function newElement(val){
	return document.createElement(val);
}

//创建date对象并赋值
function setdateinfo(year,yue,day){
	var date=new Date();
	date.setFullYear(parseInt(year));
	date.setMonth(parseInt(yue)-1);
	date.setDate(parseInt(day));
	return date;
}

//根据年月日判断是不是星期六星期天 //yue 按12算
function isweekend(year,yue,day){
	var date=new Date();
	date.setFullYear(year);
	date.setMonth(yue-1);
	date.setDate(day);
	var week=date.getDay();
	if(week==0 || week==6){
		return true;
	}
	return false;
}

//根据getDay()返回对应的星期字符串
function getWeek(val){
	var weekxq=new Array();
	weekxq[0]="星期日";
	weekxq[1]="星期一";
	weekxq[2]="星期二";
	weekxq[3]="星期三";
	weekxq[4]="星期四";
	weekxq[5]="星期五";
	weekxq[6]="星期六";
	return weekxq[val];
}

//判断c是否是小数
function check(c){
	var r=/^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
	return r.test(c);
}

//得到指定月的上个月最后一天传进来按 12月算
function getPervMonthLastDay(year,yue){
	//当月就是  yue-1 也就是计算机里面的0-11月份,那么算上个月的最后一天就是当月的0天
	return parseInt(new Date(year,yue-1,0).getDate());
}

//得到指定月最后一天 传进来按 12月算
function getCurrMonthLashDay(year,yue){
	if(yue>=12){
		year=year+1;
		yue=yue-12;
	}
	return parseInt(new Date(year,yue,0).getDate());
}


//创建a标签并设置公用属性
function getA(year,yue,day){
	//var span=newElement("span");
	//span.innerHTML=time;
	var a=newElement("a");
	a.href="javascript:;";
	a.innerHTML=day;
	a.style.textDecoration="none";
	a.setAttribute("date",year+"-"+yue+"-"+day);

	return a;
}


//得到id对象
function withID(id){
	return document.getElementById(id);
}
//得到传入参数为class的对象(同名返回第一个)
function withClass(id){
	var targets= targets ||  document.getElementsByTagName("*");
	var list=[];
	for(var k in targets){
		var target=targets[k];
		if(target.className==id){
			return target;
		}
	}
	return "";
}

//选中A
function selectedA(date,e){
	var tbody=withClass("aboluo-rilitbody");
	var arr=tbody.getElementsByTagName("a");
	for(var i=0;i<arr.length;i++){
		if(arr[i].getAttribute("date")==date){
			arr[i].setAttribute("class","aboluo-aclick");
		}else{
			if(arr[i].getAttribute("class")=='aboluo-currToday'){
				continue;
			}
			arr[i].setAttribute("class","");
		}
	}
	$.alert(date);
}


