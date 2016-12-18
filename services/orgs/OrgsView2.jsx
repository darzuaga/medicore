import {element} from 'deku'
import {Render} from '../../emitter.js'
var firebase = require('../../firebase.js')
var $ = require('jquery')
var _ = require('lodash')
var Rx = require('rxjs')
var Observable = Rx.Observable

var orgs_path = firebase.db.database().ref("organizations")

export const OrgsView = {

    onCreate() {
        var _self = OrgsView
        _self.addNewOrg()
        _self.renderOrgs()
    },

    addNewOrg(){
        return Render('#add_new_org_container').subscribe(render => {

            // render 'add organization' component
            render(
                <div class="mdl-grid add_new_org_component">

                    <div class="mdl-cell mdl-cell--1-col"></div>

                    <form action="#" class="mdl-cell mdl-cell--8-col">
                      <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--11-col">
                        <input class="mdl-textfield__input" type="text" id="organization_name" placeholder="New Organization Name..."/>
                      </div>
                    </form>

                    <button id="add_new_org_btn" class="mdl-cell mdl-cell--2-col mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary">
                      NEW VIDEO
                    </button>

                    <div class="mdl-cell mdl-cell--1-col"></div></div>
            )

            // listen to add organization click events
            var add_new_org_btn = document.getElementById('add_new_org_btn')
            var add_new_org_btn_clicks = Observable.fromEvent(add_new_org_btn, 'click')

            // get organization value


            // save new org on firebase
            add_new_org_btn_clicks.subscribe(click => {

                var org_name = $('#organization_name').val()

                orgs_path.update({
                    [org_name]: {
                        name: org_name
                    }
                }, done => {
                    $('#organization_name').val('')
                })
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

        // append new organization to list

        var list_of_orgs_data = Observable.create(observer => {
            orgs_path.on('value', snapshot => {
                observer.next(snapshot.val())
            })
        })

        list_of_orgs_data.subscribe(organizations => {
            var organization_rows = _.map(organizations, (organization, key) => {

                return(
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">
                            <a href="#" class="org_name_link">{organization.name.toUpperCase()}</a>
                        </td>
                        <td>25</td>
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
                                <th class="mdl-data-table__cell--non-numeric">Organization</th>
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

    render() {
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
