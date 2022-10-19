/*!
* Author: dasuiyuanhao
* Date: 2020-3-20
*/

/**筛选简历 控制面板**/
const filterFailedMsg="筛选简历失败！请在【推荐牛人】页面加载牛人列表";
const chromePlugin_p="20211206_DDFE1F6B-3C7F-5416-C011-251610E54350";

//绑定快捷键
$(document).bind('keydown.shift_q', async function () {
    try {
        await doThings();
    } catch (error) {
        alert(filterFailedMsg);
        console.error(error);
        return;
    }
});
$(document).bind('keydown.shift_a', function () {
    selectPrev();
});
$(document).bind('keydown.shift_d', function () {
    selectNext();
});

/**
 * 加载配置 开始
 */
var storageKeyOfTuijianSetting=chromePluginId+'_tuijianSetting';
var tuijianSettingData={
    "settingList":[]
}
var defaultSetting = {
    name:"XX岗位筛选",
    filterUniversityName: "",
};

//配置为多套
var loadFromSaved = false;
if (window.localStorage) {
    try {
        tuijianSettingData = loadTuijianSettingFromStorage();
        if (tuijianSettingData != null && tuijianSettingData.settingList!=null && tuijianSettingData.settingList.length>0) {
            let selectedIndex=tuijianSettingData.settingList.length-1;
            defaultSetting = tuijianSettingData.settingList[selectedIndex];
            $("#input_tuijianSettingName_control").val(defaultSetting.name);
            initTuijianSettingSelectControl(tuijianSettingData.settingList,defaultSetting.name)

            loadFromSaved = true;
            printLogInfo("读取【推荐牛人】筛选配置成功！");
        }
    } catch (error) {
        console.error(error);
        printLogInfo("读取【推荐牛人】筛选配置失败！");
    }
    
}

//从storage读取推荐配置
function loadTuijianSettingFromStorage(){  
    let result=null;  
    let strStorageOfTuijianSetting = window.localStorage.getItem(storageKeyOfTuijianSetting);
    if (strStorageOfTuijianSetting != null && strStorageOfTuijianSetting != "") {
        result = JSON.parse(strStorageOfTuijianSetting);        
    }
    return result;
}

//绘制配置选项下拉框
function initTuijianSettingSelectControl(dataArray,selectedVal){
    let $select=$("#select_tuijianSetting_control");
    $select.empty();
    if(dataArray.length>0){
        for(let i=0;i<dataArray.length;i++){
            var item=dataArray[i];
            $select.append("<option value='"+item.name+"'>"+item.name+"</option>");
        }
    }
    
    if(selectedVal!=null){
        $select.attr('value',selectedVal);
        $("#input_tuijianSettingName_control").val(selectedVal);
    }    
}

//如果读取不到本地配置，则设置默认值
if (!loadFromSaved) {
    initFilterSetting();

    tuijianSettingData={
        "settingList":[]
    }
    defaultSetting.name="XX岗位筛选";
    tuijianSettingData.settingList.push(defaultSetting);
    
    initTuijianSettingSelectControl(tuijianSettingData.settingList,null);
}
initFilterControl();

//下拉框选择事件
$("#select_tuijianSetting_control").change(function(){
    let selectVal=$("#select_tuijianSetting_control option:selected").val();
    let selectItem=null;
    for(let i=0;i<tuijianSettingData.settingList.length;i++){
        if(selectVal==tuijianSettingData.settingList[i].name){
            selectItem=tuijianSettingData.settingList[i];
        }
    }

    defaultSetting=selectItem;
    //加载配置
    initFilterControl();

    $("#input_tuijianSettingName_control").val(selectVal);

});

