import React, {Component} from 'react';
import './Profile.css';
import './Article.css';
import {withRouter} from "react-router-dom";
import {Articles} from "./Articles";
import queryString from "query-string";

class Profile extends Component {
    constructor(props) {
        super(props);
        console.log(props);

        let pageNumber = parseInt(this.props.match.params.pageNumber);
        let perPage = parseInt(this.props.match.params.perPage);
        let requestParams = queryString.parse(this.props.location.search);

        if (!perPage) {
            pageNumber = 0;
            perPage = 3;
        }

        this.state = {
            requestParams: requestParams,
            pageNumber: pageNumber,
            perPage: perPage
        };
    }

    render() {
        return (
            <Articles props={this.props}
                      selectedTag={this.state.requestParams.tag ? this.state.requestParams.tag : 'none'}
                      pageNumber={this.state.pageNumber}
                      perPage={this.state.perPage} />
        );
    }
}

export default withRouter(Profile);
