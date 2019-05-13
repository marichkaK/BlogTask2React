import React, {Component} from 'react';
import './Profile.css';
import './Article.css';
import {Redirect, withRouter} from "react-router-dom";
import Alert from "react-s-alert";
import {createArticle} from "../../util/APIUtils";

class NewArticle extends Component {
    constructor(props) {
        super(props);
        console.log(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.createArticle = this.createArticle.bind(this);

        this.state = {
            name: '',
            content: '',
            tags: '',
            created: false
        };
    }

    createArticle(event) {
        event.preventDefault();

        const articleRequest = Object.assign({}, this.state);

        createArticle(articleRequest)
        .then(response => {
            Alert.success("You're successfully an article!");
            this.setState({
                created: true
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
        if (this.state.created) {
            return <Redirect to={{pathname: "/profile", state: {from: this.props.location}}}/>;
        }

        return (
            <section id="blog">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="blog-text section-header text-center">
                                <h2 className="section-title">Create new article</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3"/>
                        <div className="col-lg-6">
                            <form onSubmit={this.createArticle}>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input id="name" value={this.state.name} onChange={this.handleInputChange}
                                           type="text" className="form-control" required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="content">Description</label>
                                    <textarea id="content" value={this.state.content} onChange={this.handleInputChange}
                                              className="form-control" rows="5" required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tags">Add some tags</label>
                                    <input id="tags" type="text" value={this.state.tags} onChange={this.handleInputChange}
                                           className="form-control"/>
                                </div>
                                <div className="form-item">
                                    <button type="submit" className="btn btn-block btn-primary">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withRouter(NewArticle);
