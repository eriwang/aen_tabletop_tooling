import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            { currentUser => currentUser ? <NavigationAuth /> : <NavigationNonAuth /> }
        </AuthUserContext.Consumer>
    </div>
)

const NavigationAuth = () => (
    <div>
        <ul>
            <li>
                <Link to={ROUTES.HOME}>Home</Link>
            </li>
            <li>
                <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
            </li>
            <li>
                <Link to={ROUTES.ATTACK}>Attack</Link>
            </li>
            <li>
                <Link to={ROUTES.ACCOUNT}>Account</Link>
            </li>
        </ul>
    </div>
)

const NavigationNonAuth = () => (
    <div>
        <ul>
            <li>
                <Link to={ROUTES.LANDING}>Landing</Link>
            </li>
            <li>
                <Link to={ROUTES.SIGN_IN}>Sign in</Link>
            </li>
            <li>
                <Link to={ROUTES.SIGN_UP}>Sign up</Link>
            </li>
            <li>
                <Link to={ROUTES.FORGOT_PASSWORD}>Forgot password</Link>
            </li>
        </ul>
    </div>
)

export const withRouter = (Component: React.ComponentType<any>) => (props: any) => (
    <Component {...props} navigate={useNavigate()} />
)

export default Navigation;