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
    //sets date input to today's date
    $('#editModal').modal({
        show: false
    })
    displayTasks();
}
//create new
function addNewTask() {
    let loc = getLocalStorage()
    let taskList = loc.list;
    let filter = loc.filterName;
    let taskName = document.getElementById("taskName").value
    let taskDate = document.getElementById("taskDate").value
    if(taskName == ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Your task has no name!' 
        })
        return
    } else if (taskDate == ''){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Date is Invalid!'
        })
        return
    }
    let task = new Task(taskName, taskDate)
    taskList.push(task)
    setLocalStorage(loc)
    displayTasks()

}
//edit title/date
function taskEdit(node) {
    let id = getIdFromParentOfNode(node)

    let loc = getLocalStorage()
    let taskList = loc.list;
    let filter = loc.filterName;
    let task = taskList.find(t => t.id == id);
    //TODO: trigger modal, with values set to the task
    $('#editModal').modal('show');
    document.getElementById("editName").value = task.name
    //used to set the date to whatever is being edited
    document.getElementById("editDate").value = task.dueDate.substring(0, 10)
    //sets the button's data-id to the task id, 
    document.getElementById("saveEditBtn").setAttribute("data-id", task.id)
    setLocalStorage(loc)
    displayTasks()
}

function taskEditSave(node) {
    let id = node.getAttribute("data-id")
    let loc = getLocalStorage()
    let taskList = loc.list;
    let filter = loc.filterName;
    let task = taskList.find(t => t.id == id);
    task.name = document.getElementById("editName").value
    task.dueDate = document.getElementById("editDate").value
    setLocalStorage(loc)
    displayTasks();
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
                'Your task has been deleted.',
                'success'
            )
            let id = getIdFromParentOfNode(node)
            let loc = getLocalStorage()
            let taskList = loc.list;
            let filter = loc.filterName;
            //finds which object has the id
            let task = taskList.find(t => t.id == id);
            //finds index of that object
            let index = taskList.indexOf(task)
            taskList.splice(index, 1) // removes task found
            setLocalStorage(loc)
            displayTasks()
        }
    })
}
//mark task complete (or not complete?)
function taskComplete(node) {
    let id = getIdFromParentOfNode(node)
    let loc = getLocalStorage()
    let taskList = loc.list;
    let filter = loc.filterName;
    let task = taskList.find(t => t.id == id); //returns entire object not index
    task.complete = true
    setLocalStorage(loc)
    displayTasks()
}

function clearAllTasks() {
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
            setLocalStorage(null)
            //clears local storage, then resets with filter
            defaultLocalStorage()
            displayTasks()
            Swal.fire(
                'Deleted!',
                'All tasks Deleted!',
                'success'
            )
        }
    })
}
//filter tasks by complete or not(?)
function filter(node){
    let loc = getLocalStorage()
    loc.filterName = node.getAttribute("data-filter")
    setLocalStorage(loc)
    displayTasks()
}
// -----------------DISPLAY------------------
//displayTasks
function displayTasks() {
    let loc = getLocalStorage()
    let taskList = loc.list;
    let filter = loc.filterName;
    document.getElementById("filterHeader").innerText = `Current Filter: ${filter}`
    let template = document.getElementById("displayTemplate")
    let tableBody = document.getElementById("taskBody");
    tableBody.innerHTML = ""
    //uses filter to alter data
    if(filter =="complete"){
        taskList = taskList.filter(t=>t.complete)
    }else if (filter == "incomplete"){
        taskList = taskList.filter(t=>!t.complete)
    }
    for (let i = 0; i < taskList.length; i++) {
        let row = document.importNode(template.content, true)
        if (taskList[i].complete) {
            row.getElementById("rowTemp").setAttribute("class", "complete")
        } else { //If not complete, so user can toggle
            row.getElementById("rowTemp").setAttribute("class", "")
            //highlights incomplete tasks that are overdue
            if (new Date(taskList[i].dueDate) < Date.now()) {
                //keeps any current classes on the row
                // let tempClass = row.getElementById("rowTemp").getAttribute("class")
                row.getElementById("rowTemp").setAttribute("class", "bg-warning")
            }
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
    res += mydate.getMonth() + 1
    res += "/"
    res += mydate.getDate()
    res += "/"
    res += mydate.getFullYear()
    return res
}
// ----------------UTILITY FUNCTIONS -----------------------
function getIdFromParentOfNode(node) {
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
        let defObj = {
            list: new Array(),
            filterName: "all"
        }
        setLocalStorage(defObj)
    }
}

function setLocalStorage(data) {
    localStorage.setItem("honeyDewData", JSON.stringify(data))
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem("honeyDewData"))
}