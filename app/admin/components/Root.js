
import React from 'react';

// import FooterContainer from '../components/footer/FooterContainer';
//
// import HeaderContainer from '../components/header/HeaderContainer';

import { Route, Switch, Redirect } from 'react-router-dom';

import routes from '../routes';

const Root = () => (
    <div className="App">
        {/*<HeaderContainer />*/}
        <Switch>
            {routes.map((route, i) => <Route key={i} {...route} />)}
            <Route render={({staticContext}) => {

                staticContext && (staticContext.status = 404);

                return null;
                // return (
                //     <Redirect to="/gui"/>
                // );
            }}/>
        </Switch>
        {/*<FooterContainer/>*/}
    </div>
);

export default Root;
