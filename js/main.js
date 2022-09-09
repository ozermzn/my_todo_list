let missions = [];
if (localStorage.getItem("missions") !== null) {
  missions = JSON.parse(localStorage.getItem("missions"));
}
const taskInput = document.querySelector("#taskInput");
const btnClear = document.querySelector("#btn-delete-all");
const filters = document.querySelectorAll(".filters span");
let isEditTask = false;
let editId;

displayTasks("all");

function displayTasks(filter) {
  let ul = document.querySelector(".list-group");
  ul.innerHTML = "";
  if (missions.length == 0) {
    ul.innerHTML = "<p class='p-empty'> What we will do ? </p>";
  } else {
    for (let mission of missions) {
      let completed = mission.situation == "completed" ? "checked" : "";
      if (filter == mission.situation || filter == "all") {
        let li = `
	  <li  class="task list-group-item">
		<div class="form-check">
		  <input type="checkbox" onclick="updateStatus(this)" class="form-check-input" id="${mission.id}"  ${completed} >
		  <label for="${mission.id}" 
		  id="${mission.id}" 
		  class="form-check-label ${completed}" > ${mission.missionName}</label>
		</div>
		<div class="dropdown dropend">
  <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
  <i class="fa-solid fa-ellipsis"></i>
  </button>
  <ul class="dropdown-menu">
    <li><a onclick="deleteTask(${mission.id})" class="dropdown-item del" href="#"><i class="fa-solid fa-trash"></i> Delete</a></li>
    <li><a onclick='editTask(${mission.id}, "${mission.missionName}")' class="dropdown-item fix" href="#"><i class="fa-solid fa-pen"></i> Edit</a></li>
  </ul>
</div>
	  </li>
	  `;

        ul.insertAdjacentHTML("beforeend", li);
      }
    }
  }
}

document.querySelector("#btn-add").addEventListener("click", newTask);
document.querySelector("#btn-add").addEventListener("keypress", enter);

for (let span of filters) {
  span.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    displayTasks(span.id);
    console.log(span.id);
  });
}
//veriyi ekleme (ekleme yaparken boolean değeri if'ten sonra false'a çevirmeyi unutma)
function newTask(_event) {
  if (taskInput.value == "") {
    alert("Please enter a task!");
  } else {
    if (!isEditTask) {
      missions.push({
        id: missions.length + 1,
        missionName: taskInput.value,
        situation: "pending",
      });
    } else {
      for (let mission of missions) {
        if (mission.id == editId) {
          mission.missionName = taskInput.value;
        }
        isEditTask = false;
      }
    }
    taskInput.value = "";
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("missions", JSON.stringify(missions));
  }
  _event.preventDefault();
}

//düzenleme (ekleme kısmından onclick fonksiyonu ile veri alırken tek tırnak ( ' ) eklemeyi unutma.)
function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

//delete
function deleteTask(id) {
  let deletedId;
  for (let index in missions) {
    if (missions[index].id == id) {
      deletedId = index;
    }
  }

  missions.splice(deletedId, 1);
  displayTasks(document.querySelector("span.active").id);
  localStorage.setItem("missions", JSON.stringify(missions));
}

//all delete
btnClear.addEventListener("click", function () {
  missions.splice(0, missions.length);
  localStorage.setItem("missions", JSON.stringify(missions));
  displayTasks();
});

function updateStatus(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let situation;

  if (selectedTask.checked) {
    label.classList.add("checked");
    situation = "completed";
  } else {
    label.classList.remove("checked");
    situation = "pending";
  }

  for (let mission of missions) {
    if (mission.id == selectedTask.id) {
      mission.situation = situation;
    }
  }
  localStorage.setItem("missions", JSON.stringify(missions));
  displayTasks(document.querySelector("span.active").id);
}

//Enter ile eleman eklemek (onkeypress)
function enter(event) {
  if (event.which == 13) {
    document.getElementById("btn-add").click();
  }
}
