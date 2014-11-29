var React = require('react');

module.exports = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onSearchSubmit(this.refs.query.getDOMNode().value.trim());
  },
  render: function() {
    return (
      <div className="search">
        <form accept-charset="UTF-8" onSubmit={this.handleSubmit}>
          <input ref="query" type="text" />
        </form>
      </div>
    );
  }
});
