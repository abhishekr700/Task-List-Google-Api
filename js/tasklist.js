/**
 * Created by abhishek on 5/7/17.
 */
var AccessToken,UserName,listId,picUrl;
$(function () {
    $("#add-task-button").click(newTask);
    $("#clear-completed-button").click(clearCompleted);
});

/*Retrieved the list of TaskLists and selects first one by default (beta).Then
calls showlist() to display the selected lis's contents.
 */
function findDefaultList() {
    console.log("finddefault called");
    $.get(`https://www.googleapis.com/tasks/v1/users/@me/lists`,{access_token: AccessToken}, function (data,status) {
        // console.log(status,data);
        listId = data.items[0].id;
        console.log(listId);
        showList(listId);
    });
}

/*Displays the contents of the list whose id is supplied to it
as a function argument. Also adds event listeners to the buttons.
 */
function showList(listid) {
    console.log("showlist called with " + listid);
      gapi.client.tasks.tasks.list({
          tasklist: listid
      }).then(function (response) {
          var taskarr = response.result.items;
          $("#task-list").html("");
          if(taskarr == undefined)
              throw "a"
          $("#task-list").html("");
          for(var i=0;i<taskarr.length;i++){

              var ligroup =`<li class="list-group-item" id="${taskarr[i].id}">
            <div class="container">
                <div class="row d-flex align-items-center">
                    <div class="col-1">`;

                if(taskarr[i].status == "needsAction"){
                    ligroup+=`<input type="checkbox">`;
                }
                else{
                    ligroup+=`<input type="checkbox" checked>`;
                }

              ligroup+=`</div>
                    <div class="col-4">
                        <span>${taskarr[i].title}</span>
                    </div>
                    <div class="col-2 nopadding">
                        <span class="updateText">Last Updated on <b>${taskarr[i].updated.substr(0,10)}</b><br> at <b>${taskarr[i].updated.substr(11,8)}</b> (UTC)</span>
                    </div>`
              if(taskarr[i].completed) {
                  ligroup += `<div class="col-2 nopadding  complete-field">
                        <span class="updateText">Completed:<b>${taskarr[i].completed.substr(0,10)}</b><br> at <b>${taskarr[i].completed.substr(11,8)}</b> (UTC)</span>
                    </div>`
              }
              else{
                    ligroup+= `<div class="col-2 nopadding complete-field">
                        <span class="updateText">Completed:<i>Yet To Complete</i></span>
                    </div>`
              }
              ligroup+= `<div class="col-1  text-center custom-button-div">
                        <button class="btn btn-outline-primary fullwidth custom-button" data-direction="up">
                            <i class="fa fa-arrow-up" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="col-1 text-center custom-button-div">
                        <button class="btn btn-outline-primary fullwidth custom-button" data-direction="down">
                            <i class="fa fa-arrow-down" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="col-1 text-center custom-button-div">
                        <button class="btn btn-outline-danger fullwidth custom-button">
                            <i class="fa fa-remove" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        </li>`;
              $("#task-list").append(ligroup);
          }
          disableButtons();
          $("#task-list button[class='btn btn-outline-danger fullwidth custom-button']").click(taskDeleter);
          $("#task-list button[data-direction='down']").click(moveDown);
          $("#task-list button[data-direction='up']").click(moveUp);
          $("input[type='checkbox']").change(changeTaskState);
      });
}

/*Change a Task's current status on clicking the
checkbox.This function is called when the event listener for the checkbox
fires
 */
function changeTaskState(ev) {
    var TaskId = ev.target.parentNode.parentNode.parentNode.parentNode.id;
    if(ev.target.checked == false){
        var req = {
            "status":"needsAction",
            "completed": null
        };
    }
    else{
        var req = {
            "status":"completed"
        };
    }
    console.log(req,TaskId);
    gapi.client.tasks.tasks.patch({
        tasklist: listId,
        task: TaskId,
        resource: req
    }).then(function (response) {
        console.log(response);
        showList(listId);
    })
}

/*To move a task up in order */
function moveUp(ev) {
    var tId = ev.currentTarget.parentNode.parentNode.parentNode.parentNode.id;
    var prevNode = ev.currentTarget.parentNode.parentNode.parentNode.parentNode.previousSibling.previousSibling;
    console.log("moveUp called",tId,prevNode);
    if(prevNode == null){
        var reqBody = {
            tasklist: listId,
            task: tId
        };
    }
    else{
        var reqBody = {
            tasklist: listId,
            task: tId,
            previous: prevNode.id
        };
    }

    gapi.client.tasks.tasks.move(reqBody).then(function (response) {
        console.log(response);
        showList(listId);
    });
}

/*To move a task down in order */
function moveDown(ev) {
    // console.log(ev.currentTarget.parentNode.parentNode.parentNode.parentNode);
    var tId = ev.currentTarget.parentNode.parentNode.parentNode.parentNode.id;
    // console.log(ev.currentTarget.parentNode.parentNode.parentNode.parentNode.previousSibling);
    var nxtId = ev.currentTarget.parentNode.parentNode.parentNode.parentNode.nextSibling.id;
    console.log("moveDown called",tId,nxtId);
    var reqBody = {
        tasklist: listId,
        task: tId,
        previous: nxtId
    };
    gapi.client.tasks.tasks.move(reqBody).then(function (response) {
        console.log(response);
        showList(listId);
    });
}

