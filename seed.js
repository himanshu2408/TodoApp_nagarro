var StatusENUMS = {
    ACTIVE: "ACTIVE",
    COMPLETE: "COMPLETE",
    DELETED: "DELETED"
};


var todos = {
    1 : {title: "Learn JS",  status: StatusENUMS.ACTIVE},
    2 : {title: "Git tut",  status: StatusENUMS.ACTIVE},
    3 : {title: "Interactive git",  status: StatusENUMS.ACTIVE}
};

var next_todo_id = 4;

module.exports = {
    StatusENUMS : StatusENUMS,
    todos: todos,
    next_todo_id: next_todo_id
};