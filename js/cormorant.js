/**
 * Copyright reelyActive 2016-2019
 * We believe in an open Internet of Things
 */


let cormorant = (function() {

  // Internal constants
  const STATUS_OK = 200;
  const SIGNATURE_SEPARATOR = '/';

  // Internal variables
  let associations = {};
  let stories = {};

  // Extract the JSON-LD, if present, from the given HTML
  function extractFromHtml(html) {
    let tagIndex = html.search(/(<script\s*?type\s*?=\s*?"application\/ld\+json">)/);
    if(tagIndex < 0) {
      return null;
    }
    let startIndex = html.indexOf('>', tagIndex) + 1;
    let stopIndex = html.indexOf('</script>', startIndex);
    let jsonString = html.substring(startIndex, stopIndex);
    
    return parseAsStory(jsonString);
  }

  // Parse the given stringified JSON as a standardised story
  function parseAsStory(jsonString) {
    let json = null;

    try {
      json = JSON.parse(jsonString);

      // Handle standard reelyActive API response case
      if(json.hasOwnProperty('stories')) {
        let storyId = Object.keys(json.stories)[0];
        let story = json.stories[storyId];
        return story;
      }
    }
    catch(e) { }

    return json;
  }

  // Perform a HTTP GET on the given URL with the given accept headers
  function retrieve(url, acceptHeaders, callback) {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
      if(httpRequest.readyState === XMLHttpRequest.DONE) {
        let contentType = httpRequest.getResponseHeader('Content-Type');
        return callback(httpRequest.status, httpRequest.responseText,
                        contentType);
      }
    };
    httpRequest.open('GET', url);
    httpRequest.setRequestHeader('Accept', acceptHeaders);
    httpRequest.send();
  }

  // Get the associations for the given device identifier
  function retrieveAssociations(serverUrl, deviceId, isStoryToBeRetrieved,
                                callback) {
    let url = serverUrl + '/associations/' + deviceId;
    retrieve(url, 'application/json', function(status, responseText) {
      let deviceAssociations = null;
      if(status === STATUS_OK) {
        let response = JSON.parse(responseText);
        let returnedDeviceId = null;
        if(response.hasOwnProperty('associations')) { // chickadee v1.x
          returnedDeviceId = Object.keys(response.associations)[0];
          deviceAssociations = response.associations[returnedDeviceId];
        }
        else if(response.hasOwnProperty('devices')) { // chickadee v0.x
          returnedDeviceId = Object.keys(response.devices)[0];
          deviceAssociations = response.devices[returnedDeviceId];
        }
        associations[deviceId] = deviceAssociations;
        associations[returnedDeviceId] = deviceAssociations;
      }
      return callback(deviceAssociations);
    });
  }

  // Get the associations for the given device identifier
  function retrieveStory(storyUrl, callback) {
    retrieve(storyUrl, 'application/json, text/plain',
             function(status, responseText, contentType) {
      let isJson = (contentType.indexOf('application/json') === 0);
      let story;
      if(isJson) {
        story = parseAsStory(responseText);
      }
      else {
        story = extractFromHtml(responseText);
      }
      if(story) {
        stories[storyUrl] = story;
      }
      return callback(story);
    });
  }

  // Expose the following functions and variables
  return {
    retrieveAssociations: retrieveAssociations,
    retrieveStory: retrieveStory,
    associations: associations,
    stories: stories
  }

}());
