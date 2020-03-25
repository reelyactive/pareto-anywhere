/**
 * Copyright reelyActive 2016-2020
 * We believe in an open Internet of Things
 */


let cuttlefish = (function() {

  // Internal constants
  const IMG_CLASS = 'card-img-top';
  const HEADER_CLASS = 'card-header';
  const BODY_CLASS = 'card-body';
  const FOOTER_CLASS = 'card-footer lead text-truncate';
  const TITLE_CLASS = 'card-title text-truncate';
  const SUBTITLE_CLASS = 'card-subtitle text-muted text-truncate';
  const STORIES_PANE_SUFFIX = '-stories';
  const DATA_PANE_SUFFIX = '-data';
  const RADDECS_PANE_SUFFIX = '-raddecs';
  const ASSOCIATIONS_PANE_SUFFIX = '-associations';
  const FOOTER_SUFFIX = '-footer';
  const SAME_AS_CLASS = 'btn-group dropup';
  const DEFAULT_TITLE = 'Unknown';
  const DEFAULT_SUBTITLE = '\u2665 structured data';
  const LIST_GROUP_CLASS = 'list-group list-group-flush';
  const LIST_GROUP_ITEM_CLASS = 'list-group-item text-truncate';
  const SIGNATURE_SEPARATOR = '/';

  // Standard data properties (property: {icon, suffix}) in alphabetical order
  const STANDARD_DATA_PROPERTIES = {
      acceleration: { icon: "fas fa-rocket", suffix: "g",
                      transform: "xyzArray" },
      batteryPercentage: { icon: "fas fa-battery-half", suffix: " %",
                           transform: "toFixed(0)" },
      batteryVoltage: { icon: "fas fa-battery-half", suffix: " V",
                        transform: "toFixed(2)" },
      humidityPercentage: { icon: "fas fa-water", suffix: " %",
                            transform: "toFixed(2)" },
      macAddress: { icon: "fas fa-barcode", suffix: "" },
      magneticField: { icon: "fas fa-magnet", suffix: "G",
                       transform: "xyzArray" },
      name: { icon: "fas fa-info", suffix: "" },
      temperature: { icon: "fas fa-thermometer-half", suffix: " \u2103",
                     transform: "toFixed(2)" },
      timestamp: { icon: "fas fa-clock", suffix: "", transform: "timeOfDay" },
      txPower: { icon: "fas fa-broadcast-tower", suffix: " dBm" },
      uptime: { icon: "fas fa-stopwatch", suffix: " ms" },
      url: { icon: "fas fa-link", suffix: "", transform: "hyperlink" },
      visibleLight: { icon: "fas fa-lightbulb", suffix: "" }
  };

  // Render the given story in the given node
  function render(story, node, options) {
    let graph = story["@graph"];
    let element = graph[0];

    removeAllChildren(node);
    renderImage(element, node);
    renderBody(element, node);
    renderFooter(element, node);

    if(options && options.hasOwnProperty('listGroupItems') &&
       Array.isArray(options.listGroupItems)) {
      renderListGroup(options.listGroupItems, node);
    }
  }

  // Render all the given data as tabs in a card
  function renderAsTabs(node, stories, data, associations, raddecs, options) {
    let id = node.getAttribute('id');
    let isExistingRender = (node.getAttribute('selectedTab') !== null);

    if(isExistingRender) {
      let footer = document.querySelector('#' + id + FOOTER_SUFFIX);
      updateFooterTitle(footer, stories, raddecs);
      return updatePanes(node, stories, data, associations, raddecs, options);
    }

    removeAllChildren(node);

    let header = createElement('div', HEADER_CLASS);
    let navs = createElement('ul', 'nav nav-tabs card-header-tabs');
    let body = createElement('div', BODY_CLASS);
    let panes = createElement('div', 'tab-content overflow-auto');
    let footer = createElement('div');
    footer.setAttribute('id', id + FOOTER_SUFFIX);
    updateFooterTitle(footer, stories, raddecs);

    let hasActiveTab = false;
    hasActiveTab |= renderStoryTab(navs, panes, stories, hasActiveTab, id);
    hasActiveTab |= renderDataTab(navs, panes, data, hasActiveTab, id);
    hasActiveTab |= renderAssociationsTab(navs, panes, associations,
                                          hasActiveTab, id);
    hasActiveTab |= renderRaddecTab(navs, panes, raddecs, hasActiveTab, id);

    node.setAttribute('selectedTab', 'none');
    node.appendChild(header);
    header.appendChild(navs);
    node.appendChild(body);
    body.appendChild(panes);
    node.appendChild(footer);
  }

  // Update only the panes of an existing render as tabs
  function updatePanes(node, stories, data, associations, raddecs, options) {
    let id = node.getAttribute('id');
    let selectedTab = node.getAttribute('selectedTab');
    let storyPane = document.querySelector('#' + id + STORIES_PANE_SUFFIX);
    let dataPane = document.querySelector('#' + id + DATA_PANE_SUFFIX);
    let associationsPane = document.querySelector('#' + id +
                                                  ASSOCIATIONS_PANE_SUFFIX);
    let raddecPane = document.querySelector('#' + id + RADDECS_PANE_SUFFIX);

    // TODO: observe selectedTab

    renderStoryTabPaneContent(storyPane, stories);
    renderDataTabPaneContent(dataPane, data);
    renderAssociationsTabPaneContent(associationsPane, associations);
    renderRaddecTabPaneContent(raddecPane, raddecs);
  }

  // Update the footer title with the story name or transmitterId
  function updateFooterTitle(footer, stories, raddecs) {
    let footerTitle = DEFAULT_TITLE;
    let additionalFooterClasses = ' ';

    if(Array.isArray(stories) && stories.length) {
      footerTitle = determineStoryTitle(stories[0]);
    }
    else if(Array.isArray(raddecs) && raddecs.length) {
      footerTitle = raddecs[0].transmitterId + SIGNATURE_SEPARATOR +
                    raddecs[0].transmitterIdType;
      additionalFooterClasses += 'monospace';
    }

    footer.textContent = footerTitle;
    footer.setAttribute('class', FOOTER_CLASS + additionalFooterClasses);
  }

  // Remove all children of the given node
  function removeAllChildren(node) {
    while(node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  // Render the card image
  function renderImage(element, node) {
    let img = createElement('img', IMG_CLASS);
    img.src = determineElementImageUrl(element);
    node.appendChild(img);
  }

  // Render the card body
  function renderBody(element, node) {
    let body = createElement('div', BODY_CLASS);
    node.appendChild(body);

    renderTitle(element, body);
    renderSubtitle(element, body);
  }

  // Render the card footer
  function renderFooter(element, node) {
    let footer = createElement('div', FOOTER_CLASS);
    node.appendChild(footer);

    renderSameAs(element, footer);
  }

  // Render the title (name)
  function renderTitle(element, node) {
    let title = createElement('h5', TITLE_CLASS,
                              determineElementTitle(element));
    node.appendChild(title);
  }

  // Render the subtitle
  function renderSubtitle(element, node) {
    let text = DEFAULT_SUBTITLE;

    if(element.hasOwnProperty("schema:jobTitle") &&
       element.hasOwnProperty("schema:worksFor")) {
      text = toString(element["schema:jobTitle"]) + ' @ ' +
                      toString(element["schema:worksFor"]);
    }
    else if(element.hasOwnProperty("schema:jobTitle")) {
      text = toString(element["schema:jobTitle"]);
    }
    else if(element.hasOwnProperty("schema:worksFor")) {
      text = toString(element["schema:worksFor"]);
    }
    else if(element.hasOwnProperty("schema:brand")) {
      text = toString(element["schema:brand"]);
    }
    else if(element.hasOwnProperty("schema:manufacturer")) {
      text = toString(element["schema:manufacturer"]);
    }
    else if(element.hasOwnProperty("schema:maximumAttendeeCapacity")) {
      text = 'Capacity: ' + element["schema:maximumAttendeeCapacity"];
    }

    let subtitle = createElement('h6', SUBTITLE_CLASS, text);
    node.appendChild(subtitle);
  }

  // Render the sameAs (links)
  function renderSameAs(element, node) {
    let dropup = createElement('div', SAME_AS_CLASS);
    node.appendChild(dropup);

    let button = createElement('button',
                               'btn btn-secondary btn-sm dropdown-toggle');
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'dropdown');
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    dropup.appendChild(button);

    let i = createElement('i', 'fas fa-ellipsis-h');
    button.appendChild(i);

    let sameAsCount = 0;

    if(element.hasOwnProperty("schema:sameAs")) {
      let menu = createElement('div', 'dropdown-menu');
      dropup.appendChild(menu);

      let sameAs = element["schema:sameAs"];
      if(typeof sameAs === 'string') {
        sameAs = [ sameAs ];
      }

      sameAsCount = sameAs.length;

      sameAs.forEach(function(url) {
        renderSameAsMenuItem(url, menu);
      });

    }
    else {
      button.setAttribute('class',
                          'btn btn-dark btn-sm dropdown-toggle disabled');
    }

    let count = document.createTextNode('\u00a0\u00a0' + sameAsCount);
    button.appendChild(count);
  }

  // Render the sameAs menu item (link)
  function renderSameAsMenuItem(url, node) {
    let a = createElement('a', 'dropdown-item');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');

    renderLinkIcon(url, a);

    let space = document.createTextNode('\u00a0\u00a0');
    a.appendChild(space);

    let i = createElement('i', 'fas fa-external-link-alt');
    a.appendChild(i);

    let urlSnippet = document.createTextNode('\u00a0' + url.split('/')[2] +
                                             '/\u2026');
    a.appendChild(urlSnippet);
    
    node.appendChild(a);
  }

  // Render the link icon, if known, based on the given URL
  function renderLinkIcon(url, node) {
    let iClass = 'fas fa-link';

    if(url.includes('github.com')) {
      iClass = 'fab fa-github';
    }
    else if(url.includes('twitter.com')) {
      iClass = 'fab fa-twitter';
    }
    else if(url.includes('linkedin.com')) {
      iClass = 'fab fa-linkedin';
    }
    else if(url.includes('facebook.com')) {
      iClass = 'fab fa-facebook';
    }
    else if(url.includes('instagram.com')) {
      iClass = 'fab fa-instagram';
    }

    let i = createElement('i', iClass);
    node.appendChild(i);
  }

  // Render the list group items
  function renderListGroup(listGroupItems, node) {
    let listGroup = createElement('ul', LIST_GROUP_CLASS);

    listGroupItems.forEach(function(item) {
      let itemClass = LIST_GROUP_ITEM_CLASS;
      if(item.hasOwnProperty('itemClass')) {
        itemClass += ' ' + item.itemClass;
      }
      let listGroupItem = createElement('li', itemClass);

      if(item.hasOwnProperty('iconClass')) {
        let space = document.createTextNode('\u00a0\u00a0');
        let i = createElement('i', item.iconClass);
        listGroupItem.appendChild(i);
        listGroupItem.appendChild(space);
      }
      let text = document.createTextNode(item.text);
      listGroupItem.appendChild(text);
      listGroup.appendChild(listGroupItem);
    });

    node.appendChild(listGroup);
  }

  // Render the story nav tab and tab pane
  function renderStoryTab(navs, panes, stories, hasActiveTab, id) {
    let isEmpty = !(Array.isArray(stories) && stories.length);
    let isActive = !hasActiveTab && !isEmpty;

    let i = createElement('i', 'fas fa-book-open');
    let paneId = id + STORIES_PANE_SUFFIX;
    let nav = createNavTab(i, '#' + paneId, isActive, isEmpty);
    let pane = createNavPane(paneId, isActive);

    renderStoryTabPaneContent(pane, stories);
    navs.appendChild(nav);
    panes.appendChild(pane);

    return isActive;
  }

  // Render the story tab's pane content
  function renderStoryTabPaneContent(pane, stories) {
    let isEmpty = !(Array.isArray(stories) && stories.length);

    removeAllChildren(pane);

    if(!isEmpty) {
      let imageUrl = determineStoryImageUrl(stories[0]);
      let img = createElement('img', 'img-fluid');
      img.setAttribute('src', imageUrl);
      pane.appendChild(img);
      // TODO: additional stories
    }
  }

  // Render the data nav tab and tab pane
  function renderDataTab(navs, panes, data, hasActiveTab, id) {
    let isEmpty = !(Array.isArray(data) && data.length);
    let isActive = !hasActiveTab && !isEmpty;

    let i = createElement('i', 'fas fa-info');
    let paneId = id + DATA_PANE_SUFFIX;
    let nav = createNavTab(i, '#' + paneId, isActive, isEmpty);
    let pane = createNavPane(paneId, isActive);

    renderDataTabPaneContent(pane, data);
    navs.appendChild(nav);
    panes.appendChild(pane);

    return isActive;
  }

  // Render the data tab's pane content
  function renderDataTabPaneContent(pane, data) {
    let isEmpty = !(Array.isArray(data) && data.length);

    removeAllChildren(pane);

    if(!isEmpty) {
      pane.appendChild(createDataTable(data[0])); // TODO: additional data
    }
  }

  // Render the associations nav tab and tab pane
  function renderAssociationsTab(navs, panes, associations, hasActiveTab, id) {
    let isEmpty = !(associations && Object.keys(associations).length);
    let isActive = !hasActiveTab && !isEmpty;

    let i = createElement('i', 'fas fa-list-alt');
    let paneId = id + ASSOCIATIONS_PANE_SUFFIX;
    let nav = createNavTab(i, '#' + paneId, isActive, isEmpty);
    let pane = createNavPane(paneId, isActive);

    renderAssociationsTabPaneContent(pane, associations);
    navs.appendChild(nav);
    panes.appendChild(pane);

    return isActive;
  }

  // Render the association tab's pane content
  function renderAssociationsTabPaneContent(pane, associations) {
    let isEmpty = !(associations && Object.keys(associations).length);

    removeAllChildren(pane);

    if(!isEmpty) {
      pane.appendChild(createAssociationsTable(associations));
    }
  }

  // Render the raddec nav tab and tab pane
  function renderRaddecTab(navs, panes, raddecs, hasActiveTab, id) {
    let isEmpty = !(Array.isArray(raddecs) && raddecs.length);
    let isActive = !hasActiveTab && !isEmpty;

    let i = createElement('i', 'fas fa-wifi');
    let paneId = id + RADDECS_PANE_SUFFIX;
    let nav = createNavTab(i, '#' + paneId, isActive, isEmpty);
    let pane = createNavPane(paneId, isActive);

    renderRaddecTabPaneContent(pane, raddecs);
    navs.appendChild(nav);
    panes.appendChild(pane);

    return isActive;
  }

  // Render the raddec tab's pane content
  function renderRaddecTabPaneContent(pane, raddecs) {
    let isEmpty = !(Array.isArray(raddecs) && raddecs.length);

    removeAllChildren(pane);

    if(!isEmpty) {
      pane.appendChild(createRaddecTable(raddecs[0])); // TODO: additional
    }
  }

  // Create a data table
  function createDataTable(data) {
    let table = createElement('table', 'table table-hover');
    let tbody = createElement('tbody');

    for(property in data) {
      let value = data[property];
      tbody.appendChild(createDataTableRow(property, value));
    }

    table.appendChild(tbody);

    return table;
  }

  // Create an associations table
  function createAssociationsTable(associations) {
    let table = createElement('table', 'table table-hover');
    let tbody = createElement('tbody');
    let url = createElement('a', null, associations.url);
    url.setAttribute('href', associations.url);
    url.setAttribute('_target', 'blank');

    table.appendChild(tbody);
    tbody.appendChild(createTableRow('fas fa-link', null, url));
    tbody.appendChild(createTableRow('fas fa-tags', null, associations.tags));
    tbody.appendChild(createTableRow('fas fa-sitemap', null,
                                     associations.directory));
    tbody.appendChild(createTableRow('fas fa-map-marked-alt', null, 
                                     associations.position));

    return table;
  }

  // Create a raddec table
  function createRaddecTable(raddec) {
    let strongest = raddec.rssiSignature[0] || {};
    let rec = raddec.rssiSignature.length;
    let dec = strongest.numberOfDecodings;
    let pac = raddec.packets.length || '-';
    let timestamp = new Date(raddec.timestamp).toLocaleTimeString();
    let table = createElement('table', 'table table-hover');
    let tbody = createElement('tbody');

    table.appendChild(tbody);
    tbody.appendChild(createTableRow('fas fa-barcode', null,
                                     raddec.transmitterId));
    tbody.appendChild(createTableRow('fas fa-signal', null,
                                     strongest.rssi + ' dBm'));
    tbody.appendChild(createTableRow('fas fa-barcode', null,
                                     strongest.receiverId));
    tbody.appendChild(createTableRow('fas fa-info-circle', null,
                                     rec + ' / ' + dec + ' / ' + pac));
    tbody.appendChild(createTableRow('fas fa-clock', null, timestamp));

    return table;
  }

  // Create a table row
  function createTableRow(headerIconClass, headerText, data) {
    let tr = createElement('tr');
    let th = createElement('th');
    let td = createElement('td', 'monospace', data);

    if(headerIconClass) {
      th.appendChild(createElement('i', headerIconClass));
    }
    if(headerText) {
      th.appendChild(document.createTextNode(headerText));
    }

    tr.appendChild(th);
    tr.appendChild(td);

    return tr;
  }

  // Create a data table row
  function createDataTableRow(property, value) {
    let tr = createElement('tr');
    let th = createElement('th');
    let td = createElement('td', 'monospace');

    if(STANDARD_DATA_PROPERTIES.hasOwnProperty(property)) {
      let dataRender = STANDARD_DATA_PROPERTIES[property];
      let valueElement;

      switch(dataRender.transform) {
        case 'toFixed(0)':
          valueElement = document.createTextNode(value.toFixed(0));
          break;
        case 'toFixed(2)':
          valueElement = document.createTextNode(value.toFixed(2));
          break;
        case 'timeOfDay':
          let timeOfDay = new Date(value).toLocaleTimeString();
          valueElement = document.createTextNode(timeOfDay);
          break;
        case 'hyperlink':
          valueElement = createElement('a', null, value);
          valueElement.setAttribute('href', value);
          valueElement.setAttribute('target', '_blank');
          break;
        case 'xyzArray':
          let magnitude = Math.sqrt((value[0] * value[0]) +
                                    (value[1] * value[1]) +
                                    (value[2] * value[2])).toFixed(2) +
                          dataRender.suffix;
          let axes = createElement('span', 'small text-muted',
                                   value[0].toFixed(2) + dataRender.suffix +
                                   '\u21d2 | ' +  value[1].toFixed(2) +
                                   dataRender.suffix + '\u21d7 | ' + 
                                   value[2].toFixed(2) + dataRender.suffix +
                                   '\u21d1');
          valueElement = createElement('span');
          valueElement.appendChild(document.createTextNode(magnitude));
          valueElement.appendChild(createElement('br'));
          valueElement.appendChild(axes);
          break;
        default:
          valueElement = document.createTextNode(value);
      }

      th.appendChild(createElement('i', dataRender.icon));
      td.appendChild(valueElement);
      if(dataRender.transform !== 'xyzArray') {
        td.appendChild(document.createTextNode(dataRender.suffix));
      }
    }
    else {
      th.textContent = property;
      td.textContent = value;
    }

    tr.appendChild(th);
    tr.appendChild(td);

    return tr;
  }

  // Create a nav tab
  function createNavTab(content, href, isActive, isDisabled) {
    let linkClass = 'nav-link';
    if(isActive) {
      linkClass = 'nav-link active';
    }
    else if(isDisabled) {
      linkClass = 'nav-link disabled';
    }

    let nav = createElement('li', 'nav-item');
    let a = createElement('a', linkClass, content);
    a.setAttribute('data-toggle', 'tab');
    a.setAttribute('href', href);

    nav.appendChild(a);

    return nav;
  }

  // Create a nav pane
  function createNavPane(id, isActive) {
    let paneClass = 'tab-pane fade';
    if(isActive) {
      paneClass = 'tab-pane fade show active';
    }

    let pane = createElement('div', paneClass);
    pane.setAttribute('id', id);

    return pane;
  }

  // Determine the title of the story
  function determineStoryTitle(story) {
    let graph = story["@graph"];
    let element = graph[0];

    return determineElementTitle(element);
  }

  // Determine the title of the element
  function determineElementTitle(element) {
    if(element.hasOwnProperty("schema:name")) {
      return element["schema:name"];
    }
    else if(element.hasOwnProperty("schema:givenName") ||
            element.hasOwnProperty("schema:familyName")) {
      return (element["schema:givenName"] || '') + ' ' +
             (element["schema:familyName"] || '');
    }
    else {
      return DEFAULT_TITLE;
    }
  }

  // Determine the image URL of the story
  function determineStoryImageUrl(story) {
    let graph = story["@graph"];
    let element = graph[0];

    return determineElementImageUrl(element);
  }

  // Determine the image URL of the element
  function determineElementImageUrl(element) {
    if(element.hasOwnProperty("schema:image")) {
      return element["schema:image"];
    }
    else if(element.hasOwnProperty("schema:logo")) {
      return element["schema:logo"];
    }

    return null;
  }

  // Return the given schema.org property as a string, if not already so
  function toString(property) {
    if(typeof property === 'string') {
      return property;
    }
    if(property.hasOwnProperty("name")) {
      return property["name"];
    }
    else if(property.hasOwnProperty("schema:name")) {
      return property["schema:name"];
    }
    return '';
  }

  // Create an HTML element with optional class and content (text or element)
  function createElement(tagName, className, content) {
    let element = document.createElement(tagName);

    if(className) {
      element.setAttribute('class', className);
    }
    if(content) {
      if(content instanceof Element || content instanceof Node) {
        element.appendChild(content);
      }
      else {
        element.textContent = content;
      }
    }

    return element;
  }

  // Expose the following functions and variables
  return {
    render: render,
    renderAsTabs: renderAsTabs,
    determineImageUrl: determineStoryImageUrl,
    determineTitle: determineStoryTitle
  }

}());
