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
            },
            direction: {
                left: false,
                top: false,
                right: false,
                bottom: false
            }
        };
    }
    componentDidMount(){
        this.loopId = this.context.subscribeLoop(this.update);
        this.setState({
            position: this.getStartingPosition(),
            direction: this.getStartingDirection()
        });
    }
    componentWillUnmount(){
        this.context.unsubscribeLoop(this.loopId);
    }
    @autobind
    getBoundingRectangle(x, y){
        const   boundingX = x || this.state.position.x,
                boundingY = y || this.state.position.y

        return {
            x: boundingX,
            x1: boundingX + GameConstant.ENNEMY_SIZE.x,
            y: boundingY,
            y1: boundingY + GameConstant.ENNEMY_SIZE.y,
        }
    }
    @autobind
    getStartingDirection(){
        // Get a random direction
        let direction = {
            left: false,
            top: false,
            right: false,
            bottom: false
        };

        if(Math.floor(Math.random() * Math.floor(10) >= 5)){
            direction.left = true;
            direction.right = false;
        }else{
            direction.left = false;
            direction.right = true;
        }

        if(Math.floor(Math.random() * Math.floor(10) >= 5)){
            direction.top = true;
            direction.bottom = false;
        }else{
            direction.top = false;
            direction.bottom = true;
        }

        return direction;
    }
    @autobind
    getStartingPosition(){
        // Get a random position inside levelLimit
        let position = {},
            rect;

        do{
            position.x = Math.floor(Math.random() * (this.context.levelLimit.x1 - this.context.levelLimit.x + 1));
            rect = this.getBoundingRectangle(position.x, 0);
        }while(!this.context.checkPositionIsAvailable("x", rect));

        do{
            position.y = Math.floor(Math.random() * (this.context.levelLimit.y1 - this.context.levelLimit.y + 1));
            rect = this.getBoundingRectangle(position.x, position.y);
        }while(!this.context.checkPositionIsAvailable("y", rect)) ;

        return position;
    }
    @autobind
    update(){
        const   rect = this.getBoundingRectangle(),
                newX = this.getNextPosition("x"),
                newY = this.getNextPosition("y"),
                newRect = this.getBoundingRectangle(newX, newY);

        let newPosition = {
            x: null,
            y: null
        };

        let newDirection = JSON.parse(JSON.stringify(this.state.direction));

        if(this.context.checkPositionIsAvailable("x", newRect)){
            newPosition.x = newX;
        }else{
            if(this.state.direction.left){
                const diffX = rect.x - this.context.levelLimit.x
                newPosition.x = this.state.position.x - diffX;

                if(newPosition.x >= this.context.levelLimit.x1){
                    newPosition.x = this.context.levelLimit.x1;
                }

                newDirection.left = false;
                newDirection.right = true;
            }else{
                const diffX = this.context.levelLimit.x1 - rect.x1;
                newPosition.x = this.state.position.x + diffX;

                if(newPosition.x <= this.context.levelLimit.x){
                    newPosition.x = this.context.levelLimit.x;
                }

                newDirection.left = true;
                newDirection.right = false;
            }
        }

        if(this.context.checkPositionIsAvailable("y", newRect)){
            newPosition.y = newY;
        }else{
            if(this.state.direction.bottom){
                const diffY = rect.y - this.context.levelLimit.y1;
                newPosition.y = this.state.position.y - diffY;

                if(newPosition.y >= this.context.levelLimit.y1){
                    newPosition.y = this.context.levelLimit.y1 - GameConstant.ENNEMY_SIZE.y;
                }

                newDirection.bottom = false;
                newDirection.top = true;
            }else{
                const diffY = this.context.levelLimit.y - rect.y;
                newPosition.y = this.state.position.y + diffY;

                if(newPosition.y <= this.context.levelLimit.y){
                    newPosition.y = this.context.levelLimit.y;
                }

                newDirection.bottom = true;
                newDirection.top = false;
            }
        }

        this.setState({
            position: newPosition,
            direction: newDirection
        });
    }
    @autobind
    getNextPosition(axe){
        // Return next position according to direction and ENNEMY_SPEED
        if(axe === "x"){
            if(this.state.direction.left){
                return this.state.position.x - GameConstant.ENNEMY_SPEED.x;
            }else{
                return this.state.position.x + GameConstant.ENNEMY_SPEED.x;
            }
        }else if(axe === "y"){
            if(this.state.direction.top){
                return this.state.position.y - GameConstant.ENNEMY_SPEED.y;
            }else{
                return this.state.position.y + GameConstant.ENNEMY_SPEED.y;
            }
        }
    }
    render(){
        const style = {
            width: `${GameConstant.ENNEMY_SIZE.x}px`,
            height: `${GameConstant.ENNEMY_SIZE.y}px`,
            background: "red",
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
    levelLimit: PropTypes.object,
    checkPositionIsAvailable: PropTypes.func
};

export default Ennemy;
