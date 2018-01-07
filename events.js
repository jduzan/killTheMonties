import React from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";

const EVENT_TYPE = {
    key: "key"
}

class Events extends React.Component{
    constructor(){
        super();
        this.subscribers = {
            key: []
        };
        this.key = {};
    }
    componentDidMount(){
        window.addEventListener("keydown", this.onKeyDown, true);
        window.addEventListener("keyup", this.onKeyUp, true);
    }
    getChildContext(){
        return {
            subscribeEvents: this.subscribeEvents,
            unsubcribeEvents: this.unsubcribeEvents,
            EVENT_TYPE: EVENT_TYPE
        }
    }
    @autobind
    subscribeEvents(eventType, callback){
        if(callback && typeof callback === "function"){
            return this.subscribers[eventType].push(callback);
        }
    }
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
    unsubcribeEvents: PropTypes.func,
    EVENT_TYPE: PropTypes.object
};

export default Events;
