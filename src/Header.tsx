import React from 'react';
import './Header.css'

interface IProps {

    styleName: string;
}

interface IState {
}

export default class Header extends React.Component <IProps,IState> {

    constructor(props: IProps) {

        super(props);
    }

    render() {
        return (
            <div className="Header">
                
                <div className="headerTitle"><div>me & maps editor</div><div className="headerVersion">v0.01</div></div>
                <div className="styleName">{this.props.styleName}</div>
            </div>
          );
    }
}