//初始化筛选条件配置
function initFilterSetting(){
        //筛选学历 211/985院校
    // defaultSetting.defaultSetting="北京大学,清华大学,中国人民大学,北京师范大学,北京航空航天大学,中国农业大学,北京理工大学,北京科技大学,北京交通大学,中国协和医科大学,中央音乐学院,北京邮电大学,北京外国语大学,北京化工大学,中国政法大学,北京语言大学,北京工业大学中央戏剧学院,中央美术学院,对外经济贸易大学,中央财经大学,北京中医药大学,北京体育大学,北京林业大学,中国传媒大学,国际关系学院,中央民族大学,石油大学,复旦大学,上海交通大学同济大学,华东师范大学,上海财经大学,华东理工大学,上海第二医科大学,上海大学,上海外国语大学,东华大学,南开大学,天津大学,天津医科大学,中央司法警官学院,华北电力大学,燕山大学,河北工业大学,太原理工大学,山西农业大学,内蒙古大学,大连理工大学,东北大学,辽宁大学,大连海事大学,沈阳农业大学,辽宁工程技术大学,吉林大学,东北师范大学,延边大学,哈尔滨工业大学,哈尔滨工程大学,东北林业大学,东北农业大学,大庆石油学院,南京大学,东南大学,中国矿业大学,南京师范大学,南京航空航天大学,南京理工大学,南京农业大学,苏州大学,中国药科大学,河海大学,江苏大学,南京信息工程大学,江南大学,浙江大学,中国科学技术大学,安徽大学合肥工业大学,厦门大学,福州大学,南昌大学,山东大学,中国海洋大学,郑州大学,武汉大学,华中科技大学,华中师范大学,中国地质大学,华中农业大学,武汉理工大学,中南财经政法大学,中南大学,湖南大学,湖南师范大学,湘潭大学,中山大学,华南理工大学,华南师范大学,暨南大学,华南农业大学,广西大学,重庆大学,西南政法大学,西南师范大学,西南农业大学,四川大学,电子科技大学,西南交通大学,西南财经大学,四川农业大学,云南大学,西安交通大学,西北工业大学,西北大学,西安电子科技大学,西北农林科技大学,陕西师范大学,长安大学,陕西科技大学,兰州大学,新疆大学,国防科学技术大学,贵州大学,西北农林科大学,石河子大学,海南大学,宁夏大学,青海大学,西藏大学,第二军医大学,第四军医大学,合肥工业大学西南大学,安徽大学,中国石油大学,同济大学,合肥工业大学,河南大学,国防科技大学,西南大学,上海交通大学,北京工业大学,辽宁大学,东北林业大学,海军军医大学,空军军医大学,成都理工大学,上海中医药大学,天津工业大学,南京邮电大学,首都师范大学,成都中医药大学,宁波大学,上海海洋大学,南京林业大学,天津中医药大学,广州中医药大学,中国科学院大学,南京中医药大学,北京工商大学,延边大学";
    //筛选学校 全国一本院校
    defaultSetting.filterUniversityName = "清华大学,北京大学,北京航空航天大学,北京中医药大学,北京语言大学,北京第二外国语学院,北京工商大学,中央民族大学,中国传媒大学,首都师范大学,中国政法大学,中央财经大学,中国人民大学,北京师范大学,中国农业大学,北京外国语大学,北京科技大学,北京邮电大学,北京交通大学,北京化工大学,北京工业大学,北京林业大学,中国地质大学,中国石油大学,中国矿业大学,华北电力大学,北京理工大学,北方工业大学,南开大学,天津大学,天津医科大学,天津财经大学,中国民航大学,河北大学,燕山大学,石家庄铁道大学,山西大学,太原理工大学,中北大学,内蒙古大学,内蒙古工业大学,大连海事大学,辽宁大学,辽宁工程技术大学,大连理工大学,东北大学,沈阳农业大学,中国医科大学,东北财经大学,吉林大学,延边大学,长春理工大学,东北师范大学,哈尔滨理工大学,哈尔滨工程大学,哈尔滨工业大学,黑龙江大学,东北林业大学,东北农业大学,东北石油大学,哈尔滨商业大学,华东理工大学,同济大学,华东师范大学,东华大学,上海外国语大学,上海理工大学,华东政法大学,上海财经大学,上海对外经贸大学,上海大学,上海交通大学,复旦大学,上海海事大学,南京大学,东南大学,南京农业大学,南京工业大学,南京邮电大学,南京财经大学,南京航空航天大学,中国药科大学,河海大学,苏州大学,南京信息工程大学,江苏大学,江苏科技大学,南京理工大学,南京林业大学,南京医科大学,南京中医药大学,南京师范大学,江南大学,浙江大学,宁波诺丁汉大学,宁波大学,浙江工业大学,杭州电子科技大学,浙江理工大学,浙江工商大学,福州大学,福建师范大学,厦门大学,华侨大学,福建农林大学,中国科学技术大学,合肥工业大学,安徽大学,安徽医科大学,安徽师范大学,安徽财经大学,安徽农业大学,安徽工业大学,安徽工程大学,安徽建筑大学,安徽理工大学,南昌大学,华东交通大学,江西财经大学,江西师范大学,南昌航空大学,江西理工大学,江西农业大学,山东大学,山东财经大学,山东农业大学,山东科技大学,青岛大学,中国海洋大学,山东师范大学,山东理工大学,河南大学,郑州大学,华中科技大学,武汉大学,华中师范大学,华中农业大学,武汉理工大学,中南财经政法大学,中南民族大学,长江大学,武汉科技大学,湖北工业大学,武汉工程大学,湖北大学,三峡大学,湖南大学,中南大学,湖南师范大学,湖南农业大学,中南林业科技大学,长沙理工大学,湘潭大学,南华大学,湖南科技大学,湖南中医药大学,中山大学,华南师范大学,汕头大学,广州中医药大学,华南理工大学,华南农业大学,南方医科大学,广东外语外贸大学,暨南大学,南方科技大学,广东工业大学,广州大学,深圳大学,广西大学,海南大学,西南大学,西南政法大学,重庆大学,重庆医科大学,重庆交通大学,重庆邮电大学,四川大学,四川农业大学,西南交通大学,电子科技大学,西南财经大学,西南石油大学,西南科技大学,成都理工大学,四川师范大学,成都信息工程大学,贵州大学,云南大学,昆明理工大学,西北工业大学,陕西科技大学,西北农林科技大学,西安交通大学,西安建筑科技大学,西安电子科技大学,西安外国语大学,陕西师范大学,西北大学,长安大学,西安工业大学,西安石油大学,西安理工大学,西安科技大学,兰州大学,青海大学,宁夏大学,新疆大学,石河子大学";
    //筛选学校专业
    defaultSetting.filterEduMajor = "";
    //年龄
    defaultSetting.ageGreatThanOrEqualTo = "23";
    defaultSetting.ageLessThanOrEqualTo = "35";

    //模拟鼠标点击坐标
    defaultSetting.autoMouseEventX = "";
    defaultSetting.autoMouseEventY = "";

    //学历
    defaultSetting.filterEducation = "本科,硕士";
    //不包含应届生
    defaultSetting.filterYingJie = true;
    //工龄
    defaultSetting.jobAgeGreatThanOrEqualTo = "";
    defaultSetting.jobAgeLessThanOrEqualTo = "";
    //性别
    defaultSetting.filterGender="";
    //打招呼后自动滚动到下一个
    defaultSetting.autoScrollNext = false;
    //经历岗位
    defaultSetting.filterWorkExp = "";
    //经历单位名称包含
    defaultSetting.filterWorkExpUnitNameLike = "";
    //最近3个工作单位平均时长大于等于
    defaultSetting.filterWorkExpTimeGreatThanOrEqualTo = "";
    //经历工作内容包含
    defaultSetting.filterWorkExpJobContentLike = "";

    //求职岗位
    defaultSetting.filterExpects = "Java,架构师,技术经理,JavaScript,web前端,前端开发,HTML5";
    //求职意向不包含
    defaultSetting.filterWillNotIn = "";
    //求职期望地点包含
    defaultSetting.filterExpectPlace = "";
    //牛人活跃状态包含
    defaultSetting.filterActiveStatus = "在线,刚刚活跃,今日活跃,3日内活跃,本周活跃,本月活跃";
}

