window.onload = countBodyChild;

function showPic(whichpic) {
    var source = whichpic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    placeholder.setAttribute("src", source);

    var title = whichpic.getAttribute("title");
    var description = document.getElementById("description");
    // description.innerHTML = title;
    description.firstChild.nodeValue = title;
    // alert(description.childNodes.length);
}

function countBodyChild() {
    var bodyEle = document.getElementsByTagName("body")[0];
    // alert(bodyEle.childNodes.length);
}