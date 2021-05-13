import React from 'react'
import '../assets/css/calculator.css'
import buttons from '../assets/json/buttons.json'
import $ from 'jquery'


export default class Calculator extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state=
        {
            currentValue:[],
            result:[],
            state:'normal'
        }
    }
    componentDidMount()
    {
        const btns=document.querySelectorAll('.btn');
        btns.forEach(btn=>{
            btn.addEventListener('click',this.handleBtn)
        });
        this.display();
    }

    handleBtn=(e)=>
    {
        const data=JSON.parse(e.target.getAttribute('data'))
        switch(data.type)
        {
            case 'clear' :
            this.clearAll(data);
            break;
            case 'command' :
            this.addCommand(data);
            break;
            case 'number' :
            this.addNumber(data);
            break;            
            case 'decimal' :
            this.addDecimal(data);
            break;
            case 'result' :
            this.calculate(data);
            break; 
            default :
            this.display();
        }        
    }

    display=()=>
    {        
        let current=0;
        let result=0;
        if(this.state.currentValue.length!==0)
        {
            current='';
            result='';        
            this.state.currentValue.forEach(data=>{
                current+=data.content
            });           
        }
        this.state.result.forEach(data=>{
            if(data.type==='result')
            {data.content='='+data.content}
            result+=data.content
        });
        $('.current').html(current)
        $('.result').html(result)
    }

    calculate=()=>
    {
        if(this.state.state==='result')return false;        
        let formula='';
        let result=[...this.state.result];
        this.state.result.forEach(data=>{
            formula+=data.content
        });
        let total=eval(formula)
        let current={content:total,type:'result'}
        result=result.concat(current)
        this.setState({
            result:result,
            currentValue:[current],
            state:'result'
        })
        this.display();
    }

    clearAll=()=>
    {
        this.setState({
            result:[],
            currentValue:[],
            state:'normal'
        })
        this.display();
    }

    addCommand=(data)=>
    {
        let result=[...this.state.result];
        let current=[data];
        let state=this.state.state;
        if(this.state.state==='result')
        {
            let newValue=this.state.currentValue[0];
            newValue.type='number';
            newValue.content=newValue.content.replace('=','');
            result=[newValue];          
            state='normal';
        }
        if(!result[result.length-1] && data.content!=='-'){return false;}        
        if(result[result.length-1]&&result[result.length-1].type==='command')
        {
            
            if(data.content==='-' && result[result.length-1].content!=='-')
            {result=result.concat(data);}
            else if(data.content==='-' && result[result.length-1].content==='-')
            {result[result.length-1]=data;}
            else 
            {
                if(result[result.length-2]&&result[result.length-2].type==='command')
                {
                    result.pop()
                    result[result.length-1]=data;                    
                }
                else 
                {
                    result[result.length-1]=data;                    
                }
            }
        }
        else 
        {
            result=result.concat(data)           
        }    
        this.setState({
            result:result,
            currentValue:current,
            state:state
        })
        this.display();
    }

    addNumber=(data)=>
    {
        let current=[...this.state.currentValue];
        let result=[...this.state.result];
        let state=this.state.state;
        if(this.state.state==='result'){result=[]; current=[]; state='normal';}
        if(current[current.length-1] && current[current.length-1].type==='command')current=[];
        if(!current[current.length-1] && data.content==='0')return false;
        this.setState({
            currentValue:current.concat(data),
            result:result.concat(data),
            state:state
        });
        this.display();
    }

    addDecimal=(data)=>
    {        
        let current=[...this.state.currentValue];
        let result=[...this.state.result];
        if(!current[current.length-1] || current[current.length-1].type==='command' || this.state.state==='result')
        {
            current[0]={content:'0',type:'number'}
            result=result.concat(current)
        }
        let add=true;
        current.forEach(val=>{
            if(val.content==='.')add=false;
        })
        if(add===true)
        {
            this.setState({
                currentValue:current.concat(data),
                result:result.concat(data)
            });
        }
        this.display();
    }

    render()
    {
        return(
            <div id="calculator">
                <div id="display-container">
                    <div className="result"></div>
                    <div id="display" className="current"></div>
                </div>
                <div id="buttons">
                    <div id="row-one">
                        {
                            buttons.row_one.map((btn,key)=>{
                                return <div key={key} id={btn.id} data={JSON.stringify(btn)} className={"btn "+btn.size+" "+btn.class}>
                                <span className="btn-val">{btn.content}</span>
                            </div>
                            })
                        }
                    </div>
                    <div id="row-two">
                            <div id="col-one">
                                {
                                    buttons.col_one.map((btn,key)=>{
                                        return <div key={key} id={btn.id} data={JSON.stringify(btn)} className={"btn "+btn.size+" "+btn.class}>
                                        <span className="btn-val">{btn.content}</span>
                                    </div>
                                    })
                                }
                            </div>
                            <div id="col-two">
                                {
                                    buttons.col_two.map((btn,key)=>{
                                        return <div key={key} id={btn.id} data={JSON.stringify(btn)} className={"btn "+btn.size+" "+btn.class}>
                                                <span className="btn-val">{btn.content}</span>
                                            </div>
                                    })
                                }
                            </div>
                    </div>

                </div>
            </div>
        )
    }
}
