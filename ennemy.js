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
        this.setState({
            position: this.getStartingPosition()
        });
    }
    @autobind
    getBoundingRectangle(){
        return {
            x: this.state.position.x,
            x1: this.state.position.x + GameConstant.ENNEMY_SIZE.x,
            y: this.state.position.y,
            y1: this.state.position.y + GameConstant.ENNEMY_SIZE.y,
        }
    }
    @autobind
    getStartingPosition(){
        // Get a random position inside levelLimit
        let position;

        do{
            position = {
               x: Math.floor(Math.random() * (this.context.levelLimit.x - 0 + 1)),
               y: Math.floor(Math.random() * (this.context.levelLimit.y - 0 + 1))
           };
        }while(!this.checkNextPositionIsAvailable(position.x, position.y));

        return position;
    }
    @autobind
    update(){
        let newX = this.getNextPosition("x"),
            newY = this.getNextPosition("y");

        if(this.checkNextPositionIsAvailable(newX, newY)){
            this.setState({
                position: {
                    x: newX,
                    y: newY
                }
            });
        }else{
            // Get remaining distance to the wall and move toward it
            const   rect = this.getBoundingRectangle(),
                    diffX = this.context.levelLimit.x - rect.x1,
                    diffY = this.context.levelLimit.y - rect.y1;

            this.setState({
                position: {
                    x: this.state.position.x + diffX,
                    y: this.state.position.y + diffY
                }
            });
        }
    }
    @autobind
    getNextPosition(direction){
        // Return next position according to direction and ENNEMY_SPEED
        if(direction === "x"){
            return this.state.position.x + GameConstant.ENNEMY_SPEED.x;
        }else if(direction === "y"){
            return this.state.position.y + GameConstant.ENNEMY_SPEED.y;
        }
    }
    @autobind
    checkNextPositionIsAvailable(x, y){
        // check top left corner
        if(x + GameConstant.ENNEMY_SIZE.x > this.context.levelLimit.x){
            return false;
        }

        // check bottom corner
        if(y + GameConstant.ENNEMY_SIZE.y > this.context.levelLimit.y){
            return false;
        }

        return true;
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
    levelLimit: PropTypes.object
};

export default Ennemy;
