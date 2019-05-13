import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AppHeader.css';

class AppHeader extends Component {
    render() {
        return (
            <header className="app-header">
                <div className="container">
                    <div className="app-branding">
                        {
                            this.props.authenticated ? (
                                <div>
                                    <div className="profile-avatar">
                                        <img src={this.props.currentUser.imageUrl} alt={this.props.currentUser.name}/>
                                    </div>
                                    <div className="profile-name">
                                        <h4>{this.props.currentUser.name}</h4>
                                    </div>
                                </div>
                            ) : (<span></span>)
                        }
                    </div>
                    <div className="app-branding">
                        <Link to="/" className="app-title">Home</Link>
                    </div>
                    <div className="app-options">
                        <nav className="app-nav">
                                { this.props.authenticated ? (
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
                                ): (
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