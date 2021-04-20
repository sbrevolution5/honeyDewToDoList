class Task {
    constructor(name, dueDate){
        this.name=name,
        this.dueDate= dueDate,
        this.createDate = new Date(`${formData[2].value} 00:00`),
        this.done = false,
        this.id = Math.random()*100 //Need unique ids for each task.  TODO: fix
    }
}
//Setup page
//create new
function addNewTask(){
    let taskList = getLocalStorage();
    let taskName = document.getElementById("taskName").value
    let taskDate = document.getElementById("taskDate").value
    let task = new Task(taskName, taskDate)
    taskList.push(task)
    setLocalStorage(taskList)
    displayTasks()
}
//edit title/date
function editTask(id) {
    let taskList = getLocalStorage()
    displayTasks()
}
//delete task
function deleteTask(id) {
    let taskList = getLocalStorage()
    //finds which object has the id
    let task = taskList.find(t=> t.id == id);
    //finds index of that object
    let index = taskList.indexOf(task)
    taskList.splice(index, 1)// removes task found

    displayTasks()
}
//mark task complete (or not complete?)
function taskComplete(id) {
    let taskList = getLocalStorage()
    let task = taskList.find(t=> t.id == id); //returns entire object not index
    task.complete = true
    setLocalStorage(taskList)
    displayTasks()
}
//filter tasks by complete or not(?)
//displayTasks TODO:
function displayTasks(){
    let taskList = getLocalStorage()

}
// ----------------UTILITY FUNCTIONS -----------------------
function setLocalStorage(data){
    localStorage.setItem("honeyDewData", JSON.stringify(data))
}
function getLocalStorage(){
    return JSON.parse(localStorage.getItem("honeyDewData"))
}