var express = require('express');
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

app.get('/', function (req, res) {
    res.redirect('/api/todos');
});

app.get('/api/todos', function (req, res) {
    res.json(todo_db.todos);
});

app.put('/api/todos/:id', function (req, res) {
    var mod_id = req.params.id;
    var todo = todo_db.todos[mod_id];

    if(!todo){
        res.json(400, {
            error: "Error!! Todo with this id does not exist."
        })
    }
    else {
        var todo_title = req.body.title;
        var todo_status = req.body.status;
        if(todo_title && todo_title !=="" && todo_title.trim() !== ""
            && todo_status && (todo_status === "COMPLETE" || todo_status === "DELETED")){
            todo.title = todo_title;
            todo.status = todo_status;
        }
        else {
            res.JSON(400,  {
                error: "Please input valid data"
            })
        }
    }

});

app.post('/api/todos', function (req, res) {
    var todo_title = req.body.title;
    var next_todo_id = todo_db.next_todo_id;
    if(!todo_title || todo_title==="" || todo_title.trim()===""){
        res.json(400, {
            error: "Error!!! Todo Title cannot be empty"
        })
    }
    else {
        todo_db.todos[next_todo_id].title = todo_title;
        todo_db.todos[next_todo_id].status = todo_db.StatusENUMS.ACTIVE;
        todo_db.todos[next_todo_id]++;
        res.json(todo_db.todos);
    }

});

app.delete('/api/todos/:id', function (req, res) {
    var del_id = req.params.id;
    var todo = todo_db.todos[del_id];

    if(!todo){
        res.json(400, {
            error: "Error!! Todo with this id does not exist."
        })
    }
    else {
        todo.status = todo_db.StatusENUMS.DELETED;
        res.json(todo_db.todos);
    }

});









app.get('/api/todos/active', function (req, res) {
    res.send("active");
});

app.get('/api/todos/complete', function (req, res) {
    res.send("complete");
});

app.get('/api/todos/deleted', function (req, res) {
    res.send("delete");
});

reload(app);

app.listen(app.get('port'), function () {
    console.log("Server is running on port "+app.get('port'));
});