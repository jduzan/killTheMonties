import React from "react";
import PropTypes from 'prop-types';
import autobind from "autobind-decorator";
import * as GameConstant from "./gameVar";
import {clone, checkCollision} from "./utils"

class Shoot extends React.Component{
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
            orientation: this.getAngle()
        });
    }
    componentWillUnmount(){
        this.context.unsubscribeLoop(this.loopId);
    }
    @autobind
    destroy(){
        this.context.destroyShoot(this.props.shootId);
    }
    @autobind
    update(){
        let position = clone(this.state.position);
        position.x += GameConstant.SHOOT_SPEED.x;
        position.y += GameConstant.SHOOT_SPEED.y;

        if(!checkCollision(this.getBoundingRectangle(), this.context.levelLimit)){
            return this.destroy();
        }

        this.setState({
            position: position
        });
    }
    @autobind
    getAngle(mousePosition){
        // compute orientation with starting orientation
        const center = this.getCenter();
        const radians = Math.atan2(this.props.orientation.x - center.x, this.props.orientation.y - center.y);

        return Math.floor((radians * (180 / Math.PI) * -1) + 180);
    }
    @autobind
    getCenter(){
        return {
            x: this.state.position.x + GameConstant.SHOOT_SIZE.x / 2,
            y: this.state.position.y + GameConstant.SHOOT_SIZE.y / 2
        }
    }
    @autobind
    getBoundingRectangle(){
        return {
            x: clone(this.state.position.x),
            x1: clone(this.state.position.x) + GameConstant.SHOOT_SIZE.x,
            y: clone(this.state.position.y),
            y1: clone(this.state.position.y) + GameConstant.SHOOT_SIZE.y
        };
    }
    render(){
        const style = {
            width: `${GameConstant.SHOOT_SIZE.x}px`,
            height: `${GameConstant.SHOOT_SIZE.y}px`,
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

Shoot.contextTypes = {
    subscribeLoop: PropTypes.func,
    unsubscribeLoop: PropTypes.func,
    levelLimit: PropTypes.object,
    destroyShoot: PropTypes.func
}

Shoot.propTypes = {
    position: PropTypes.object.isRequired,
    orientation: PropTypes.object.isRequired,
    shootId: PropTypes.number.isRequired
}

export default Shoot;
