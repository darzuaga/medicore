import {element} from 'deku'
import {Render, emit} from '../../emitter.js'
var firebase = require('../../firebase.js')
var $ = require('jquery')
var _ = require('lodash')
var Rx = require('rxjs')
var Observable = Rx.Observable

var orgs_path = firebase.db.database().ref("organizations")
var auth = firebase.db.auth()

export const OrgsView = {

    onCreate() {
        var _self = OrgsView
        _self.addNewOrg()
        _self.renderOrgs()
    },

    handleEvent(data){

        let {event_type} = this;

        emit(event_type, this)
    },

    addNewOrg(){
        return Render('#add_new_org_container').subscribe(render => {

            // add new organization component
            render(

                <div class="mdl-grid add_new_org_component">

                <div class="mdl-cell mdl-cell--1-col">
                </div>

                    <div class="mdl-cell mdl-cell--8-col">
                        <h4>ORGANIZATIONS</h4>
                    </div>

                    <button id="add_new_org_btn" class="mdl-cell mdl-cell--2-col mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary">
                        NEW ORGANIZATION
                    </button>

                    <dialog class="mdl-dialog" id="dialog">
                        <h4 class="dialog_title">New Organization</h4>
                        <div class="mdl-dialog__content">

                        <form action="#">

                            <div class="mdl-textfield mdl-js-textfield">
                                <input class="mdl-textfield__input" type="text" id="org_name" placeholder="Name..."/>
                            </div>

                            <div class="mdl-textfield mdl-js-textfield">
                                <input class="mdl-textfield__input" type="text" id="org_email" placeholder="Email..."/>
                            </div>

                            <div class="mdl-textfield mdl-js-textfield">
                                <input class="mdl-textfield__input" type="text" id="org_password" placeholder="Password..."/>
                            </div>

                        </form>

                        </div>
                        <div class="mdl-dialog__actions">
                            <button type="button" class="mdl-button" id="save_org_btn">Save</button>
                            <button type="button" class="mdl-button close" id="close_dialog_btn">Cancel</button>
                        </div>
                    </dialog>

                </div>

            )

            // select dom elements
            var dialog = document.getElementById('dialog');
            var add_new_org_btn = document.getElementById('add_new_org_btn')
            var save_org_btn = document.getElementById('save_org_btn')
            var close_dialog_btn = document.getElementById('close_dialog_btn')

            // add event listeners to dom elements
            var add_new_org_btn_clicks = Observable.fromEvent(add_new_org_btn, 'click')
            var save_org_btn_clicks = Observable.fromEvent(save_org_btn, 'click')
            var close_dialog_btn_clicks = Observable.fromEvent(close_dialog_btn, 'click')

            // show dialog
            add_new_org_btn_clicks.subscribe(click => {
                dialog.showModal()
            })

            //save new org
            save_org_btn_clicks.subscribe(click => {

                var org_name = $('#org_name').val()
                var org_email = $('#org_email').val()
                var org_password = $('#org_password').val()

                // save to path (not secure because we are saving the credentials as raw, fix later)
                orgs_path.update({
                    [org_name]: {
                        name: org_name,
                        email: org_email,
                        password: org_password
                    }
                }, done => {
                    dialog.close()
                    $('#org_name').val('')
                    $('#org_email').val('')
                    $('#org_password').val('')
                })

                // create a new user auth for signing later

                var promise = auth.createUserWithEmailAndPassword(org_email, org_password)
            })

            //close dialog
            close_dialog_btn_clicks.subscribe(click => {
                dialog.close()
                $('#org_name').val('')
                $('#org_email').val('')
                $('#org_password').val('')
            })

        })
    },

    deleteOrg(data){

        // listen to delete events
        var delete_org_btn = document.getElementById('delete_org_btn')
        var delete_org_btn_clicks = Observable.fromEvent(delete_org_btn, 'click')

        // get path of object to remove
        var path = firebase.db.database().ref(`organizations/${this.data.name}`)

        // remove from firebsae
        path.remove()

    },

    renderOrgs(){
        var list_of_orgs_data = Observable.create(observer => {
            orgs_path.on('value', snapshot => {
                observer.next(snapshot.val())
            })
        })

        list_of_orgs_data
            .subscribe(organizations => {

                var organization_rows = _.map(organizations, (organization, key) => {
                    return(
                        <tr>
                            <td class="mdl-data-table__cell--non-numeric">
                                <a href="#" class="org_name_link" onClick={
                                    OrgsView.handleEvent.bind({event_type: 'routing', path: 'OrgsView3', payload: organization})
                                }>{organization.name}</a>
                            </td>
                            <td>{organization.email}</td>
                            <td>{organization.password}</td>
                            <td>1</td>
                            <td>
                                <button id={key} onClick={OrgsView.deleteOrg.bind({data: organization})} class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary delete_org_btn">
                                  DELETE
                                </button>
                            </td>
                        </tr>
                    )
                })



            return Render('#list_of_organizations_container').subscribe(render => {
                render(

                    <table class=" mdl-cell mdl-cell--12-col mdl-data-table mdl-js-data-table mdl-shadow--2dp">

                        <thead>
                            <tr>
                                <th class="mdl-data-table__cell--non-numeric">Organization Name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Videos</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {organization_rows}
                        </tbody>

                    </table>

                )
            })
        })
    },

    render({props}) {

        return (

            <div>

                <div id="add_new_org_container"></div>

                <div class="mdl-grid">

                    <div class="mdl-cell mdl-cell--1-col"></div>

                    <div id="list_of_organizations_container" class="mdl-cell--10-col">
                    </div>

                    <div class="mdl-cell mdl-cell--1-col"></div>
                </div>

            </div>

        )
    }

}
