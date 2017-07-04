// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
//    var apiKey = 'YOUR_API_KEY';

// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
var discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
//    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];

// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
var clientId = '931548741421-vvr91qrj1u8n0hd0brfnflpp0olm0bhd.apps.googleusercontent.com';

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.
var scopes = 'https://www.googleapis.com/auth/tasks.readonly';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        // apiKey: apiKey,
        discoveryDocs: discoveryDocs,
        clientId: clientId,
        scope: scopes
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}
/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
//            makeApiCall();
        listTaskLists();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print task lists.
 */
function listTaskLists() {
    gapi.client.tasks.tasklists.list({
        'maxResults': 10
    }).then(function(response) {
        appendPre('Task Lists:');
        var taskLists = response.result.items;
        if (taskLists && taskLists.length > 0) {
            for (var i = 0; i < taskLists.length; i++) {
                var taskList = taskLists[i];
                appendPre(taskList.title + ' (' + taskList.id + ')');
            }
        } else {
            appendPre('No task lists found.');
        }
    });
}

//    // Load the API and make an API call.  Display the results on the screen.
//    function makeApiCall() {
//        gapi.client.people.people.get({
//            'resourceName': 'people/me',
//            'requestMask.includeField': 'person.names'
//        }).then(function(resp) {
//            var p = document.createElement('p');
//            var name = resp.result.names[0].givenName;
//            p.appendChild(document.createTextNode('Hello, '+name+'!'));
//            document.getElementById('content').appendChild(p);
//        });
//    }
