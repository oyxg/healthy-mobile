/**
 * Created by CTY on 2016/9/1.
 * 自定义了一些日期函数
 */

$(function() {
    //补零
    function add0(num) {
        return num <= 9 ? '0' + num : num;
    }

    var now = new Date();
    var year = now.getFullYear();       //年
    var month = add0(now.getMonth() + 1);     //月
    var day = add0(now.getDate());            //日
    var toDay = year + '-' + month + '-' + day;
    //日期初始化
    $("#day").val(toDay);

    //减天数
    $(".date i[class*='fa-caret-left']").click(function () {
        var day = $(this).next('input').val();//获取当前输入框中的日期
        var timestamp = getTimeStamp(day);
        var date = new Date(parseInt(timestamp)).toISOString().substr(0, 10);//转换为日期
        $(this).next('input').val(date);
        //当生成时间<今天时，右箭头变绿
        if(getTimeStamp(date)<getTimeStamp(toDay)){
            $(this).nextAll("i[class*='fa-caret-right']").removeClass('max');
        }
    });

    //加天数
    $(".date i[class*='fa-caret-right']").click(function () {
        var day = $(this).prevAll('input').val();//获取当前输入框中的日期
        var timestamp = getTimeStamp(day);
        var snum = 3600 * 1000 * 48;//2天的毫秒数
        var nextDay = parseInt(timestamp) + snum;
        var date = new Date(nextDay).toISOString().substr(0, 10);//转换为日期
        //当生成时间>=今天时，右箭头变灰
        if(getTimeStamp(date)>getTimeStamp(toDay)){
            $(this).addClass('max');
            $.alert('没有明天的数据');
        }else{
            $(this).prevAll('input').val(date);
        }
    });

    //接收日期返回时间戳
    function getTimeStamp(day) {
        var y = day.substr(0, 4);
        var m = day.substr(5, 2);
        var d = day.substr(8, 2);
        //将日期转换成MM-dd-yyyy HH:mm:ss格式
        var time = m + '-' + d + '-' + y + ' 00:00:00';
        return Date.parse(time);
    }

});