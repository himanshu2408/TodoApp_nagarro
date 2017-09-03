var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var reload = require('reload');
var morgan = require('morgan');

var app = express();

var todo_db = require('./seed');

// Set Port
app.set('port', process.env.PORT || 3000);

//middlewares
app.use('/',  bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

//serve static files
app.use('/', express.static(__dirname+"/public"));


app.get('/api/todos', function (req, res) {
    res.json(todo_db.todos);
});

app.put('/api/todos/:id', function (req, res) {
    var mod_id = req.params.id;
    var todo = todo_db.todos[mod_id];

    if(!todo){
        res.status(400).json( {
            error: "Error!! Todo with this id does not exist."
        })
    }
    else {
        var todo_title = req.body.todo_title;
        var todo_status = req.body.todo_status;
        if(todo_title && todo_title !=="" && todo_title.trim() !== ""
            && todo_status && (todo_status === "COMPLETE" || todo_status === "DELETED")){
            todo.title = todo_title;
            todo.status = todo_status;
            res.json(todo_db.todos);
        }
        else {
            res.status(400).json({
                error: "Please input valid data"
            })
        }
    }

});

app.post('/api/todos', function (req, res) {
    var todo_title = req.body.todo_title;
    var next_todo_id = todo_db.next_todo_id;
    if(!todo_title || todo_title==="" || todo_title.trim()===""){
        res.json(400, {
            error: "Error!!! Todo Title cannot be empty"
        })
    }
    else {
        var new_todo = {
            title: todo_title,
            status: todo_db.StatusENUMS.ACTIVE
        };
        todo_db.todos[next_todo_id] = new_todo;
        todo_db.next_todo_id++;
        res.json(todo_db.todos);
    }

});

app.delete('/api/todos/:id', function (req, res) {
    var del_id = req.params.id;
    var todo = todo_db.todos[del_id];

    if(!todo){
        res.status(400).json( {
            error: "Error!! Todo with this id does not exist."
        })
    }
    else {
        todo.status = todo_db.StatusENUMS.DELETED;
        var  deleted_todos = {};
        Object.keys(todo_db.todos).forEach(function (key) {
            if(todo_db.todos[key].status === todo_db.StatusENUMS.DELETED){
                deleted_todos[key] = todo_db.todos[key];
            }
        });
        res.json(deleted_todos);
    }

});


app.get('/api/todos/active', function (req, res) {
    var  active_todos = {};
    Object.keys(todo_db.todos).forEach(function (key) {
        if(todo_db.todos[key].status === todo_db.StatusENUMS.ACTIVE){
            active_todos[key] = todo_db.todos[key];
        }
    });
    res.json(active_todos);
});

app.get('/api/todos/complete', function (req, res) {
    var  complete_todos = {};
    Object.keys(todo_db.todos).forEach(function (key) {
        if(todo_db.todos[key].status === todo_db.StatusENUMS.COMPLETE){
            complete_todos[key] = todo_db.todos[key];
        }
    });
    res.json(complete_todos);
});

app.get('/api/todos/deleted', function (req, res) {
    var  deleted_todos = {};
    Object.keys(todo_db.todos).forEach(function (key) {
        if(todo_db.todos[key].status === todo_db.StatusENUMS.DELETED){
            deleted_todos[key] = todo_db.todos[key];
        }
    });
    res.json(deleted_todos);
});

app.put("/api/todos/complete/:id", function (req, res) {
    todo_db.todos[req.params.id].status = todo_db.StatusENUMS.COMPLETE;
    var  complete_todos = {};
    Object.keys(todo_db.todos).forEach(function (key) {
        if(todo_db.todos[key].status === todo_db.StatusENUMS.COMPLETE){
            complete_todos[key] = todo_db.todos[key];
        }
    });
    res.json(complete_todos);
});

app.put("/api/todos/active/:id", function (req, res) {
    todo_db.todos[req.params.id].status = todo_db.StatusENUMS.ACTIVE;
    var  active_todos = {};
    Object.keys(todo_db.todos).forEach(function (key) {
        if(todo_db.todos[key].status === todo_db.StatusENUMS.ACTIVE){
            active_todos[key] = todo_db.todos[key];
        }
    });
    res.json(active_todos);
});

reload(app);

app.listen(app.get('port'), function () {
    console.log("Server is running on port "+app.get('port'));
});