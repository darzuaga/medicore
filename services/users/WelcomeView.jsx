import {element} from 'deku'
import {Render, emit} from '../../emitter.js'
var firebase = require('../../firebase.js')
var $ = require('jquery')
var Rx = require('rxjs')
var Observable = Rx.Observable


export const WelcomeView = {

    onCreate(){
        var _self = WelcomeView
    },

    handleClick(payload){
        let {event_type} = this;
        emit(event_type, this)
    },

    render(){
        return(

            <div class="mdl-grid">
              <div class="mdl-cell mdl-cell--4-col"></div>
              <div class="mdl-cell mdl-cell--4-col">

              <div class="demo-card-wide mdl-card mdl-shadow--3dp">
                <div class="mdl-card__title">
                  <h2 class="mdl-card__title-text">Welcome</h2>
                </div>
                <div class="mdl-card__supporting-text">
                    <p>
                        Welcome to the Medicore training module. By clicking next, you will be
                        presented with a video. After watching the video please continue to
                        answer the questions below.
                    </p>
                    <p>Before we move foreward please enter your name.</p>
                </div>

                <div class="mdl-card__supporting-text new_user_textfield_container">
                    <form action="#">
                        <div class="mdl-textfield mdl-js-textfield new_user_text_field">
                          <input class="mdl-textfield__input" type="text" id="sample1" placeholder="Enter Your Name"/>
                        </div>
                    </form>
                </div>

                <div class="mdl-card__actions mdl-card--border">
                  <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={WelcomeView.handleClick.bind({event_type: 'routing', path: 'OrgsView3'})}>
                    Get Started
                  </a>
                </div>
                <div class="mdl-card__menu">
                  <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                    <i class="material-icons">share</i>
                  </button>
                </div>
              </div>

              </div>
              <div class="mdl-cell mdl-cell--4-col"></div>
            </div>


        )
    }

}
