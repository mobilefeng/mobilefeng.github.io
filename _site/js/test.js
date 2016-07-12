/*id*/
function id(name){
    return document.getElementById(name);
}

function create(name){
    return document.createElement(name);
}
/*addEvent*/
function addEvent(elm,type,handler){
  if(!elm) return false;
  if(elm.addEventListener){
    elm.addEventListener(type,handler,false);
    return true;
  }else if(elm.attachEvent){
    elm.attachEvent('on'+type,function(){handler.apply(elm)});
    return true;
  }
  return false;
}

function removeAllChild(elm){
    while(elm.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        elm.removeChild(elm.firstChild);
    }
}



/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = [];
var tagCity = false; //城市false 未通过验证  true 通过验证
var tagQt = false; //温度
var oCity = id('aqi-city-input');
var oQt = id('aqi-value-input');
var oTab = id('aqi-table');
var oAdd = id('add-btn');

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var city,qt;
    var result;

    //去两端空格
    city = oCity.value.trim();
    qt = oQt.value.trim();
    
    result = RegStr(city,qt);
    if(result.flag){
        aqiData.push([city,qt]);
        //初始化
        oCity.value='';
        oQt.value='';
    }else{
        alert(result.errMsg);
    }
}



function RegStr(city,qt){
    tagCity = false;
    tagQt = false;
    var regex = /^[\u4e00-\u9fa5a-zA-Z\/\(\)]+$/;
    var errMsg = [];
    var flag;

    if(regex.test(city)){
        tagCity=true;
    }else{
        errMsg.push('城市必须是字母跟汉字结合');
    }

    if(qt == parseInt(qt)){
        tagQt = true;
    }else{
        errMsg.push('温度必须是整数');
    }

    flag = tagCity && tagQt;
    return {
        flag:flag,
        errMsg:errMsg
    }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var oHeadTr = create('tr'),
        oHeadCity = create('td'),
        oHeadQt = create('td'),
        oBtn2 = create('td')

    //清除所有的子节点
    removeAllChild(oTab);

    //debugger;
    //标题栏
    oHeadCity.innerHTML = '城市';
    oHeadQt.innerHTML = '空气质量';
    oBtn2.innerHTML = '操作';

    /*appendCHild放在最后一项*/
    oHeadTr.appendChild(oHeadCity);
    oHeadTr.appendChild(oHeadQt);
    oHeadTr.appendChild(oBtn2);
    oTab.appendChild(oHeadTr);  

    //内容
    for(var i =0;i<aqiData.length;i++){
        var oTr =create('tr'),
            oCity = create('td'),
            oQt = create('td'),
            oTd=create('td'),
            oBtn1 = create('button')
        oCity.innerHTML = aqiData[i][0];
        oQt.innerHTML = aqiData[i][1];
        oBtn1.innerHTML = '删除';
        oTd.appendChild(oBtn1);

        /*appendCHild放在最后一项*/
        oTr.appendChild(oCity);
        oTr.appendChild(oQt);
        oTr.appendChild(oTd);
        oTab.appendChild(oTr);
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */

function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
  var oCity = e.target.parentElement.parentElement.firstChild;
  var j;
  for(var i=0;i<aqiData.length;i++){
    if(aqiData[i][0] == oCity.innerHTML){
        j = i;
        break;
    }
  }
  aqiData.splice(j,1);
  renderAqiList();
}

function init() {
  //debugger;
  //在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  addEvent(oAdd,'click',addBtnHandle);
  //想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  addEvent(oTab,'click',delBtnHandle);

}

init();