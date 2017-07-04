/**
 * Created by abhishek on 5/7/17.
 */
console.log("tasklist.js loaded");

function list() {
    gapi.client.tasks.tasklists.get({
        tasklist:'MDIxODc1MzEwNzc4MzMxNDU2MTU6MDow'
    }).then(function (response) {
        console.log(response);
    });
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