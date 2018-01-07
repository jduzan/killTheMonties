import React from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";

export const EVENT_TYPE = {
    key: "key",
    mouse: "mouse"
}

class Events extends React.Component{
    constructor(){
        super();
        this.subscribers = {
            key: [],
            mouse: []
        };
        this.key = {};
        this.mouse = {
            position: {
                x: 0,
                y: 0
            },
            leftClick: false,
            rightClick: false
        };
    }
    componentDidMount(){
        window.addEventListener("keydown", this.onKeyDown, true);
        window.addEventListener("keyup", this.onKeyUp, true);
        window.addEventListener("mousemove", this.onMouseMove, true);
    }
    getChildContext(){
        return {
            subscribeEvents: this.subscribeEvents,
            unsubcribeEvents: this.unsubcribeEvents
        }
    }
    @autobind
    subscribeEvents(eventType, callback){
        if(callback && typeof callback === "function"){
            return this.subscribers[eventType].push(callback);
        }
    }
    @autobind
    unsubcribeEvents(eventId, eventType){
        this.subscribers[eventType].splice(eventId, 1);
    }
    @autobind
    onKeyDown(event){
        this.key[event.code] = true;
        this.notifyKeyEvent();
    }
    @autobind
    onKeyUp(event){
        this.key[event.code] = false;
        this.notifyKeyEvent();
    }
    @autobind
    onMouseMove(event){
        this.mouse.position = {
            x: event.x,
            y: event.y
        };

        this.notifyMouseEvent();
    }
    @autobind
    notifyMouseEvent(){
        this.subscribers[EVENT_TYPE.mouse].forEach((callback) => callback(this.mouse));
    }
    @autobind
    notifyKeyEvent(){
        this.subscribers[EVENT_TYPE.key].forEach((callback) => callback(this.key));
    }
    render(){
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

Events.childContextTypes = {
    subscribeEvents: PropTypes.func,
    unsubcribeEvents: PropTypes.func
};

export default Events;
