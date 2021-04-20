class Task {
    constructor(name, dueDate){
        this.name=name,
        this.dueDate= dueDate,
        this.createDate = new Date(),
        this.done = false,
        this.id = Math.random()*100 //Need unique ids for each task.  TODO: fix
    }
}
//Setup page
//load task list
//create new
//edit title/date
//delete task
//mark task complete (or not complete?)
//filter tasks by complete or not(?)