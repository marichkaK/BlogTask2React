import React, {Component} from 'react';
import './Profile.css';
import './Article.css';
import {addComment, getArticle} from "../../util/APIUtils";
import {NavLink, withRouter} from "react-router-dom";
import userDefaultLogo from '../../img/default-user.png';

class ArticlePage extends Component {
    constructor(props) {
        super(props);
        console.log(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addComment = this.addComment.bind(this);

        let articleId = parseInt(this.props.match.params.articleId);

        this.state = {
            articleId: articleId,
            article: null,
            comments: [],
            text: ''
        };
    }

    componentDidMount() {
        getArticle(this.state.articleId)
        .then(response => {
            response.created = new Date(response.created);
            this.setState({
                article: response,
                comments: this.getComments(response.comments)
            })
        });
    }

    getComments(comments) {
        return comments.map((comment) => {
            comment.created = new Date(comment.created);
            return comment;
        });
    }

    addComment(event) {
        event.preventDefault();

        const commentRequest = Object.assign({}, this.state);

        addComment(this.state.articleId, commentRequest)
        .then(response => {
            this.setState((state) => {
                let comments = state.comments;

                response.created = new Date(response.created);
                comments.push(response);

                return {
                    comments: comments,
                    text: ''
                }
            });
        })
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.id;
        const inputValue = target.value;

        this.setState({
            [inputName]: inputValue
        });
    }

    render() {

        return (
            <section id="blog">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2"/>
                        <div className="col-lg-8">
                            {
                                this.state.article ? (

                                    <div className="article-page-content">
                                        <div className="blog-item-wrapper">
                                            <div className="blog-item-img">
                                            </div>
                                            <div className="blog-item-text">
                                                <h3>{this.state.article.name}</h3>
                                                <p dangerouslySetInnerHTML={{__html: this.state.article.content}}/>
                                                {this.state.article.tags.map(tag => <NavLink to={'/profile?tag=' + tag.name}><a
                                                    className="read-more">#{tag.name}</a></NavLink>)}
                                            </div>
                                            <div className="author">
                                                {
                                                    this.props.currentUser.id === this.state.article.owner.id ? (
                                                        <span className="name">
                                                            <i className="lni-user"/>
                                                            <a>Posted by me</a>
                                                        </span>
                                                    ) : (
                                                        <span className="name">
                                                            <i className="lni-user"/>
                                                            <a>Posted by {this.state.article.owner.name}</a>
                                                        </span>
                                                    )
                                                }
                                                <span className="date float-right">
                                                    <i className="lni-calendar"/>
                                                    <a>{this.state.article.created.toLocaleDateString() + ' - ' +
                                                    this.state.article.created.toLocaleTimeString()}</a>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="article-page-content">
                                            <h4>Comments</h4>
                                            {
                                                <div>
                                                    {
                                                        this.state.comments.map(comment => (
                                                            <div className="row">
                                                                <div className="col-lg-1 profile-avatar">
                                                                    <img src={comment.user.imageUrl
                                                                        ? comment.user.imageUrl : userDefaultLogo}/>
                                                                    <div className="profile-name">
                                                                        <p>{comment.user.name}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-9">
                                                                    <p dangerouslySetInnerHTML={{__html: comment.text}}/>
                                                                    <hr/>
                                                                </div>
                                                                <div className="col-lg-2">
                                                                    <span className="date float-right">
                                                                        <i className="lni-calendar"/>
                                                                        <div>{comment.created.toLocaleDateString()}</div>
                                                                        <div>{comment.created.toLocaleTimeString()}</div>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                    <form onSubmit={this.addComment}>
                                                        <div className="form-group">
                                                            <textarea id="text"
                                                                      value={this.state.text}
                                                                      placeholder="Add comment.."
                                                                      onChange={this.handleInputChange}
                                                                      className="form-control" rows="3" required/>
                                                        </div>
                                                        <div className="form-item">
                                                            <button type="submit" className="btn btn-block btn-primary">
                                                                Add
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>

                                            }
                                        </div>
                                    </div>
                                ) : <h2>Loading</h2>
                            }
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withRouter(ArticlePage);
