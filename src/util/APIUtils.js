import {ACCESS_TOKEN, API_BASE_URL} from '../constants';

const http = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response =>
        response.json().then(json => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return http({
        url: API_BASE_URL + "/users/me",
        method: 'GET'
    });
}

export function login(loginRequest) {
    return http({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return http({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function getArticles(startNumber, endNumber, tag) {
    return http({
        url: API_BASE_URL + "/articles/page/"+ startNumber + "/size/" + endNumber + "/tags/" + tag,
        method: 'GET'
    });
}

export function getArticle(id) {
    return http({
        url: API_BASE_URL + "/articles/" + id,
        method: 'GET'
    });
}

export function createArticle(articleRequest) {
    return http({
        url: API_BASE_URL + "/articles",
        method: 'POST',
        body: JSON.stringify(articleRequest)
    });
}

export function addComment(articleId, comment) {
    return http({
        url: API_BASE_URL + "/articles/" + articleId + "/comments",
        method: 'POST',
        body: JSON.stringify(comment)
    });
}