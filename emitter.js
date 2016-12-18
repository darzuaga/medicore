var Rx = require('rxjs')
import {dom, createApp} from 'deku'
var Observable = Rx.Observable

var subjects = {}

var emit = (name, data) => {
    var fnName = name
    subjects[fnName] || (subjects[fnName] = new Rx.BehaviorSubject(''))
    return subjects[fnName].next(data)
}

var on = (name, handler) => {
    var fnName = name
    subjects[fnName] || (subjects[fnName] = new Rx.BehaviorSubject(''))
    return subjects[fnName]
}

var Render = (elm) => {
    return Observable
        .interval(50)
        .map(() => document.querySelector(`${elm}`))
        .filter(elm => elm !== null)
        .take(1)
        .map(elm => {
            return createApp(elm)
        })
}

module.exports = {emit, on , Render}