//初始化筛选条件面板
function initFilterControl(){
    //学校名称
    $("#input_sql_control").val(defaultSetting.filterUniversityName);
    //学校专业
    $("#input_eduMajor_control").val(defaultSetting.filterEduMajor);
    //年龄大于等于
    $("#input_ageGreatThanOrEqualTo_control").val(defaultSetting.ageGreatThanOrEqualTo);
    //年龄小于等于
    $("#input_ageLessThanOrEqualTo_control").val(defaultSetting.ageLessThanOrEqualTo);

    //模拟鼠标点击坐标
    $("#input_autoMouseEventX_control").val(defaultSetting.autoMouseEventX);
    $("#input_autoMouseEventY_control").val(defaultSetting.autoMouseEventY);

    //学历
    $("#input_5_control").val(defaultSetting.filterEducation);
    //不包含应届生
    if(defaultSetting.filterYingJie) {
        $("#input_3_control").prop("checked", "checked");
    }
    else {
        $("#input_3_control").prop("checked", false);
    }

    //工龄大于等于
    $("#input_jobAgeGreatThanOrEqualTo_control").val(defaultSetting.jobAgeGreatThanOrEqualTo);
    //工龄小于等于
    $("#input_jobAgeLessThanOrEqualTo_control").val(defaultSetting.jobAgeLessThanOrEqualTo);

    //性别
    if (defaultSetting.filterGender != null) {
        $("#select_gender_control").val(defaultSetting.filterGender);
    }
    else {
        $("#select_gender_control").val("");
    }

    //打招呼后自动滚动到下一个
    if (defaultSetting.autoScrollNext) {
        $("#input_6_control").prop("checked", "checked");
    }
    else {
        $("#input_6_control").prop("checked", false);
    }
    //经历岗位
    $("#input_workExp_control").val(defaultSetting.filterWorkExp);
    //经历单位名称包含
    $("#input_workExpUnitName_control").val(defaultSetting.filterWorkExpUnitNameLike);
    //最近3个工作单位平均时长大于等于
    $("#input_workExpTime_control").val(defaultSetting.filterWorkExpTimeGreatThanOrEqualTo);
    //经历工作内容包含
    $("#input_workExpJobContent_control").val(defaultSetting.filterWorkExpJobContentLike);

    //求职岗位
    $("#input_4_control").val(defaultSetting.filterExpects);
    //求职意向不包含
    $("#input_7_control").val(defaultSetting.filterWillNotIn);
    //求职期望地点包含
    $("#input_8_control").val(defaultSetting.filterExpectPlace);
    //牛人活跃状态包含
    $("#input_9_control").val(defaultSetting.filterActiveStatus);

}

