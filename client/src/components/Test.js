import React, { Component } from 'react'
import ReactDom from 'react-dom';
import axios from 'axios'

class Nav extends React.Component{
    constructor(){
        super();
        this.state = {
            arr: {}
        };
        this.get = this.get.bind(this);
    }
    get(){
        axios.get('/test').then((res)=>{
            console.log(res.data);

            for (var i = 0; i <=res.data.length-1; i++) {
                console.log(res.data[i][0])
            }
            
            
        }).catch((err)=>{
            console.log(err.status);
        })
    }
    render(){
        return <div>
            <input type="button" value="Test" onClick={this.get}/>
       

        </div>

        
    }
}





export default Nav