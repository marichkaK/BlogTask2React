import React, {Component} from 'react';
import {Link, NavLink} from 'react-router-dom';
import './AppHeader.css';
import userDefaultLogo from '../img/default-user.png';

class AppHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logo: this.props.currentUser && this.props.currentUser.imageUrl
                ? this.props.currentUser.imageUrl : userDefaultLogo,
        };
    }

    render() {
        return (
            <header className="app-header">
                <div className="container">
                    <div className="app-branding">
                        {
                            this.props.authenticated ? (
                                <div>
                                    <div className="profile-avatar">
                                        <img src={this.state.logo}/>
                                    </div>
                                    <div className="profile-name">
                                        <NavLink to={'/'}><h4>{this.props.currentUser.name}</h4></NavLink>
                                    </div>
                                </div>
                            ) : (<span></span>)
                        }
                    </div>
                    {
                        !this.props.authenticated ? (
                            <div className="app-branding">
                                <Link to="/" className="app-title">Home</Link>
                            </div>
                        ) : null
                    }
                    <div className="app-options">
                        <nav className="app-nav">
                            {this.props.authenticated ? (
                                <ul>
                                    <li>
                                        <NavLink to="/profile">Articles</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/newArticle">New Article</NavLink>
                                    </li>
                                    <li>
                                        <a onClick={this.props.onLogout}>Logout</a>
                                    </li>
                                </ul>
                            ) : (
                                <ul>
                                    <li>
                                        <NavLink to="/login">Login</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/signup">Signup</NavLink>
                                    </li>
                                </ul>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
        )
    }
}

export default AppHeader;