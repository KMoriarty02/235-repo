/* Here is how the user gets gifs

1 - User clicks button, button invokes handler
2 - Handler read form data from the page and build query string (function call)
2.5 - Send the request
3 - Listen to response, parse it
4 - Show pictures  render results

*/

// Register to listen for mouseclick after everything is loaded on the page
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
let displayTerm = "";
let searchTerm = "";
let cleanTerm = "";

function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    
   // Read the data from the user:
   // Search term
   // ALSO: Some parameters:
   //   Limit
   //   rating?

   // Building the URL
   const API_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7"; // This should be done in env
   // let api_key = os.environ(apistuff)
   const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
   let LIMIT = document.querySelector("#limit").value;
   let url = GIPHY_URL;
   
   // Get the search term
   // Find the HTML element that the user type into
   searchTerm = (document.querySelector("#searchterm")).value;
   console.log("zzz SearchTermsearchTerm = " + searchTerm);

   // Sanatize the search term
    searchTerm = searchTerm.trim();
    cleanTerm = searchTerm;
    console.log("zzz Trimmed = " + searchTerm);
    searchTerm = encodeURIComponent(searchTerm);
    // Is there a string left?
    if (searchTerm.length < 1) {
        return; // early out
    }

    // Now pretty sure we have a string 
    // Put the search parameter into the URL
    url += "q=" + searchTerm;

    // Put the API key into the URL
    url += "&api_key=" + API_KEY;

    // Put in the limit
    url += "&limit=" + LIMIT;

    console.log("zzz URL = " + url);

    // Send the request 
    request(url);
}

function request(url) {
    // Build and XHR object 
    // Attach a listener for the response 
    // (optionally attach a error handle)
    // Send it
    // Listener is fired
    // Parse the response

    // XHR Object
    let req = new XMLHttpRequest();

    // Attach listeners
    req.onload = (res) => {
        // Build an object literal from the response
        let results = {};

        console.log("*** Server responded ***");
        console.log(res.target.responseText);

        // Turn the data into a parsable js object
        results = JSON.parse(res.target.responseText);
        console.log(results);

        //console.log("zzz obj.data[0].images.fixed_width_downsampled.url: " + obj.data[0].images.fixed_width_downsampled.url);
        //console.log("*** it said: URL = ***");
        //let url = obj.data[0].images.fixed_width_downsampled.url; 

        if (!results.data || results.data.length === 0) {
            document.querySelector("#status").innerHTML = "<b>No results found for '" + cleanTerm + "'</b>";
            return; // Bail out
        }

         // Start building an HTML string we will display to the user
        let bigString = "";
        console.log(bigString);
        // Loop through the array of results 
        for (let i=0; i < results.data.length; i++) {
            let result = results.data[i];
            let rating = (result.rating ? result.rating : "NA").toUpperCase();

            // Get the URL to the GIF
            let smallUrl = result.images.fixed_width_downsampled.url; 
            if (!smallUrl) { smallUrl = "images/no-image-found.png" };

            // Get the URL to the GIPHY page
            let url = result.url;

            // Build a <div> to hold each result
            let line = `<div class='result'><img src='${smallUrl}' title='${result.id}'/>`;
            line += `<span><a target='_blank' href='${url}'>View on Giphy</a>`;
            line += `<p>Rating: ${rating}</p></span></div>`

            // Add the <div> to 'bigString' and loop
            bigString += line;

            // All done bulding the HTML - show it to the user
            document.querySelector("#content").innerHTML = bigString;

            // Update the status
            document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.data.length + " results for '" + cleanTerm + "'</i></p>";
        }
    };
    req.onerror = gotError;

    // Send the request
    req.open("GET", url);
    req.send();
}

function gotError(err) {
    console.log("ERROR: " + err);
}