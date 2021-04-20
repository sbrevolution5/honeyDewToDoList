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
function taskEdit(node) {
    let id = getIdFromParentOfNode(node)
    let taskList = getLocalStorage()
    let task = taskList.find(t => t.id == id);
    //TODO: trigger modal, with values set to the task
    task.taskName = document.getElementById("taskName").value
    task.taskDate = document.getElementById("taskDate").value
    setLocalStorage(taskList)
    displayTasks()
}
function clearAllTasks(){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete ALL tasks!'
    }).then((result) => {
        if (result.isConfirmed) {
            setLocalStorage([])
            displayTasks()
            Swal.fire(
                'Deleted!',
                'All tasks Deleted!',
                'success'
            )
        }
    })
}
//delete task
function taskDelete(node) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
            let id = getIdFromParentOfNode(node)
            let taskList = getLocalStorage()
            //finds which object has the id
            let task = taskList.find(t => t.id == id);
            //finds index of that object
            let index = taskList.indexOf(task)
            taskList.splice(index, 1) // removes task found
            setLocalStorage(taskList)
            displayTasks()
        }
    })
}
//mark task complete (or not complete?)
function taskComplete(node) {
    let id =getIdFromParentOfNode(node)
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
        if(taskList[i].complete){
            row.getElementById("rowTemp").setAttribute("class","complete")
        }else{//If not complete, so user can toggle
            row.getElementById("rowTemp").setAttribute("class","")
        }
        row.getElementById("displayId").textContent = taskList[i].id
        row.getElementById("displayTaskName").textContent = taskList[i].name
        row.getElementById("displayDateCreated").textContent = displayDate(taskList[i].createdDate)
        row.getElementById("displayDateDue").textContent = displayDate(taskList[i].dueDate)
        row.getElementById("displayControls").setAttribute("data-id", taskList[i].id)
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
function getIdFromParentOfNode(node){
    // structure is             <td id="displayControls" data-id="">
    //             <div class="btn-group" role="group" aria-label="">
    //                 <button type="button" class="btn btn-primary">✔️</button>
    //                 <button type="button" class="btn btn-secondary">✏️</button>
    //                 <button type="button" class="btn btn-danger">🗑️</button>
    // id is 2 parents above node
    let id = node.parentNode.parentNode.getAttribute("data-id")
    return id
}
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