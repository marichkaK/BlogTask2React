import React, {Component} from 'react';
import './Profile.css';
import './Article.css';
import {getArticles, getArticlesCount} from "../../util/APIUtils";
import {NavLink, withRouter} from "react-router-dom";
import LoadingIndicator from "../../common/LoadingIndicator";

class Profile extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.renderArticles = this.renderArticles.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.canBackPage = this.canBackPage.bind(this);
        this.canNextPage = this.canNextPage.bind(this);
        this.setPerPage = this.setPerPage.bind(this);

        let perPage = 3;

        let startNumber = parseInt(this.props.match.params.startNumber);
        let endNumber = parseInt(this.props.match.params.endNumber);

        if (!endNumber) {
            startNumber = 0;
            endNumber = perPage;
        } else {
            perPage = endNumber - startNumber;
        }

        this.state = {
            articles: null,
            startNumber: startNumber,
            endNumber: endNumber,
            loading: true,
            perPage: perPage
        };

        getArticlesCount()
        .then(response => {
            this.setState({
                articlesTotalCount: response,
                loading: false
            });
        });
    }

    renderArticles(startNumber, endNumber) {
        getArticles(startNumber, endNumber)
        .then(response => {
            let articleRows = [];
            let rowSize = this.state.perPage;

            for (let i = 0; i < response.length; i += rowSize) {
                let articleRow = [];

                for (let j = i; j < response.length && j < (i + rowSize); j++) {
                    articleRow.push(response[j]);
                }
                if (articleRow.length !== 0) {
                    articleRows.push(articleRow);
                }
            }

            const listItems = articleRows.map((articles) => this.renderArticlesRow(articles));
            this.setState({
                articles: (
                    <div>{listItems}</div>
                )
            });
        }).catch(error => {
            this.setState({
                articles: (
                    <h1>No Articles!</h1>
                )
            });
        });
    }

    renderArticlesRow(articles) {
        const row = articles.map((article) => Profile.renderArticle(article));

        return (<div className="row">{row}</div>);
    };

    static renderArticle(article) {
        return (
            <div className="col-lg-4 col-md-6 col-xs-12 blog-item">
                <div className="blog-item-wrapper">
                    <div className="blog-item-img">
                        <a href="single-post.html">
                            <img src="img/blog/01.jpg" className="img-fluid" alt=""></img>
                        </a>
                    </div>
                    <div className="blog-item-text">
                        <h3><a href="single-post.html">{article.name}</a></h3>
                        <p>{article.content}</p>
                        {article.tags.map(tag => <a href="" className="read-more">#{tag.name} </a>)}
                    </div>
                    <div className="author">
                        <span className="name"><i className="lni-user"></i><a href="#">Posted by Admin</a></span>
                        <span className="date float-right"><i className="lni-calendar"></i><a href="#">{article.created}</a></span>
                    </div>
                </div>
            </div>
        );
    };

    componentDidMount() {
        this.renderArticles(this.state.startNumber, this.state.endNumber);
    }

    previousPage() {
        this.setState((state) => {
            if (!this.canBackPage()) {
                return;
            }
            let data = Profile.getPreviousPageData(state);
            this.renderArticles(data.startNumber, data.endNumber);

            return {
                startNumber: data.startNumber,
                endNumber: data.endNumber
            }
        });
    }

    static getPreviousPageData(state) {
        let startNumber = state.startNumber - state.perPage;
        startNumber = startNumber < 0 ? 0 : startNumber;
        let endNumber = state.endNumber - state.perPage;
        if ((startNumber - endNumber) < state.perPage
            && endNumber < state.articlesTotalCount) {
            endNumber = startNumber + state.perPage;
            endNumber = endNumber > state.articlesTotalCount
                ? state.articlesTotalCount : endNumber;
        }

        return {startNumber, endNumber};
    }

    nextPage() {
        this.setState((state) => {
            if (!this.canNextPage()) {
                return;
            }
            let data = Profile.getNextPageData(state);
            this.renderArticles(data.startNumber, data.endNumber);

            return {
                startNumber: data.startNumber,
                endNumber: data.endNumber
            }
        });
    }

    static getNextPageData(state) {
        let startNumber = state.startNumber + state.perPage;
        let endNumber = state.endNumber + state.perPage;
        endNumber = endNumber > state.articlesTotalCount
            ? state.articlesTotalCount : endNumber;

        return {startNumber, endNumber};
    }

    canBackPage() {
        return this.state.startNumber > 0;
    }

    canNextPage() {
        return this.state.endNumber < this.state.articlesTotalCount;
    }

    setPerPage(e) {
        let {value} = e.target;
        this.setState({
            perPage: parseInt(value)
        });
        this.setState((state) => {
            let endNumber = state.startNumber + state.perPage;
            endNumber = endNumber > state.articlesTotalCount
                ? state.articlesTotalCount : endNumber;
            this.renderArticles(state.startNumber, endNumber);

            return {
                endNumber: endNumber
            }
        });
    }

    render() {
        if (this.state.loading) {
            return <LoadingIndicator/>
        }

        let previousPageData = Profile.getPreviousPageData(this.state);
        let nextPageData = Profile.getNextPageData(this.state);
        let backLink = '/profile/' + previousPageData.startNumber + '/' + previousPageData.endNumber;
        let nextLink = '/profile/' + nextPageData.startNumber + '/' + nextPageData.endNumber;

        let backButton = this.canBackPage() ? (<li className="page-item"><NavLink to={backLink} className="page-link" href="javascript:void(0)"
                                                                                  onClick={this.previousPage}>Previous</NavLink></li>) : null;
        let nextButton = this.canNextPage() ? (<li className="page-item"><NavLink to={nextLink} className="page-link" href="javascript:void(0)"
                                                                                  onClick={this.nextPage}>Next</NavLink></li>) : null;

        return (
            <section id="blog">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="blog-text section-header text-center">
                                <div>
                                    <h2 className="section-title">Latest Blog Posts</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <select name="dropdown" defaultValue={this.state.perPage} onChange={this.setPerPage}>
                        <option value="3">3 per page</option>
                        <option value="6">6 per page</option>
                        <option value="9">9 per page</option>
                    </select>

                    {this.state.articles === null ?
                        <div>Loading</div>
                        :
                        <div>{this.state.articles}</div>
                    }
                </div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {backButton}
                        {nextButton}
                    </ul>
                </nav>
            </section>
        );
    }
}

export default withRouter(Profile);
