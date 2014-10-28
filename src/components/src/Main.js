/** @jsx React.DOM */
var path = require('path');
var crypto = require('crypto');
var React = require('react');
var gwend = require('gwend');
var Search = require('./Search');
var appdirs = require('./appdirs.js');

function resultUrl(r) {
  var url = ('file:///' + r.docset.info.path +
             '/Contents/Resources/Documents/' + r.path);

  if (r.anchor) {
    url += '#' + r.anchor;
  }

  return url;
}

function resultUniqueId(r) {
  var sha1 = crypto.createHash('sha1');
  sha1.update(['docset:/', r.docset.info.name, r.name, r.path, r.anchor].join('/'));
  return sha1.digest('hex');
}

var ResultList = React.createClass({
  getInitialState: function() {
    return {selected: null};
  },
  handleClick: function(e) {
    e.preventDefault();

    // Find the closest target that has a *href* attribute
    var url;
    var target = e.target;
    while (target && !(url = target.getAttribute('href'))) {
      target = target.parentElement;
    }

    // Isn't there an API to get the node's key?
    var uid = target.getAttribute('data-reactid').split('$')[1];

    var selected = {uid: uid, url: url};
    this.setState({selected: selected});
    this.props.onSelectUrl(selected.url);
  },
  render: function() {
    var _this_component = this;

    var createItem = function(item) {
      var label = item.docset.info.name.toLowerCase();

      var className = (
        (_this_component.state.selected &&
         _this_component.state.selected.uid == item.uid)
          ? 'selected' : null);

      return (
        <li>
          <a
            key={item.uid}
            href={item.url}
            className={className}
            onClick={_this_component.handleClick}
            >{label}: {item.name}</a>
        </li>
      );
    };

    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

module.exports = React.createClass({
  getInitialState: function() {
    var datadir = appdirs.userDataDir('mellon');
    var registry = new gwend.DocsetRegistry();

    registry.scanFolder(path.join(datadir, 'docsets'));

    return {
      results: [],
      registry: registry,
      querying: null,
      selected: null
    };
  },
  handleResult: function(err, r) {
    r['url'] = resultUrl(r);
    r['uid'] = resultUniqueId(r);
    var nextResults = this.state.results.concat([r]);
    this.setState({results: nextResults});
  },
  handleSearch: function(query) {
    // clear current results
    this.setState({querying: query, results: []});
    if (query && query.trim().length) {
      this.state.registry.queryEach(query, this.handleResult, function () {
        // TODO stop the *searching animation* we'll soon create
      });
    }
  },
  handleSelectedUrlChanged: function(url) {
    this.setState({selected: url});
  },
  render: function() {
    return (
      <div className="pure-g">
        <div className="left pure-u-6-24">
          <Search onSearchSubmit={this.handleSearch} />
          <ResultList items={this.state.results} selected={this.state.selected} onSelectUrl={this.handleSelectedUrlChanged} />
        </div>
        <div className="pure-u-18-24">
          <iframe nwdisable nwfaketop className="mellon-view" src={this.state.selected}></iframe>
        </div>
      </div>
    );
  }
});
