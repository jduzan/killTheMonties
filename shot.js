import React from "react";
import PropTypes from 'prop-types';
import autobind from "autobind-decorator";
import * as GameConstant from "./gameVar";
import {clone, checkCollision} from "./utils"

class shot extends React.Component{
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
        this.loopId = this.context.subscribeLoop(this.update);
        this.setState({
            position: this.props.position,
            orientation: this.props.orientation
        });
    }
    componentWillUnmount(){
        this.context.unsubscribeLoop(this.loopId);
    }
    @autobind
    destroy(){
        this.context.destroyshot(this.props.shotId);
    }
    @autobind
    update(){
        if(!checkCollision(this.getBoundingRectangle(), this.context.levelLimit)){
            return this.destroy();
        }

        this.setState({
            position: this.getNextPosition()
        });
    }
    @autobind
    getNextPosition(){
        // compute next position angle, current position and shot speed
        let position = clone(this.state.position);
        const radians = Math.PI / 180 * (this.state.orientation - 90);
        position.x += GameConstant.SHOT_SPEED.x * Math.cos(radians);
        position.y += GameConstant.SHOT_SPEED.y * Math.sin(radians);

        return position;
    }
    @autobind
    getCenter(){
        return {
            x: this.state.position.x + GameConstant.SHOT_SIZE.x / 2,
            y: this.state.position.y + GameConstant.SHOT_SIZE.y / 2
        }
    }
    @autobind
    getBoundingRectangle(){
        return {
            x: clone(this.state.position.x),
            x1: clone(this.state.position.x) + GameConstant.SHOT_SIZE.x,
            y: clone(this.state.position.y),
            y1: clone(this.state.position.y) + GameConstant.SHOT_SIZE.y
        };
    }
    render(){
        const style = {
            width: `${GameConstant.SHOT_SIZE.x}px`,
            height: `${GameConstant.SHOT_SIZE.y}px`,
            backgroundColor: "red",
            position: "absolute",
            left: this.state.position.x,
            top: this.state.position.y,
            transform: `rotate(${this.state.orientation}deg)`
        };

        return (
            <div ref="myself" style={style}></div>
        )
    }
}

shot.contextTypes = {
    subscribeLoop: PropTypes.func,
    unsubscribeLoop: PropTypes.func,
    levelLimit: PropTypes.object,
    destroyshot: PropTypes.func
}

shot.propTypes = {
    position: PropTypes.object.isRequired,
    orientation: PropTypes.number.isRequired,
    shotId: PropTypes.number.isRequired
}

export default shot;
