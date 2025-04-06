$(document).ready(function () {
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    function getActiveFilter() {
        return $("#filter-icons i.active").attr("id") || "all";
    }

    function renderTasks(filter = "all") {
        const $ul = $("#taskListUI").empty();
        const filtered = taskList.filter(task => {
            if (filter === "completed") return task.completed;
            if (filter === "pending") return !task.completed;
            return true;
        });

        $("#listarea").html(filtered.length === 0 ? "OOPS! your list is empty :(" : "");

        filtered.forEach((task, index) => {
            const li = $(`
                <li class="task-item animate__animated animate__fadeIn">
                    <div class="task-left">
                        <input type="checkbox" class="task-check form-check-input" data-index="${index}" ${task.completed ? "checked" : ""}>
                        <span class="task-text ${task.completed ? 'completed-task' : ''}">${task.text}</span>
                    </div>
                    <i class="fa-solid fa-trash task-delete text-danger fs-5" data-index="${index}" title="Delete"></i>
                </li>
            `);
            $ul.append(li);
        });

        $("#taskInput").focus();
    }

    function showToast(message) {
        $("#toast-msg").text(message);
        const toastElement = document.getElementById("liveToast");
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }

    function addTask() {
        const inputVal = $("#taskInput").val().trim();
        if (!inputVal) return showToast("❌ Enter a valid task");

        taskList.push({ text: inputVal, completed: false });
        saveTasks();
        $("#taskInput").val("").focus();
        renderTasks(getActiveFilter());

        showToast(`✅ Task Added: "${inputVal}"`);
    }

    $("#add").on("click", addTask);

    $("#taskInput").on("keydown", function (e) {
        if (e.key === "Enter") addTask();
    });

    $("#filter-icons i").on("click", function () {
        $("#filter-icons i").removeClass("active");
        $(this).addClass("active");
        renderTasks($(this).attr("id"));
    });

    $("#taskListUI").on("change", ".task-check", function () {
        const index = $(this).data("index");
        taskList[index].completed = this.checked;
        saveTasks();
        renderTasks(getActiveFilter());
    });

    $("#taskListUI").on("click", ".task-delete", function () {
        const index = $(this).data("index");
        const deletedTask = taskList[index].text;
        taskList.splice(index, 1);
        saveTasks();
        renderTasks(getActiveFilter());

        showToast(`🗑️ Task Deleted: "${deletedTask}"`);
    });

    renderTasks();
});
