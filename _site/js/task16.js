/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *	  "北京": 90,
 *    "上海": 40
 * };
 */

window.onload = function() {


var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var cityInput = document.getElementById("aqi-city-input");
	var valueInput = document.getElementById("aqi-value-input");
	if (cityInput.value.length == 0 || valueInput.value.length == 0) {
		alert("输入不能为空噢～");
		return;
	}
	aqiData[cityInput.value] = valueInput.value;
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(rowIndex) {
	// do sth.
	var aqiTable = document.getElementById("aqi-table");
	deleteCity = aqiTable.rows[rowIndex].cells[0].innerHTML;
	delete aqiData[deleteCity];

	renderAqiList();
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var aqiTable = document.getElementById("aqi-table");

	// 清空ul下的li，防止重复打印
	while (aqiTable.hasChildNodes()) {
		aqiTable.removeChild(aqiTable.firstChild);
	}

	var headRow = aqiTable.insertRow(aqiTable.rows.length);
	var cell1 = headRow.insertCell(headRow.cells.length);
	var cell2 = headRow.insertCell(headRow.cells.length);
	var cell3 = headRow.insertCell(headRow.cells.length);
	cell1.innerHTML = "城市";
	cell2.innerHTML = "空气质量";
	cell3.innerHTML = "操作";

	for (var ele in aqiData) {
		var dataRow = aqiTable.insertRow(aqiTable.rows.length);
		var cityCell = dataRow.insertCell(dataRow.cells.length);
		var valueCell = dataRow.insertCell(dataRow.cells.length);
		var deleteCell = dataRow.insertCell(dataRow.cells.length);
		cityCell.innerHTML = ele;
		valueCell.innerHTML = aqiData[ele];
		deleteCell.innerHTML = "<input type='button' value='删除' class='removeBtn'>";
	}

	var removeBtns = document.getElementsByClassName("removeBtn");
	for (var i = 0; i < removeBtns.length; i ++) {
		removeBtns[i].onclick = function() {
			delBtnHandle(this.parentNode.parentNode.rowIndex);
		};
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

// /**
//  * 点击各个删除按钮的时候的处理逻辑
//  * 获取哪个城市数据被删，删除数据，更新表格显示
//  */
// function delBtnHandle() {
// 	// do sth.
// 	alert("123");

// 	renderAqiList();
// }

function init() {

	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	var addBtn = document.getElementById("add-btn");
	// addBtn.onclick = addBtnHandle;
	addBtn.addEventListener('click', addBtnHandle, false);

	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

}

init();


}