function getCD(installedTag){
    if(event && event.isTrusted){
        try {
            let objStorageM=null;
            let storageKey=chromePluginId+'_m';
            let valStorageM=window.localStorage.getItem(storageKey);
            if(valStorageM!=null && valStorageM!=""){
                objStorageM=JSON.parse(Base64.decode(valStorageM));
            }
            if(objStorageM==null){
                return null;
            }
            if(objStorageM.miyaoList==null || objStorageM.miyaoList.length<1){
                return null;
            }

            let result=null;
            $.each(objStorageM.miyaoList,function(index,item){
                if(item.installedTag==installedTag){
                    result=item.code;
                    return true;
                }
            })         
            return result;            
        } catch (error) {
            console.error("getCD异常",e);
        }

    }    
    return null;
}

/**
 * 加载默认配置 结束
 */

//绑定按钮事件
const e_query_control_btn = document.getElementById("query_control_btn");
e_query_control_btn.addEventListener('click', e => {
    //获取当前点击对象，切换act类，达到切换背景箭头的效果
    let $this=$(this);
    $("#query_control").toggle();
    let $query_control_btn_span=$(".query-control-btn-span");
    $query_control_btn_span.toggleClass('act');
    if($query_control_btn_span.text()=="展开"){
        $query_control_btn_span.text("收起");
    }
    else{
        $query_control_btn_span.text("展开");
    }
});

const btnSC1 = document.getElementById("search_btn1_control");
btnSC1.addEventListener('click', e => {
    try {
        scollLoadAll();
    } catch (error) {
        alert("一键加载全部异常！");
        console.error(error);
        return;
    }
});
const btnSC2 = document.getElementById("search_btn2_control");
btnSC2.addEventListener('click', async e => {
    try {
        await doThings();
    } catch (error) {
        alert(filterFailedMsg);
        console.error(error);
        return;
    }
});
const btnSC3 = document.getElementById("search_btn3_control");
btnSC3.addEventListener('click', e => {
    selectPrev();
});
const btnSC4 = document.getElementById("search_btn4_control");
btnSC4.addEventListener('click', e => {
    selectNext();
});


