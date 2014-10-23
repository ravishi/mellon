/** @jsx React.DOM */
var React = require('react');
var gwend = require('gwend');
var Search = require('./Search');

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
      var url = 'file:///' + item.docset.info.path + '/Contents/Resources/Documents/' + item.path + '#' + item.anchor;
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
    var registry = new gwend.DocsetRegistry();

    registry.scanFolder('/home/dirley/.local/share/mellon/docsets');

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
    this.state.registry.queryEach(query, this.handleResult, function () {
      console.log('done?');
    });
  },
  handleItemSelected: function(url) {
    console.log(url);
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
