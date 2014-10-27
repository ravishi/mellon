/** @jsx React.DOM */
var path = require('path');
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

var ResultList = React.createClass({
  handleClick: function(e) {
    e.preventDefault();

    // Find the closest target that has a *href* attribute
    var url;
    var target = e.target;
    while (target && !(url = target.getAttribute('href'))) {
      target = target.parentElement;
    }

    this.props.onSelectItem(url || null);
  },
  render: function() {
    var _this_component = this;
    var createItem = function(item) {
      var url = resultUrl(item);
      var label = item.docset.info.name.toLowerCase();

      /* FIXME Shouldn't we compare the url with the url of the iframe? */
      var link_class = (_this_component.props.selected == url ? "selected" : null);
      return (
        <li>
          <a href={url} className={link_class}
            onClick={_this_component.handleClick}>{label}: {item.name}</a>
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
  handleItemSelected: function(url) {
    this.setState({selected: url});
  },
  render: function() {
    return (
      <div className="pure-g">
        <div className="left pure-u-6-24">
          <Search onSearchSubmit={this.handleSearch} />
          <ResultList items={this.state.results} selected={this.state.selected} onSelectItem={this.handleItemSelected} />
        </div>
        <div className="pure-u-18-24">
          <iframe nwdisable nwfaketop className="mellon-view" src={this.state.selected}></iframe>
        </div>
      </div>
    );
  }
});
