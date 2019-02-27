import React from "react";
import { connect } from "react-redux";
import {
  selectSubreddit,
  fetchPostsIfNeeded,
  invalidateSubreddit
} from "./actions";

import Picker from "./Picker";
import Posts from "./Posts";

class AsyncApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props;
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = this.props;
      dispatch(fetchPostsIfNeeded(selectedSubreddit));
    }
  }

  handleChange(nextSubreddit) {
    this.props.dispatch(selectSubreddit(nextSubreddit));
    this.props.dispatch(fetchPostsIfNeeded(nextSubreddit));
    console.log(nextSubreddit);
  }

  handleRefresh(e) {
    e.preventDefault();

    const { dispatch, selectedSubreddit } = this.props;
    dispatch(invalidateSubreddit(selectedSubreddit));
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  }

  render() {
    const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props;

    return (
      <div>
        <Picker
          value={selectedSubreddit}
          onChange={this.handleChange}
          options={["reactjs", "frontend"]}
        />
        <p>
          {lastUpdated && (
            <span>
              Last Updated at {new Date(lastUpdated).toLocaleDateString()}.{" "}
            </span>
          )}
          {!isFetching && <button onClick={this.handleRefresh}>Refresh</button>}
        </p>
        {isFetching && posts.length === 0 && <h2>Loading..</h2>}
        {!isFetching && posts.length === 0 && <h2>Empty</h2>}
        {posts.length > 0 && (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectedSubreddit, postsBySubreddit } = state;
  const { isFetching, lastUpdated, items: posts } = postsBySubreddit[
    selectedSubreddit
  ] || {
    isFetching: true,
    items: []
  };

  return {
    selectedSubreddit,
    isFetching,
    lastUpdated,
    posts
  };
}

export default connect(mapStateToProps)(AsyncApp);
