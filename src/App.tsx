import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Location from './pages/Location/Location';;
import '/theme.css';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/location" component={Location} />
        <Redirect exact from="/" to="/location" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
