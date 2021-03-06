
var rowId = "";

//单据的开始时间、结束时间
var startTime = "", endTime = "";

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({  //指定js别名
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        laydate = layui.laydate,
        table = layui.table;
    authBtn('1571810606540');//新增
    authBtn('1572314337984');//导出

    laydate.render({
        elem: '#billTime', //指定元素
        range: '~'
    });

    //表格渲染
    table.render({
        id: 'messageTable',
        elem: '#messageTable',
        method: 'post',
        url: reqBasePath + 'expenditure001',
        where: {billNo: $("#billNo").val(), startTime: startTime, endTime: endTime},
        even: true,  //隔行变色
        page: true,
        limits: [8, 16, 24, 32, 40, 48, 56],
        limit: 8,
        cols: [[
            { title: '序号', type: 'numbers'},
            { field: 'billNo', title: '单据编号', align: 'left', width: 200, templet: function(d){
                return '<a lay-event="details" class="notice-title-click">' + d.billNo + '</a>';
            }},
            { field: 'supplierName', title: '往来单位', align: 'left', width: 150},
            { field: 'totalPrice', title: '合计金额', align: 'left', width: 120},
            { field: 'hansPersonName', title: '经手人', align: 'left', width: 100},
            { field: 'billTime', title: '单据日期', align: 'center', width: 140 },
            { title: '操作', fixed: 'right', align: 'center', width: 200, toolbar: '#tableBar'}
        ]]
    });

    table.on('tool(messageTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'delete') { //删除
            deleteexpenditure(data);
        }else if (layEvent === 'details') { //详情
            details(data);
        }else if (layEvent === 'edit') { //编辑
            edit(data);
        }
    });

    //搜索表单
    form.render();
    form.on('submit(formSearch)', function (data) {
        //表单验证
        if (winui.verifyForm(data.elem)) {
            loadTable();
        }
        return false;
    });

    //编辑
    function edit(data){
        rowId = data.id;
        _openNewWindows({
            url: "../../tpl/expenditure/expenditureedit.html",
            title: "编辑",
            pageId: "expenditureedit",
            area: ['90vw', '90vh'],
            callBack: function(refreshCode){
                if (refreshCode == '0') {
                    winui.window.msg("操作成功", {icon: 1,time: 2000});
                    loadTable();
                } else if (refreshCode == '-9999') {
                    winui.window.msg("操作失败", {icon: 2,time: 2000});
                }
            }});
    }

    //删除
    function deleteexpenditure(data){
        layer.confirm('确认要删除信息吗？', { icon: 3, title: '删除操作' }, function (index) {
            AjaxPostUtil.request({url:reqBasePath + "expenditure005", params: {rowId: data.id}, type:'json', callback:function(json){
                if(json.returnCode == 0){
                    winui.window.msg("删除成功。", {icon: 1,time: 2000});
                    loadTable();
                }else{
                    winui.window.msg(json.returnMessage, {icon: 2,time: 2000});
                }
            }});
        });
    }

    //详情
    function details(data){
        rowId = data.id;
        _openNewWindows({
            url: "../../tpl/expenditure/expenditureinfo.html",
            title: "详情",
            pageId: "expenditureinfo",
            area: ['90vw', '90vh'],
            callBack: function(refreshCode){
                if (refreshCode == '0') {
                    winui.window.msg("操作成功", {icon: 1,time: 2000});
                    loadTable();
                } else if (refreshCode == '-9999') {
                    winui.window.msg("操作失败", {icon: 2,time: 2000});
                }
            }});
    }

    //添加
    $("body").on("click", "#addBean", function(){
        _openNewWindows({
            url: "../../tpl/expenditure/expenditureadd.html",
            title: "新增",
            pageId: "expenditureadd",
            area: ['90vw', '90vh'],
            callBack: function(refreshCode){
                if (refreshCode == '0') {
                    winui.window.msg("操作成功", {icon: 1,time: 2000});
                    loadTable();
                } else if (refreshCode == '-9999') {
                    winui.window.msg("操作失败", {icon: 2,time: 2000});
                }
            }});
    });

    $("body").on("click", "#reloadTable", function() {
        loadTable();
    });

    $("body").on("click", "#formSearch", function () {
        refreshTable();
    });

    //刷新
    function loadTable(){
        if(isNull($("#billTime").val())){//一定要记得，当createTime为空时
            startTime = "";
            endTime = "";
        }else {
            startTime = $("#billTime").val().split('~')[0].trim() + ' 00:00:00';
            endTime = $("#billTime").val().split('~')[1].trim() + ' 23:59:59';
        }
        table.reload("messageTable", {where:{billNo: $("#billNo").val(), startTime: startTime, endTime: endTime}});
    }

    //搜索
    function refreshTable(){
        if(isNull($("#billTime").val())){//一定要记得，当createTime为空时
            startTime = "";
            endTime = "";
        }else {
            startTime = $("#billTime").val().split('~')[0].trim() + ' 00:00:00';
            endTime = $("#billTime").val().split('~')[1].trim() + ' 23:59:59';
        }
        table.reload("messageTable", {page: {curr: 1}, where:{billNo: $("#billNo").val(), startTime: startTime, endTime: endTime}})
    }
    
    //导出excel
    $("body").on("click", "#downloadExcel", function () {
    	if(isNull($("#billTime").val())){//一定要记得，当createTime为空时
    		startTime = "";
    		endTime = "";
    	}else {
    		startTime = $("#billTime").val().split('~')[0].trim() + ' 00:00:00';
    		endTime = $("#billTime").val().split('~')[1].trim() + ' 23:59:59';
    	}
    	postDownLoadFile({
			url : reqBasePath + 'expenditure007?userToken=' + getCookie('userToken') + '&loginPCIp=' + returnCitySN["cip"],
			params: {billNo: $("#billNo").val(), startTime: startTime, endTime: endTime},
			method : 'post'
		});
    });

    exports('expenditurelist', {});
});
