import React from "react";

export default class ClassComponent extends React.Component {
    constructor() {
        super();
        this.state = { color: "red", count: 0 };
    }

    componentDidMount(){
        
    }


    render() {
        return <>
            <h2>This is a habitual ground</h2>
            <button>Submit</button>
        </>
    }
}