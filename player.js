import React from "react";
import PropTypes from 'prop-types';
import autobind from "autobind-decorator";
import * as GameConstant from "./gameVar";
import {EVENT_TYPE} from "./events";
import {clone} from "./utils"

class Player extends React.Component{
    constructor(){
        super();
        this.state = {
            position: {
                x: 0,
                y: 0
            },
            orientation: 0
        };

        this.movement = {
            x: 0,
            y: 0
        };
        this.direction = {
            left: false,
            right: false,
            top: false,
            bottom: false
        };
        this.orientation = {
            x: 0,
            y: 0
        };
        this.fireShoot = false;
    }
    componentDidMount(){
        this.loopId = this.context.subscribeLoop(this.update);
        this.keyEventId = this.context.subscribeEvents(EVENT_TYPE.key, this.onKeyEvent);
        this.mouseEventId = this.context.subscribeEvents(EVENT_TYPE.mouse, this.onMouseEvent);
    }
    componentWillUnmount(){
        this.context.unsubscribeLoop(this.loopId);
        this.context.unsubcribeEvents(this.keyEventId);
    }
    @autobind
    onMouseEvent(mouse){
        this.orientation = {
            x: mouse.position.x,
            y: mouse.position.y
        };

        if(mouse.leftClick){
            this.fireShoot = true;
        }else{
            this.fireShoot = false;
        }
    }
    @autobind
    onKeyEvent(keyState){
        let newMovement = {
            x: 0,
            y: 0
        },
        newDirection = clone(this.direction);

        if(keyState["KeyW"] === true){
            newMovement.y -= GameConstant.PLAYER_SPEED.y;
            newDirection.top = true;
            newDirection.bottom = false;
        }

        if(keyState["KeyS"] === true){
            newMovement.y += GameConstant.PLAYER_SPEED.y;
            newDirection.top = false;
            newDirection.bottom = true;
        }

        if(keyState["KeyA"] === true){
            newMovement.x -= GameConstant.PLAYER_SPEED.x;
            newDirection.left = true;
            newDirection.right = false;
        }

        if(keyState["KeyD"] === true){
            newMovement.x += GameConstant.PLAYER_SPEED.x
            newDirection.left = false;
            newDirection.right = true;
        }

        this.movement = newMovement;
        this.direction = newDirection;
    }
    @autobind
    getBoundingRectangle(x, y){
        const   boundingX = x || clone(this.state.position.x),
                boundingY = y || clone(this.state.position.y)

        return {
            x: boundingX,
            x1: boundingX + GameConstant.PLAYER_SIZE.x,
            y: boundingY,
            y1: boundingY + GameConstant.PLAYER_SIZE.y,
        }
    }
    @autobind
    update(){
        let newPosition = clone(this.state.position),
            newOrientation = clone(this.state.orientation);

        if(this.fireShoot){
            console.log("fire shoot")
            this.context.createShoot(this.getCenter(), this.orientation);
        }

        // Position
        if(this.movement.x != 0 || this.movement.y != 0){
            let newMovement = {
                x: 0,
                y: 0
            };
            newPosition.x += this.movement.x;
            newPosition.y += this.movement.y;

            const   newRect = this.getBoundingRectangle(newPosition.x, newPosition.y),
                    rect = this.getBoundingRectangle();

            if(!this.context.checkPositionIsAvailable("x", newRect)){
                if(this.direction.right){
                    const diffX = this.context.levelLimit.x1 - rect.x1;
                    newPosition.x = this.state.position.x + diffX;

                    if(newPosition.x <= this.context.levelLimit.x){
                        newPosition.x = this.context.levelLimit.x;
                    }
                }else{
                    const diffX = rect.x - this.context.levelLimit.x1;
                    newPosition.x = this.state.position.x + diffX;

                    if(newPosition.x <= this.context.levelLimit.x){
                        newPosition.x = this.context.levelLimit.x;
                    }
                }
            }

            if(!this.context.checkPositionIsAvailable("y", newRect)){
                if(this.direction.bottom){
                    const diffY = this.context.levelLimit.y1 - rect.y1;
                    newPosition.y = this.state.position.y + diffY;

                    if(newPosition.y <= this.context.levelLimit.y){
                        newPosition.y = this.context.levelLimit.y;
                    }
                }else{
                    const diffY = rect.y - this.context.levelLimit.y1;
                    newPosition.y = this.state.position.y + diffY;

                    if(newPosition.y <= this.context.levelLimit.y){
                        newPosition.y = this.context.levelLimit.y;
                    }
                }
            }
        }

        this.setState({
            position: newPosition,
            orientation: this.getMouseAngle(this.orientation)
        });
    }
    @autobind
    getMouseAngle(mousePosition){
        // compute player orientation based on mouse direction
        const   center = this.getCenter();
        const radians = Math.atan2(mousePosition.x - center.x, mousePosition.y - center.y);

        return Math.floor((radians * (180 / Math.PI) * -1) + 180);
    }
    @autobind
    getCenter(){
        return {
            x: this.state.position.x + GameConstant.PLAYER_SIZE.x / 2,
            y: this.state.position.y + GameConstant.PLAYER_SIZE.y / 2
        }
    }
    render(){
        const style = {
            width: `${GameConstant.PLAYER_SIZE.x}px`,
            height: `${GameConstant.PLAYER_SIZE.x}px`,
            background: "red",
            position: "absolute",
            left: this.state.position.x,
            top: this.state.position.y,
            transform: `rotate(${this.state.orientation}deg)`
        };

        const tipStyle = {
            position: "absolute",
            top: 0,
            left: `${GameConstant.PLAYER_SIZE.x / 2 - 10}px`,
            width: "20px",
            height: `${GameConstant.PLAYER_SIZE.y / 2}px`,
            background: "green"
        };

        return (
            <div style={style}>
                <div style={tipStyle}></div>
            </div>
        )
    }
}

Player.contextTypes = {
    checkPositionIsAvailable: PropTypes.func,
    subscribeLoop: PropTypes.func,
    unsubscribeLoop: PropTypes.func,
    levelLimit: PropTypes.object,
    subscribeEvents: PropTypes.func,
    unsubcribeEvents: PropTypes.func,
    createShoot: PropTypes.func
};

export default Player;
