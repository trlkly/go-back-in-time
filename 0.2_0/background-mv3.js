chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    'title': 'Go Back in Time',
    'contexts': ['page', 'link'],
    'id': 'cmenu'
  });
  /*chrome.contextMenus.create({
    'title': '...via CoralCDN',
    'contexts': ['page', 'link'],
    'parentId': 'cmenu',
    'onclick': 'coralcdn'
  });*/

  chrome.contextMenus.create({
    'title': '...via Google',
    'contexts': ['page', 'link'],
    'parentId': 'cmenu',
    'id': 'google'
  });

  chrome.contextMenus.create({
    'title': '...via Google (text)',
    'contexts': ['page', 'link'],
    'parentId': 'cmenu',
    'id': 'googletext'
  });

  chrome.contextMenus.create({
    'title': '...via the Internet Archive',
    'contexts': ['page', 'link'],
    'parentId': 'cmenu',
    'id': 'archive'
  });

  chrome.contextMenus.create({
    'title': '...via Yahoo',
    'contexts': ['page'],
    'parentId': 'cmenu',
    'id': 'yahoo'
  });

  chrome.contextMenus.create({
    'title': '...via Bing',
    'contexts': ['page'],
    'parentId': 'cmenu',
    'id': 'bing'
  });

  /*chrome.contextMenus.create({
    'title': '...via GigaBlast',
    'contexts': ['page'],
    'parentId': 'cmenu',
    'id': 'gigablast'
  });*/

  /*chrome.contextMenus.create({
    'title': '...via WebCite',
    'contexts': ['page'],
    'parentId': 'cmenu',
    'id': 'webcitation'
  });*/

});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  get[info.menuItemId](tab);
});

let get = {};
get.coralcdn = (tab) => {
  var createProperties = {
    url: tab.url.substring(0, 8) + tab.url.substring(8).replace(/\//, '.nyud.net/')
  };
  chrome.tabs.create(createProperties);
}
get.google = (tab) => {
  var createProperties = {
    url: 'http://www.google.com/search?q=cache:' + encodeURIComponent(tab.url)
  };
  chrome.tabs.create(createProperties);
}
get.googletext = (tab) => {
  var createProperties = {
    url: 'http://www.google.com/search?strip=1&q=cache:' + encodeURIComponent(tab.url)
  };
  chrome.tabs.create(createProperties);
}
get.archive = (tab) => {
  var createProperties = {
    url: 'http://web.archive.org/web/*/' + tab.url
  };
  chrome.tabs.create(createProperties);
}
get.yahoo = (tab) => {
  var createProperties = {
    url: 'http://search.yahoo.com/search?p=' + encodeURIComponent(tab.url)
  };

  var xhr = new XMLHttpRequest();
  xhr.open('GET',
    'http://api.search.yahoo.com/WebSearchService/V1/' +
    'webSearch?appid=firefox-resurrect&query=' + encodeURIComponent(tab.url) + '&results=1',
    false
  );
  xhr.send(null);

  try {
    var c = xhr.responseXML.getElementsByTagName('Cache');
    createProperties.url = c[0].firstChild.textContent;
    chrome.tabs.create(createProperties);
  } catch (e) {
    createProperties.url = 'http://search.yahoo.com/search?p=' + encodeURIComponent(tab.url);
    chrome.tabs.create(createProperties);
  }
}
get.bing = (tab) => {
  var createProperties = {
    url: 'http://www.bing.com/search?q=url:' + encodeURIComponent(tab.url)
  };
  var xhr = new XMLHttpRequest();
  xhr.open('GET',
    'http://api.search.live.net/xml.aspx' +
    '?AppId=FD382E93B5ABC456C5E34C238A906CAB1E6F9875' +
    '&Query=url:' + encodeURIComponent(tab.url) +
    '&Sources=web&Web.Count=1',
    false
  );
  xhr.send(null);

  try {
    var c = xhr.responseXML.getElementsByTagName('web:CacheUrl');
    createProperties.url = c[0].textContent;
    chrome.tabs.create(createProperties);
  } catch (e) {
    createProperties.url = 'http://www.bing.com/search?q=url:' + encodeURIComponent(tab.url);
    chrome.tabs.create(createProperties);
  }
}
get.gigablast = (tab) => {
  var createProperties = {
    url: 'http://www.gigablast.com/index.php?'
  };

  var url_patt = new RegExp('/:\/\/([^/]+)/', '');

  var apiUrl = [
    'http://feed.gigablast.com/search',
    '?q=url:', encodeURIComponent(tab.url),
    '&site=', (tab.url.match(url_patt)[1]),
    '&n=1&ns=0&raw=9&bq=0&nrt=0'
  ].join('');

  var xhr = new XMLHttpRequest();
  xhr.open('GET', apiUrl, false);
  xhr.send(null);

  try {
    var docId = xhr.responseXML.getElementsByTagName('docId')[0].textContent;
    createProperties.url += 'page=get&ih=1&ibh=1&cas=0&d=' + docId;
    chrome.tabs.create(createProperties);
  } catch (e) {
    createProperties.url += 'q=url:' + encodeURIComponent(tab.url);
    chrome.tabs.create(createProperties);
  }
}
get.webcitation = (tab) => {
  var createProperties = {
    url: 'http://webcitation.org/query.php?url=' + encodeURIComponent(tab.url)
  };
  chrome.tabs.create(createProperties);
}