//保存筛选条件
const btnSaveFilter = document.getElementById("btn_save_filter");
btnSaveFilter.addEventListener('click', e => {
    try {
        if (window.localStorage) {
            //学校名称
            var strFilterUniversityName = $.trim($("#input_sql_control").val());
            defaultSetting.filterUniversityName = strFilterUniversityName;
            //学校专业
            var strFilterEduMajor = $.trim($("#input_eduMajor_control").val());
            defaultSetting.filterEduMajor = strFilterEduMajor;
            //年龄
            defaultSetting.ageGreatThanOrEqualTo = $.trim($("#input_ageGreatThanOrEqualTo_control").val());
            defaultSetting.ageLessThanOrEqualTo = $.trim($("#input_ageLessThanOrEqualTo_control").val());

            //模拟鼠标点击坐标
            defaultSetting.autoMouseEventX = $.trim($("#input_autoMouseEventX_control").val());
            defaultSetting.autoMouseEventY = $.trim($("#input_autoMouseEventY_control").val());

            //学历
            defaultSetting.filterEducation = $.trim($("#input_5_control").val());
            //不包含应届生
            var filterYingJie = false;
            if ($("#input_3_control").prop("checked")) {
                filterYingJie = true;
            }
            defaultSetting.filterYingJie = filterYingJie;

            //工龄
            defaultSetting.jobAgeGreatThanOrEqualTo = $.trim($("#input_jobAgeGreatThanOrEqualTo_control").val());
            defaultSetting.jobAgeLessThanOrEqualTo = $.trim($("#input_jobAgeLessThanOrEqualTo_control").val());

            //性别
            var filterGender = $("#select_gender_control").val();
            defaultSetting.filterGender = filterGender;

            //打招呼后自动滚动到下一个
            var autoScrollNext = false;
            if ($("#input_6_control").prop("checked")) {
                autoScrollNext = true;
            }
            defaultSetting.autoScrollNext = autoScrollNext;
            //经历岗位
            defaultSetting.filterWorkExp = $.trim($("#input_workExp_control").val());
            //经历单位名称包含
            defaultSetting.filterWorkExpUnitNameLike = $.trim($("#input_workExpUnitName_control").val());
            //经历岗位
            defaultSetting.filterWorkExpTimeGreatThanOrEqualTo = $.trim($("#input_workExpTime_control").val());
            //经历岗位
            defaultSetting.filterWorkExpJobContentLike = $.trim($("#input_workExpJobContent_control").val());

            //求职岗位
            defaultSetting.filterExpects = $.trim($("#input_4_control").val());
            //求职意向不包含
            defaultSetting.filterWillNotIn = $.trim($("#input_7_control").val());
            //求职期望地点
            defaultSetting.filterExpectPlace = $.trim($("#input_8_control").val());
            //牛人活跃状态包含
            defaultSetting.filterActiveStatus = $.trim($("#input_9_control").val());
            
            //筛选配置名称
            let settingName=$.trim($("#input_tuijianSettingName_control").val());
            if(settingName==""){
                printLogInfo("筛选配置名称不能为空");
                return;
            }
            
            //从存储获取最新
            tuijianSettingData = loadTuijianSettingFromStorage();
            if(tuijianSettingData==null){
                tuijianSettingData={
                    "settingList":[]
                }
            }
            let exitSettingIndex=null;
            if(tuijianSettingData.settingList!=null && tuijianSettingData.settingList.length>0){
                for(let i=0;i<tuijianSettingData.settingList.length;i++){
                    let item=tuijianSettingData.settingList[i];
                    if(item.name==settingName){
                        exitSettingIndex=i;
                        break;
                    }
                }
            }
            //修改配置
            if(exitSettingIndex!=null){
                defaultSetting.name=settingName;
                tuijianSettingData.settingList[exitSettingIndex]=defaultSetting;
            }
            else{
                //新增配置
                if(tuijianSettingData.settingList.length>=10){
                    printLogInfo("筛选配置最多10个");
                    return;
                }

                defaultSetting.name=settingName;                
                tuijianSettingData.settingList.unshift(defaultSetting);
            }

            var strOfTuijianSettingData = JSON.stringify(tuijianSettingData);
            
            window.localStorage.setItem(storageKeyOfTuijianSetting, strOfTuijianSettingData);
            printLogInfo("保存筛选配置成功！");

            if(exitSettingIndex==null){
                initTuijianSettingSelectControl(tuijianSettingData.settingList,settingName);
            }

        }
    } catch (error) {
        printLogInfo("保存异常！请检查配置");
        console.error(error);
        return;
    }
});

