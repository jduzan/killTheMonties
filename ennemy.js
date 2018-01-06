import React from "react";
import PropTypes from 'prop-types';
import autobind from "autobind-decorator";
import * as GameConstant from "./gameVar";

class Ennemy extends React.Component{
    constructor(){
        super();
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        };
    }
    componentDidMount(){
        this.context.subscribeLoop(this.update);
    }
    @autobind
    update(){
        if(this.checkNextPositionIsAvailable()){
            this.setState({
                position: {
                    x: this.state.position.x + GameConstant.ENNEMY_SPEED.x,
                    y: this.state.position.y + GameConstant.ENNEMY_SPEED.y
                }
            });
        }
    }
    @autobind
    checkNextPositionIsAvailable(){
        // check top left corner
        if(this.state.position.x + GameConstant.ENNEMY_SPEED.x > this.context.levelLimit.x){
            return false;
        }

        // check top right corner
        if(this.state.position.x + GameConstant.ENNEMY_SPEED.x + GameConstant.ENNEMY_SIZE.x > this.context.levelLimit.x){
            return false;
        }

        // check bottom corner
        if(this.state.position.y + GameConstant.ENNEMY_SPEED.y + GameConstant.ENNEMY_SIZE.y > this.context.levelLimit.y){
            return false;
        }

        return true;
    }
    render(){
        const style = {
            width: `${GameConstant.ENNEMY_SIZE.x}px`,
            height: `${GameConstant.ENNEMY_SIZE.y}px`,
            background: "lightblue",
            position: "absolute",
            left: this.state.position.x,
            top: this.state.position.y
        };

        return (
            <div style={style}></div>
        )
    }
}

Ennemy.contextTypes = {
    subscribeLoop: PropTypes.func,
    levelLimit: PropTypes.object
};

export default Ennemy;
