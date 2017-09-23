﻿import * as auth from './ServerApi/Authentication';
import * as ko from 'knockout';
import { MiddlewareFactory, Middleware, Router, State } from 'router5';

const defaultAuthInfo: auth.IAuthenticationInfo = {
    userId: 0,
    userName: null,
    isAuthenticated: false
};

const allowedRoutes = [
    /^\/auth\//i,
    /^\/hmr-proxy/i
];

function middleware(router: Router, authenticationService: AuthenticationService): Middleware {
    

    return (toState: State) => {
        const path = toState.path,
              isAuthenticating = authenticationService.isCheckingAuthentication,
              currentAuthenticationObservable = authenticationService.currentAuthentication,
              currentAuthenticationValue = currentAuthenticationObservable.peek();

        if (currentAuthenticationValue && currentAuthenticationValue.isAuthenticated) {
            return Promise.resolve(true);
        }

        for (const allowedRoute of allowedRoutes) {
            if (allowedRoute.test(path)) {
                console.log('AuthenticationMiddleware: Path %s allowed when not logged in', path);

                return Promise.resolve(true);
            }
        }

        const returnUrl = location.pathname !== '/' ? location.pathname + (location.search ? `?${location.search}` : '') : null;

        if (!isAuthenticating) {
            console.log('AuthenticationMiddleware: Path %s rejected: not logged in', path);

            router.cancel();
            router.navigate('auth.login', { returnUrl: returnUrl });
            return Promise.reject<boolean>('unauthenticated');
        }

        console.log('AuthenticationMiddleware: Path %s checking: not logged in', path);

        const promise = new Promise<boolean>((resolve, reject) => {
            const subscription = currentAuthenticationObservable.subscribe(val => {
                console.log('AuthenticationMiddleware: Path %s checked with result %s: not logged in', path, val.isAuthenticated);
                subscription.dispose();

                if (val.isAuthenticated) {
                    resolve(true);
                } else {
                    reject('unauthenticated');
                    router.cancel();
                    router.navigate('auth.login', { returnUrl: returnUrl });
                }
            });
        });

        return promise;
    };
}

export default class AuthenticationService {
    private api = new auth.Api();

    public currentAuthentication = ko.observable<auth.IAuthenticationInfo>(AuthenticationService.getPersistedAuthenticationInfo() || defaultAuthInfo).extend({ notify: 'always' });;
    public isAuthenticated = ko.pureComputed(() => this.currentAuthentication() && this.currentAuthentication().isAuthenticated);
    public isCheckingAuthentication = false;

    public middleware: MiddlewareFactory = (router: Router) => middleware(router, this);

    public addAnonymousRoute(match: RegExp) {
        allowedRoutes.push(match);
    }

    public initialize(): void {
        this.checkAuthenticationCore();
        this.autoPersistAuthenticationInfo();
    }

    public async unauthenticate(): Promise<auth.IAuthenticationInfo> {
        const authInfo = await this.api.logoff();
        this.currentAuthentication(authInfo);
        return authInfo;
    }

    public checkAuthentication() {
        return new Promise<boolean>((resolve) => {
            if (!this.isCheckingAuthentication) {
                resolve(this.isAuthenticated.peek());
                return;
            }

            const disposable = this.currentAuthentication.subscribe(x => {
                disposable.dispose();

                resolve(this.isAuthenticated.peek());
            });
        });
    }

    public async authenticate(userName: string, password: string, persistent: boolean) {
        const loginInfo: auth.ILoginModel = {
            userName: userName,
            password: password,
            persistent: persistent
        };

        const authInfo = await this.api.login(loginInfo);
        this.currentAuthentication(authInfo);
        return authInfo;
    }

    private async checkAuthenticationCore() {
        this.isCheckingAuthentication = true;
        console.log('AuthenticationService: Checking authentication');
        try {
            const authInfo = await this.api.check();
            this.currentAuthentication(authInfo);
        } finally {
            console.log('AuthenticationService: Checked authentication, result: %s', this.currentAuthentication().isAuthenticated);
            this.isCheckingAuthentication = false;
        }
    }

    private static persistedAuthInfoKey = 'app_currentAuthentication';

    // By persisting the authentication information, we can tell 
    // in advance whether an user is authenticated or not
    private static getPersistedAuthenticationInfo(): auth.IAuthenticationInfo|null {
        try {
            const rawData = localStorage.getItem(this.persistedAuthInfoKey);
            if (!rawData) {
                return null;
            }

            return JSON.parse(rawData);
        } catch (e) {
            return null;
        }
    }

    private autoPersistAuthenticationInfo() {
        ko.computed(() => this.persistAuthenticationInfo(this.currentAuthentication()));
    }

    private persistAuthenticationInfo(authInfo: auth.IAuthenticationInfo) {
        console.log('AuthenticationService: Persisting authentication info');

        const json = JSON.stringify(authInfo);

        localStorage.setItem(AuthenticationService.persistedAuthInfoKey, json);
    }
}