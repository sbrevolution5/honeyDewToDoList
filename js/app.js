class Task {
    constructor(name, dueDate) {
        this.name = name,
            this.dueDate = new Date(`${dueDate} 00:00`),
            this.createdDate = new Date(), //`${dueDate.value} 00:00`
            this.done = false,
            this.id = Date.now()
    }
}
//Setup page
function pageLoad() {
    defaultLocalStorage()
    displayTasks();
}
//create new
function addNewTask() {
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
    let task = taskList.find(t => t.id == id);
    //trigger modal, with values set to the task
    task.taskName = document.getElementById("taskName").value
    task.taskDate = document.getElementById("taskDate").value

    displayTasks()
}
//delete task
function deleteTask(id) {
    let taskList = getLocalStorage()
    //finds which object has the id
    let task = taskList.find(t => t.id == id);
    //finds index of that object
    let index = taskList.indexOf(task)
    taskList.splice(index, 1) // removes task found

    displayTasks()
}
//mark task complete (or not complete?)
function taskComplete(id) {
    let taskList = getLocalStorage()
    let task = taskList.find(t => t.id == id); //returns entire object not index
    task.complete = true
    setLocalStorage(taskList)
    displayTasks()
}
//filter tasks by complete or not(?)
// -----------------DISPLAY------------------
//displayTasks TODO:
function displayTasks() {
    let taskList = getLocalStorage()
    let template = document.getElementById("displayTemplate")
    let tableBody = document.getElementById("taskBody");
    tableBody.innerHTML = ""
    for (let i = 0; i < taskList.length; i++) {
        let row = document.importNode(template.content, true)
        row.getElementById("displayId").textContent = taskList[i].id
        row.getElementById("displayTaskName").textContent = taskList[i].name
        row.getElementById("displayDateCreated").textContent = displayDate(taskList[i].createdDate)
        row.getElementById("displayDateDue").textContent = displayDate(taskList[i].dueDate)
        row.getElementById("tdCrud").setAttribute("data-id", taskList[i].id)
        tableBody.appendChild(row);
    }

}

function displayDate(dateString) {
    let mydate = new Date(dateString)
    let res = ""
    res += mydate.getMonth()+1
    res += "/"
    res += mydate.getDate()
    res += "/"
    res += mydate.getFullYear()
    return res
}
// ----------------UTILITY FUNCTIONS -----------------------
function defaultLocalStorage() {
    if (getLocalStorage() == null) {
        setLocalStorage(new Array())
    }
}

function setLocalStorage(data) {
    localStorage.setItem("honeyDewData", JSON.stringify(data))
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem("honeyDewData"))
}