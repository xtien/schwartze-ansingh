import axios from "axios";
import {Configuration} from "../generated-api";

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const VISITOR = 'visitor'
export const ADMIN = 'admin'
export const AUTH1 = 'auth1'
export const AUTH2 = 'auth2'

export const apiConfig = new Configuration({
    basePath: import.meta.env.VITE_API_URL,
})

export function setAuthorities(authorities: string | string[]) {
    if (authorities.includes("READ_PRIVILEGE")) {
        sessionStorage.setItem(VISITOR, 'true')
    }
    if (authorities.includes("WRITE_PRIVILEGE")) {
        sessionStorage.setItem(ADMIN, 'true')
    }
}

export function isAdmin() {
    return sessionStorage.getItem(ADMIN);
}

export function setAuth(username: string, password: string) {
    sessionStorage.setItem(AUTH1, username)
    sessionStorage.setItem(AUTH2, password)
}

export function getAuth1() {
    return sessionStorage.getItem(AUTH1) ?? ''
}

export function getAuth2() {
    return sessionStorage.getItem(AUTH2) ?? ''
}

export function getAuth() {
    return {
        authorization: createBasicAuthToken(getAuth1(), getAuth2())
    }
}

export function getAxiosConfig() {
    return {
        headers: {
            "Content-Type": "application/json",
        },
        authorization: createBasicAuthToken(getAuth1(), getAuth2())
    }
}

export function createBasicAuthToken(username: string, password: string) {
    if (username === null || password === null) {
        return null;
    } else {
        return 'Basic ' + window.btoa(username + ":" + password)
    }
}

export function registerSuccessfulLogin(username: string, password: string) {
    sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
    setupAxiosInterceptors(createBasicAuthToken(username, password))
    setAuth(username, password)
}

export function setupAxiosInterceptors(token: string | null) {
    axios.interceptors.request.use(
        (config) => {
            if (isUserLoggedIn()) {
                config.headers.authorization = token
            }
            return config
        }
    )
}

export function logout() {
    sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
    sessionStorage.removeItem(AUTH1);
    sessionStorage.removeItem(AUTH2);
    sessionStorage.setItem(ADMIN, 'false');
}

export function isUserLoggedIn() {
    if (sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME) === null) {
        return false
    } else {
        return true
    }
}

export function getLoggedInUserName() {
    const user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
    if (user === null) {
        return ''
    } else {
        return user
    }
}

export function executeLogin(username: string, password: string) {
    const url = import.meta.env.VITE_API_URL + '/user/login'
    return axios.get(url,
        {
            headers: {
                authorization: createBasicAuthToken(username, password)
            }
        }
    )
}

