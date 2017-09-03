console.log("Script file is loaded");
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const ACTIVE_TODOS_LIST_ID = "active-todos";
const COMPLETE_TODOS_LIST_ID = "complete-todos";
const DELETED_TODOS_LIST_ID = "deleted-todos";
const TODOS_LIST_ID = "todos_list_div";
const new_todo_input = "new_todo_input";


window.onload = getActiveTodosAJAX();
window.onload = getCompleteTodosAJAX();
window.onload = getDeletedTodosAJAX();

function addTodoElements(id, todos_data_json) {
    var todos = JSON.parse(todos_data_json);
    var parent = document.getElementById(id);
    // Fig out a better way of doing this and also read custom data
    parent.innerHTML = "";
    if(parent){
        if(Object.keys(todos).length !== 0){
            Object.keys(todos).forEach(function (key) {
                var todo_element = createTodoElement(key, todos[key]);
                parent.appendChild(todo_element);
            });
        }
        else if(id == ACTIVE_TODOS_LIST_ID){
            parent.innerHTML = "<p>You DO NOT have any active Todos...:)</p>";
        }
        else if(id == COMPLETE_TODOS_LIST_ID){
            parent.innerHTML = "<p>You have NOT COMPLETED any todo yet...:(</p>";
        }
        else if(id == DELETED_TODOS_LIST_ID){
            parent.innerHTML = "<p>You have NOT DELETED any todo yet.</p>";
        }
    }
}

function createTodoElement(id, todo_object) {
    var todo_element = document.createElement("div");

    todo_element.setAttribute("data-id", id);
    todo_element.setAttribute("class", "todoStatus"+todo_object.status + " breadthVertical");
    if(todo_object.status === "ACTIVE"){
        var active_checkbox = document.createElement("input");
        active_checkbox.setAttribute("type", "checkbox");
        active_checkbox.setAttribute("onclick", "completeTodoAJAX("+id+")");
        active_checkbox.setAttribute("class",  "checkbox-margin");
        todo_element.appendChild(active_checkbox);
    }

    if(todo_object.status === "COMPLETE"){
        var complete_checkbox = document.createElement("input");
        complete_checkbox.setAttribute("type", "checkbox");
        complete_checkbox.checked = true;
        complete_checkbox.setAttribute("class",  "checkbox-margin");
        complete_checkbox.setAttribute("onchange", "uncheck(this)");
        todo_element.appendChild(complete_checkbox);
    }
    var todo_title = document.createElement("span");
    todo_title.innerText = todo_object.title;
    todo_element.appendChild(todo_title);
    if(todo_object.status!== "DELETED"){
        var close_button = document.createElement("button");
        close_button.setAttribute("type", "button");
        close_button.setAttribute("class", "close");
        close_button.setAttribute("aria-label", "Close");
        close_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");
        close_button.innerHTML = "<span aria-hidden='true'>&times;</span>";


        todo_element.appendChild(close_button);

    }
    return todo_element;
}

function completeTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/complete/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                //xhr.response xhr.responseText
                addTodoElements(COMPLETE_TODOS_LIST_ID, xhr.responseText);
                getActiveTodosAJAX();
            }
            else {
                console.log(xhr.responseText);
            }
        }
    };

    var data = "todo_status=COMPLETE";
    xhr.send(data);
}


function deleteTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                //xhr.response xhr.responseText
                addTodoElements(DELETED_TODOS_LIST_ID, xhr.responseText);
                getActiveTodosAJAX();
                getCompleteTodosAJAX();
            }
            else {
                console.log(xhr.responseText);
            }
        }
    };

    var data = "todo_status=DELETED";
    xhr.send(data);

}

function getTodosAJAX() {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos", true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                //xhr.response xhr.responseText
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
        }
    };

    xhr.send(data = null);
}


function getActiveTodosAJAX() {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos/active", true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                //xhr.response xhr.responseText
                console.log(xhr.responseText);
                addTodoElements(ACTIVE_TODOS_LIST_ID, xhr.responseText);
            }
        }
    };

    xhr.send(data = null);
}

function getCompleteTodosAJAX() {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos/complete", true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                //xhr.response xhr.responseText
                console.log(xhr.responseText);
                addTodoElements(COMPLETE_TODOS_LIST_ID, xhr.responseText);
            }
        }
    };

    xhr.send(data = null);
}

function getDeletedTodosAJAX() {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos/deleted", true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                //xhr.response xhr.responseText
                console.log(xhr.responseText);
                addTodoElements(DELETED_TODOS_LIST_ID, xhr.responseText);
            }
        }
    };

    xhr.send(data = null);
}

function addTodoAJAX() {
    var title = document.getElementById(new_todo_input).value;


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/todos", true);

    xhr.setRequestHeader(
        "Content-type",  "application/x-www-form-urlencoded"
    );

    var data = "todo_title="+encodeURI(title);

    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                //xhr.response xhr.responseText
                //addTodoElements(TODOS_LIST_ID, xhr.responseText);
                getActiveTodosAJAX();
                document.getElementById(new_todo_input).value = "";
            }
            else {
                console.log(xhr.responseText);
            }
        }
    };

    xhr.send(data);
}


$(document).ready(function(){
    $("#hide-completed-button").click(function(){
        $("#complete-todos").toggle();

    });
});

$(document).ready(function(){
    $("#hide-deleted-button").click(function(){
        $("#deleted-todos").toggle();

    });
});

function uncheck(obj) {
    var id = obj.parentNode.attributes[0].value;

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/active/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                //xhr.response xhr.responseText
                addTodoElements(ACTIVE_TODOS_LIST_ID, xhr.responseText);
                getCompleteTodosAJAX();
            }
            else {
                console.log(xhr.responseText);
            }
        }
    };

    var data = "todo_status=ACTIVE";
    xhr.send(data);

}