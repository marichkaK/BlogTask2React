import React, {Component} from 'react';
import './Profile.css';
import './Article.css';
import {getArticles} from "../../util/APIUtils";
import {NavLink} from "react-router-dom";
import LoadingIndicator from "../../common/LoadingIndicator";

export class Articles extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.renderArticles = this.renderArticles.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.canBackPage = this.canBackPage.bind(this);
        this.canNextPage = this.canNextPage.bind(this);
        this.setPerPage = this.setPerPage.bind(this);

        this.state = {
            articles: null,
            pageNumber: props.pageNumber,
            perPage: props.perPage,
            loading: false,
            url: props.props.path,
            currentUser: props.props.currentUser
        };
    }

    renderArticles(pageNumber, perPage) {
        getArticles(pageNumber, perPage)
        .then(response => {
            let articleRows = [];
            let rowSize = this.state.perPage;

            for (let i = 0; i < response.articles.length; i += rowSize) {
                let articleRow = [];

                for (let j = i; j < response.articles.length && j < (i + rowSize); j++) {
                    articleRow.push(response.articles[j]);
                }
                if (articleRow.length !== 0) {
                    articleRows.push(articleRow);
                }
            }

            const listItems = articleRows.map((articles) => this.renderArticlesRow(articles));
            this.setState({
                articles: (
                    <div>{listItems}</div>
                ),
                articlesTotalCount: response.total
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
        const row = articles.map((article) => {
            article.created = new Date(article.created);
            return Articles.renderArticle(article, this.state.currentUser)
        });

        return (<div className="row">{row}</div>);
    };

    static renderArticle(article, currentUser) {
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
                        {
                            currentUser.id === article.owner.id ? (
                                <span className="name"><i className="lni-user"></i><a href="#">Posted by me</a></span>
                            ) : (
                                <span className="name"><i className="lni-user"></i><a href="#">Posted by {article.owner.name}</a></span>
                            )
                        }
                        <span className="date float-right"><i className="lni-calendar"></i><a
                            href="#">{article.created.toLocaleDateString() + ' - ' + article.created.toLocaleTimeString()}</a></span>
                    </div>
                </div>
            </div>
        );
    };

    componentDidMount() {
        this.renderArticles(this.state.pageNumber, this.state.perPage);
    }

    previousPage() {
        this.setState((state) => {
            if (!this.canBackPage()) {
                return;
            }
            let pageNumber = state.pageNumber - 1;
            this.renderArticles(pageNumber, state.perPage);

            return {
                pageNumber: pageNumber
            }
        });
    }

    nextPage() {
        this.setState((state) => {
            if (!this.canNextPage()) {
                return;
            }
            let pageNumber = state.pageNumber + 1;
            this.renderArticles(pageNumber, state.perPage);

            return {
                pageNumber: pageNumber
            }
        });
    }

    canBackPage() {
        return this.state.pageNumber > 0;
    }

    canNextPage() {
        return (this.state.pageNumber + 1) * this.state.perPage < this.state.articlesTotalCount;
    }

    setPerPage(e) {
        let {value} = e.target;
        this.setState({
            perPage: parseInt(value)
        });
        this.setState((state) => {
            this.renderArticles(0, state.perPage);

            return {
                pageNumber: 0
            }
        });
    }

    render() {
        if (this.state.loading) {
            return <LoadingIndicator/>
        }

        let backLink = this.state.url + '/' + (this.state.pageNumber - 1) + '/' + this.state.perPage;
        let nextLink = this.state.url + '/' + (this.state.pageNumber + 1) + '/' + this.state.perPage;

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