import {createApp, element} from 'deku'
import {SignUpView} from './services/auth/SignUpView.jsx'
import {SignInView} from './services/auth/SignInView.jsx'
import {OrgsView} from './services/orgs/OrgsView.jsx'
import {OrgsView3} from './services/orgs/OrgsView3.jsx'
import {WelcomeView} from './services/users/WelcomeView.jsx'
import {Render, on} from './emitter.js'

var render = createApp(document.body)

on('routing')
    .subscribe(route => {

        console.log('route');
        console.log(route);

        return Render('#view_template').subscribe(render => {
            switch(route.path){

                case 'OrgsView':
                    render(<OrgsView/>)
                    return ;

                case 'OrgsView3':
                    render(<OrgsView3 payload={route.payload}/>)
                    return;

                case 'WelcomeView':
                    render(<WelcomeView payload={route.payload}/>)
                    return;

                default:
                    render(<WelcomeView />)
                    return ;
            }
        })

    })

const App = () => {
    return (

        <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <header class="mdl-layout__header">
            <div class="mdl-layout__header-row">

              <span class="mdl-layout-title">Medicore</span>

              <div class="mdl-layout-spacer"></div>

              <nav class="mdl-navigation mdl-layout">
                <a class="mdl-navigation__link" href=""></a>
                <a class="mdl-navigation__link" href="">Videos</a>
                <a class="mdl-navigation__link" href=""></a>
                <a class="mdl-navigation__link" href=""></a>
              </nav>

            </div>
          </header>

          <main class="mdl-layout__content">
            <div class="page-content">
                <div id="view_template"></div>
            </div>
          </main>
        </div>

    );
};

render(<App />)
