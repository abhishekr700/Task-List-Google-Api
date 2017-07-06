/**
 * Created by abhishek on 5/7/17.
 */
var AccessToken,UserName,listId,picUrl;

console.log("tasklist.js loaded");
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
          // console.log("showlist response :",response);
          var taskarr = response.result.items;
          // console.log("Taskarr",taskarr);
          if(taskarr == undefined)
              throw "a"
          $("#task-list").html("");
          for(var i=0;i<taskarr.length;i++){
              // console.log("setalist");
              $("#task-list").append(`<li class="list-group-item" id="${taskarr[i].id}">
            <div class="container">
                <div class="row d-flex align-items-center">
                    <div class="col-1">
                        <input type="checkbox">
                    </div>
                    <div class="col-8">
                        <span class="">${taskarr[i].title}</span>
                    </div>
                    <div class="col-1  text-center custom-button-div">
                        <button class="btn btn-outline-primary fullwidth custom-button">
                            <i class="fa fa-arrow-up" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="col-1 text-center custom-button-div">
                        <button class="btn btn-outline-primary fullwidth custom-button">
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
        </li>`)
          }
          // console.log("forloopend");
          // console.log($("#task-list button[class='btn btn-outline-danger fullwidth custom-button']"));
          $("#task-list button[class='btn btn-outline-danger fullwidth custom-button']").click(taskDeleter);
          // console.log($("#task-list button[class='btn btn-outline-danger fullwidth custom-button']"));



      });
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