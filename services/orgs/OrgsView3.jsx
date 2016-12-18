import {element} from 'deku'
import {Render} from '../../emitter.js'
var firebase = require('../../firebase.js')
var $ = require('jquery')
var _ = require('lodash')
var Rx = require('rxjs')
var Observable = Rx.Observable

var storage = firebase.db.storage()
var orgs_path = firebase.db.database()

export const OrgsView3 = {

    onCreate({props}) {
        var _self = OrgsView3
        _self.props = props
        _self.orgs_path = firebase.db.database()
        _self.addNewOrg()
        _self.renderOrgs(props)
    },

    viewVideo(data){

        return Render('#video_preview_container').subscribe(render => {
            render(
                <dialog class="mdl-dialog" id="video_dialog">

                    <div class="mdl-dialog__actions">
                        <button type="button" class="mdl-button close" id="close_dialog_btn">Close</button>
                    </div>

                    <div class="mdl-dialog__content dialog_video_container">

                        <video style="width: 100%" controls autoplay id="dialog_video_player">
                          <source src={`${this.data.url}`} type="video/mp4" />
                        </video>

                    </div>

                </dialog>
            )

            var video_dialog = document.getElementById('video_dialog');
            video_dialog.showModal()

            var close_dialog_btn = document.getElementById('close_dialog_btn')
            var close_dialog_btn_clicks = Observable.fromEvent(close_dialog_btn, 'click')

            //close dialog
            close_dialog_btn_clicks.subscribe(click => {
                $('#dialog_video_player').trigger('pause')
                video_dialog.close()
            })

        })

    },

    addNewOrg(){
        return Render('#add_new_org_container').subscribe(render => {

            // add new organization component
            render(

                <div class="mdl-grid add_new_org_component">

                    <div class="mdl-cell mdl-cell--9-col"></div>

                    <button id="add_new_video_btn" class="mdl-cell mdl-cell--2-col mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary">
                        ADD VIDEO
                    </button>

                    <dialog class="mdl-dialog" id="dialog">
                        <h4 class="dialog_title">ADD VIDEO</h4>
                        <div class="mdl-dialog__content">

                        <form action="#">

                            <div class="mdl-textfield mdl-js-textfield">
                                <input class="mdl-textfield__input" type="text" id="video_name" placeholder="Name..."/>
                            </div>

                            <div class="mdl-textfield mdl-js-textfield">
                                <progress value='0' max="100" id="progress_bar">0%</progress>
                                <input class="mdl-textfield__input" type="file" id="select_file_btn" />
                            </div>

                        </form>

                        </div>
                        <div class="mdl-dialog__actions">

                            <button type="button" class="mdl-button close" id="close_dialog_btn">Cancel</button>
                        </div>
                    </dialog>

                </div>

            )

            // select dom elements
            var dialog = document.getElementById('dialog');
            var progress_bar = document.getElementById('progress_bar')
            var video_name = document.getElementById('video_name')
            var select_file_btn = document.getElementById('select_file_btn')
            var close_dialog_btn = document.getElementById('close_dialog_btn')

            // add event listeners to dom elements
            var add_new_video_btn_clicks = Observable.fromEvent(add_new_video_btn, 'click')
            var select_file_btn_clicks = Observable.fromEvent(select_file_btn, 'change')
            var close_dialog_btn_clicks = Observable.fromEvent(close_dialog_btn, 'click')

            // show dialog
            add_new_video_btn_clicks.subscribe(click => {
                dialog.showModal()
            })

            select_file_btn_clicks.subscribe(evt => {

                var org_path = OrgsView3.props.payload.name
                var video_name = $('#video_name').val()
                var video_file = evt.target.files[0]

                var video_path = storage.ref(`organizations/${org_path}/videos/${video_name}`)
                var task = video_path.put(video_file)

                task.on('state_changed',

                    function progress(snapshot){
                        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        progress_bar.value = percentage
                    },

                    function error(err){

                    },

                    function complete(){

                        video_path.getDownloadURL().then(url => {

                            orgs_path.ref(`organizations/${org_path}/videos/${video_name}`).update({
                                url: url,
                                name: video_name
                            })

                        })

                        dialog.close()
                        $('#video_name').val('')
                        $('#select_file_btn').val('')
                        progress_bar.value = 0
                    }

                )

            })

            //close dialog
            close_dialog_btn_clicks.subscribe(click => {
                dialog.close()
                $('#video_name').val('')
                $('#select_file_btn').val('')
                progress_bar.value = 0
            })

        })
    },

    deleteOrg(data){

        var org_name = this.props.name
        var video_name = this.data.name
        var video_path = `organizations/${org_name}/videos/${video_name}`

        // listen to delete events
        var delete_org_btn = document.getElementById('delete_org_btn')
        var delete_org_btn_clicks = Observable.fromEvent(delete_org_btn, 'click')

        // get path of object to remove
        var path = firebase.db.database().ref(`${video_path}`)

        // remove from firebsae
        path.remove()

    },

    renderOrgs(props){

        if(Object.keys(props).length !== 0){
            var list_of_videos_data = Observable.create(observer => {
                OrgsView3.orgs_path.ref(`organizations/${props.payload.name}/videos`).on('value', snapshot => {
                    observer.next(snapshot.val())
                })
            })

            list_of_videos_data.subscribe(organizations => {

                Render('#list_of_organizations_container').subscribe(render => {

                    var organization_rows = _.map(organizations, (organization, key) => {

                        return(
                            <tr>
                                <td class="mdl-data-table__cell--non-numeric">
                                    {organization.name}
                                </td>

                                <td>
                                    <button id={key} onClick={OrgsView3.viewVideo.bind({data: organization})} class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary view_video_btn">
                                      VIEW
                                    </button>

                                    <button id={key} onClick={OrgsView3.deleteOrg.bind({data: organization, props: props.payload})} class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary delete_org_btn">
                                      DELETE
                                    </button>
                                </td>
                            </tr>
                        )

                    })

                    render(

                        <table class=" mdl-cell mdl-cell--12-col mdl-data-table mdl-js-data-table mdl-shadow--2dp">

                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Videos</th>
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

        }

    },

    render() {

        return (

            <div>

                <div id="video_preview_container"></div>

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