//重置筛选条件
const btnResetFilter = document.getElementById("btn_reset_filter");
btnResetFilter.addEventListener('click', e => {
    try {
        if (confirm("重置筛选条件将清空自定义内容，确定重置？")) {
            initFilterSetting();

            initFilterControl();

            tuijianSettingData={
                "settingList":[]
            }
            defaultSetting.name="XX岗位筛选";
            tuijianSettingData.settingList.push(defaultSetting);
            
    
            if (window.localStorage) {
                var strOfMySetting = JSON.stringify(tuijianSettingData);
                if (strOfMySetting == null || strOfMySetting == "") {
                    printLogInfo("配置参数不能为空");
                    return;
                }
    
                window.localStorage.setItem(storageKeyOfTuijianSetting, strOfMySetting);
                
            }

            initTuijianSettingSelectControl(tuijianSettingData.settingList,null);

            $("#input_tuijianSettingName_control").val(defaultSetting.name);

            printLogInfo("重置筛选配置成功！");
        }

    } catch (error) {
        printLogInfo("重置异常！请重试");
        console.error(error);
        return;
    }
});

//删除筛选条件
const btnDelFilter = document.getElementById("btn_del_filter");
btnDelFilter.addEventListener('click', e => {
    try {
        if (confirm("删除筛选条件将清空自定义内容，确定删除？")) {

            //筛选配置名称
            let settingName=$.trim($("#input_tuijianSettingName_control").val());
            if(settingName==""){
                printLogInfo("筛选配置名称不能为空");
                return;
            }
    
            if (window.localStorage) {

                //从存储获取最新
                let tuijianSettingData = loadTuijianSettingFromStorage();
                if(tuijianSettingData==null){
                    tuijianSettingData={
                        "settingList":[]
                    }
                }
                let exitSetting=null;
                let exitSettingIndex=null;
                if(tuijianSettingData.settingList!=null && tuijianSettingData.settingList.length>0){
                    for(let i=tuijianSettingData.settingList.length-1;i>=0;i--){
                        let item=tuijianSettingData.settingList[i];
                        if(item.name==settingName){
                            exitSetting=item;
                            exitSettingIndex=i;
                            tuijianSettingData.settingList.splice(i,1);
                        }
                    }
                }
                
                var strOfTuijianSettingData = JSON.stringify(tuijianSettingData);
                if (tuijianSettingData==null || tuijianSettingData.settingList==null 
                    || strOfTuijianSettingData == null) {
                    printLogInfo("配置参数不能为空");
                    return;
                }

                window.localStorage.setItem(storageKeyOfTuijianSetting, strOfTuijianSettingData);

                printLogInfo("删除配置成功！");

                //选中
                let nowSelected=null;
                if(tuijianSettingData.settingList.length>0){
                    // exitSettingIndex=exitSettingIndex-1;
                    // if(exitSettingIndex>=0){
                    //     nowSelected=tuijianSettingData.settingList[exitSettingIndex];
                    // }
                    nowSelected=tuijianSettingData.settingList[0];
                    defaultSetting=nowSelected;
                }

                initTuijianSettingSelectControl(tuijianSettingData.settingList,nowSelected.name);

                initFilterControl();
            }
        }

    } catch (error) {
        printLogInfo("删除异常！请重试");
        console.error(error);
        return;
    }
});

const btnSC6 = document.getElementById("search_btn6_control");
btnSC6.addEventListener('click', async e => {
    if(!event.isTrusted){
        console.warn("非可信操作");
        return;
    }
    try {
        await doThings();
    } catch (error) {
        alert(filterFailedMsg);
        console.error(error);
        return;
    }
    try {
        doThingsOfAutoCommunicate();
    } catch (error) {
        alert("自动打招呼异常！");
        console.error(error);
        return;
    }
});