/*Disables the topmost move up and downmost move down button*/
function disableButtons() {
    $("li").last()[0].children[0].children[0].children[5].children[0].setAttribute('disabled', "");
    $("li").first()[0].children[0].children[0].children[4].children[0].setAttribute('disabled', "");
}

/* Update the list by removing tasks marked
as completed
 */
function clearCompleted() {
    gapi.client.tasks.tasks.clear({
        tasklist: listId
    }).then(function (response) {
        console.log(response);
       showList(listId);
    });
}

/*Creates a new task on clicking the add-task button. Task text is retrieved from input field.
Thereafter, input field is reset.
 */
function newTask() {
    console.log("newtask called with ");
    var title = $("#task-input").val();
    $("#task-input").val("");
    var reqBody = {
        "title": title
    };
    gapi.client.tasks.tasks.insert({
        tasklist: listId,
        resource: reqBody
    }).then(function (resource) {
        console.log(resource);
        showList(listId);
    })
}

/*Function called when the event listener is called for the delete button besides
each list
 */
function taskDeleter(ev) {
    // ev.target.parentNode.parentNode.parentNode.parentNode;
    console.log(ev.currentTarget.parentNode.parentNode.parentNode.parentNode.id);
    var TaskId = ev.currentTarget.parentNode.parentNode.parentNode.parentNode.id;
    gapi.client.tasks.tasks.delete({
        task: TaskId,
        tasklist: listId
    }).then(function (response) {
        console.log(response);
        if(response.body == "")
            showList(listId);
    })
    // console.log(ev.currentTarget.parentNode);
}

/*Clears the list when SignOut button is pressed */
function clrListOnSignOut() {
    $("#task-list").html("");
}

/*Stuff to do on SignIn & SignOut */
function changeSignInState(IsSignedIn){
    console.log("changeSignInState called");
    if(IsSignedIn){
        UserName = gapi.auth2.getAuthInstance().currentUser.get().w3.ig;
        AccessToken = gapi.auth2.getAuthInstance().$K.Q7.access_token;
        picUrl = gapi.auth2.getAuthInstance().currentUser.get().w3.Paa;
        setUserName();
        findDefaultList();
    }
    else {
        updateUserNameOnSignOut();
        clrListOnSignOut();
    }
}

function list() {
    // gapi.client.tasks.tasklists.get({
    //     tasklist:'MDIxODc1MzEwNzc4MzMxNDU2MTU6MDow'
    // }).then(function (response) {
    //     console.log(response);
    // });
    // console.log(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token);
    console.log(gapi.auth2.getAuthInstance().$K.Q7.access_token); //returns access token
    // console.log(gapi.auth2.getAuthInstance().currentUser.get().Zi.access_token);
    // console.log(GoogleUser.getAuthResponse);
    // console.log(gapi.auth2.getAuthInstance());//returns GoogleAuth object
    console.log(gapi.auth2.getAuthInstance().currentUser.get());  //returns a GoogleUser object
    // console.log(gapi.auth2.getAuthInstance().currentUser.get().getGrantedScopes());
}

function getAllTasks() {
    gapi.client.tasks.tasks.list({
        tasklist: 'MDIxODc1MzEwNzc4MzMxNDU2MTU6MDow'
    }).then(function (response) {
        console.log(response);
        var arr = response.result.items;
        console.log(arr);
        for(var j=0;j<arr.length;j++){
            console.log(arr[j].title);
        }
    })
}

/*Sets User's Name on top of list by fetching
data from the API
 */
function setUserName() {
    console.log("Setusername called");
    $("#user-name").html(`<img src=${picUrl} class="img-fluid rounded float-left profile-pic"><span class="text-white">You are logged in as:</span>
<br><i class='fa fa-user text-white' aria-hidden='true'>&nbsp</i>
<span class="text-success">${UserName}
</span>`);
}

/*Updates the field where logged in user is set by above function */
function updateUserNameOnSignOut() {
    $("#user-name").html(`You are not logged in !`);
}

function getAllTasksJquery() {
    $.get("https://www.googleapis.com/tasks/v1/lists/MDIxODc1MzEwNzc4MzMxNDU2MTU6MDow/tasks",{access_token: "ya29.Glx-BNa1vMt2xO-w4GFThpHl_d-KjwJyTt9QgN7vyYrDZplXe3PdyubnEIumKznOxOirq81ruZB5MZlhAJBV3N6dl_DIC6mLOowd3HpKCK7qO-cDkxdsKxoWZLFtLQ"},function (data,status) {
        console.log(data,status);
        var arr = data.items;
        console.log(arr);
        for(var j=0;j<arr.length;j++) {
            console.log(arr[j].title);
        }
    });

}