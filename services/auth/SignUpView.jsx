import {element} from 'deku'
import {Render} from '../../emitter.js'
var firebase = require('../../firebase.js')
var $ = require('jquery')
var Rx = require('rxjs')
var Observable = Rx.Observable


export const SignUpView = {

    onCreate(){
        var _self = SignUpView

        _self.signUpBtn()
    },

    signUpBtn(){

        return Render("#sign_up_btn_container").subscribe(render => {

            render(
                <div id="sign_up_btn" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                    Button
                </div>
            )

            var sign_up_btn = document.getElementById('sign_up_btn')
            var sign_up_btn_clicks = Observable.fromEvent(sign_up_btn, 'click')

            sign_up_btn_clicks.subscribe(click => {

                var auth = firebase.db.auth()
                var email = $('#email').val()
                var password = $('#password').val()

                var promise = auth.createUserWithEmailAndPassword(email, password)

            })
        })

    },

    render() {

        return (

            <form action="#">

                <h1>Sign Up</h1>

                <div class="mdl-textfield mdl-js-textfield">
                    <input class="mdl-textfield__input" type="text" id="email"/>
                    <label class="mdl-textfield__label" for="sample1">Email...</label>
                </div>

                <br/>

                <div class="mdl-textfield mdl-js-textfield">
                    <input class="mdl-textfield__input" type="text" id="password"/>
                    <label class="mdl-textfield__label" for="sample1">Password...</label>
                </div>

                <br/>

                <div id="sign_up_btn_container"></div>

            </form>

        )
    }

}
