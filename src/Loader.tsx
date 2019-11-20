import React from 'react';
import './Loader.css';

interface IProps {

    loadHandler: any;
    closeHandler: any;
}

interface IState {

    styleUrl: string;
}

export default class Loader extends React.Component <IProps,IState> {

    constructor(props: IProps) {

        super(props);

        this.state = {styleUrl: 'http://127.0.0.1:7777/lesarcs/style_lesarcs.json'};

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }

    onChange(event: any) {

        this.setState({styleUrl: event.target.value});
    }

    onCancel() {

        this.props.closeHandler();
    }

    onLoad(e: any) {

        this.props.loadHandler(this.state.styleUrl);
    }

    render() {
        return (
            <div className="Loader">
                <input id="styleUrl" type="text" placeholder="Map style url" value={this.state.styleUrl} onChange={this.onChange}></input>
                <button onClick={this.onCancel}>Cancel</button>
                <button onClick={this.onLoad}>Load</button>
            </div>
        );
    }
}