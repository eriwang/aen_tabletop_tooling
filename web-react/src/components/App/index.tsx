import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { withAuthentication } from '../Session';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import HomePage from '../Home';
import SignInPage from '../SignIn';
import SignUpPage from '../SignUp';
import ForgotPasswordPage from '../ForgotPassword';
import AccountPage from '../Account';
import DashboardPage from '../Dashboard';
import AttackPage from '../Attack';
import ProfilesPage from '../Profiles';
import NotFoundPage from '../NotFound';

import * as ROUTES from '../../constants/routes';

class App extends Component<{},{}> {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Navigation />

                    <hr />

                    <Routes>
                        <Route path={ROUTES.LANDING} element={<LandingPage />} />
                        <Route path={ROUTES.HOME} element={<HomePage />} />
                        <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
                        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
                        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                        <Route path={ROUTES.ACCOUNT} element={<AccountPage />} />
                        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                        <Route path={ROUTES.ATTACK} element={<AttackPage />} />
                        <Route path={ROUTES.PROFILES} element={<ProfilesPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }
}

export default withAuthentication(App);