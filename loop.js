import React from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";

class Loop extends React.Component{
    constructor(){
        super();
        this.loopCallbacks = [];
    }
    componentDidMount(){
        this.startLoop();
    }
    componentWillUnmount(){
        this.stopLoop();
    }
    getChildContext(){
        return {
            subscribeLoop: this.subscribeLoop,
            unsubscribeLoop: this.unsubscribeLoop
        }
    }
    @autobind
    startLoop(){
        if(!this.frameId){
            this.frameId = window.requestAnimationFrame(this.loop);
        }
    }
    @autobind
    stopLoop(){
        window.cancelAnimationFrame(this.frameId);
    }
    @autobind
    loop(){
        this.loopCallbacks.forEach((callback) => {
            if(callback && typeof callback === "function"){
                callback();
            }
        });

        setTimeout(() => {
            window.requestAnimationFrame(this.loop);
        }, 16);
    }
    @autobind
    subscribeLoop(callback){
        return this.loopCallbacks.push(callback) - 1;
    }
    @autobind
    unsubscribeLoop(callbackId){
        this.loopCallbacks.splice(callback, 1);
    }
    render(){
        return (<div>{this.props.children}</div>);
    }
}

Loop.childContextTypes = {
    subscribeLoop: PropTypes.func,
    unsubscribeLoop: PropTypes.func
};

export default Loop;
