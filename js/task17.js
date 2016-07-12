/* 数据格式演示
var aqiSourceData = {
    "北京": {
        "2016-01-01": 10,
        "2016-01-02": 10,
        "2016-01-03": 10,
        "2016-01-04": 10
    }
};
*/

// #import "./echarts.js"

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    // 获取要展现的数据
    var cityArr = Object.getOwnPropertyNames(aqiSourceData);
    var cityName = cityArr[pageState.nowSelectCity];
    var showDate = chartData[pageState.nowGraTime][cityName];

    // 获取图表div
    var chartDiv = document.querySelector(".aqi-chart-wrap");
    chartDiv.style.width = "1000px";
    chartDiv.style.height = "400px";

    // 初始化echarts实例
    var myChart = echarts.init(chartDiv);

    // // 基于准备好的dom，初始化echarts实例
    // var myChart = echarts.init(document.getElementById('main'));

    var xData = [];
    var yData = [];
    for (var ele in showDate) {
        xData.push(ele);
        yData.push(showDate[ele]);
    }
    console.log(xData);
    console.log(yData);

    // 指定图表的配置项和数据
    var option = {
        title: {},
        tooltip: {},
        legend: {
            data: ['空气质量指数']
        },
        xAxis: {
            data: xData
        },
        yAxis: {},
        visualMap: {
            top: 10,
            right: 10,
            pieces: [{
                gt: 0,
                lte: 50,
                color: '#096'
            }, {
                gt: 50,
                lte: 100,
                color: '#ffde33'
            }, {
                gt: 100,
                lte: 150,
                color: '#ff9933'
            }, {
                gt: 150,
                lte: 200,
                color: '#cc0033'
            }, {
                gt: 200,
                lte: 300,
                color: '#660099'
            }, {
                gt: 300,
                color: '#7e0023'
            }],
            outOfRange: {
                color: '#999'
            }
        },
        series: [{
            name: '空气指数',
            type: 'bar',
            data: yData
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(selectRadio) {
    // 确定是否选项发生了变化
    if (pageState.nowGraTime != selectRadio.value) {
        // 设置对应数据
        pageState.nowGraTime = selectRadio.value;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(selectBox) {
    // 确定是否选项发生了变化
    if (pageState.nowSelectCity != selectBox.selectedIndex) {
        // 设置对应数据
        pageState.nowSelectCity = selectBox.selectedIndex;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var form = document.getElementById("form-gra-time");
    var radios = form.elements["gra-time"];
    var prev = null;
    for(var i = 0; i < radios.length; i++) {
        radios[i].onclick = function() {
            if(this !== prev) {
                prev = this;
                graTimeChange(this);
            }
        };
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelect = document.getElementById("city-select");
    while (citySelect.hasChildNodes()) {
        citySelect.removeChild(citySelect.firstChild);
    }
    for (var item in aqiSourceData) {
        var cityNode = document.createElement("option");
        cityNode.text = item;
        citySelect.add(cityNode, undefined);
    }
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    citySelect.onchange = function() {
        citySelectChange(this);
    }
    pageState.nowSelectCity = 0;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    var weekData = {};
    var monthData = {};

    for (var cityItem in aqiSourceData) {
        var cityData = aqiSourceData[cityItem];
        var cityWeekData = {};
        var cityMonthData = {};

        var weekCnt = 0;
        var weekTempSum = 0;
        var weekNo = 0;
        var monthCnt = 0;
        var monthTempSum = 0;
        var monthNo = 0;
        for (var ele in cityData) {
            var date = new Date(ele);

            // 每周数据取均值
            weekTempSum += cityData[ele];
            weekCnt ++;
            if (date.getDay() == 6) {
                weekNo ++;
                cityWeekData["第"+weekNo+"周"] = Math.ceil(weekTempSum / weekCnt);
                weekCnt = 0;
                weekTempSum = 0;
            }

            // 每月数据取均值
            if (date.getDate() == 1) {
                if (monthTempSum > 0) {
                    monthNo ++;
                    cityMonthData["第"+monthNo+"月"] = Math.ceil(monthTempSum / monthCnt);
                    monthCnt = 0;
                    monthTempSum = 0;
                }
            }
            monthTempSum += cityData[ele];
            monthCnt ++;
        }
        monthNo ++;
        cityMonthData["第"+monthNo+"月"] = Math.ceil(monthTempSum / monthCnt);
        weekData[cityItem] = cityWeekData;
        monthData[cityItem] = cityMonthData;
    }
    // 处理好的数据存到 chartData 中
    chartData["day"] = aqiSourceData;
    chartData["week"] = weekData;
    chartData["month"] = monthData;

    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();
