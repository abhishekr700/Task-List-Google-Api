/**
 * Created by abhishek on 5/7/17.
 */
var AccessToken,UserName,listId;

console.log("tasklist.js loaded");
$(function () {

});
function findDefaultList() {
    gapi.client.tasks.tasklists.list().then(function (response) {
        console.log(response);
        console.log(response.result.items);
        listId = response.result.items[0].id;
        console.log(listId);
    });
}

function showList(listid) {

}

function changeSignInState(IsSignedIn){
    console.log("changeSignInState called");
    if(IsSignedIn){
        UserName = gapi.auth2.getAuthInstance().currentUser.get().w3.ig;
        AccessToken = gapi.auth2.getAuthInstance().$K.Q7.access_token;
        setUserName();
        findDefaultList();
    }
    else {
        updateUserNameOnSignOut();
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
    console.log(gapi.auth2.getAuthInstance().currentUser.get().Zi.access_token);
    // console.log(GoogleUser.getAuthResponse);
    console.log(gapi.auth2.getAuthInstance());//returns GoogleAuth object
    console.log(gapi.auth2.getAuthInstance().currentUser.get());  //returns a GoogleUser object
    console.log(gapi.auth2.getAuthInstance().currentUser.get().getGrantedScopes());
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
    $("#user-name").html(`<span class="text-white">You are logged in as </span><br><i class='fa fa-user text-white' aria-hidden='true'>&nbsp</i>
<span class="text-success">${UserName}</span>`);
}
/*Updates the field where logged in user is set by above function */
function updateUserNameOnSignOut() {
    $("#user-name").html(`You are not logged in !`);
}
// https://content.googleapis.com/tasks/v1/lists/MDIxODc1MzEwNzc4MzMxNDU2MTU6MDow/tasks
// https://content.googleapis.com/tasks/v1/lists/MDIxODc1MzEwNzc4MzMxNDU2MTU6MDow/tasks
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