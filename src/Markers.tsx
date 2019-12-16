import React, { CSSProperties } from 'react';
import './Markers.css';

interface IProps {

    sprite: any;
    imageUrl: string;
    markerSelected: any;
}

interface IState {

    selectedMarker: string;
}

export default class Markers extends React.Component <IProps,IState> {

  constructor(props: IProps) {

    super(props);

    this.state = {selectedMarker: ''};
  }

  componentDidUpdate() {

    console.log(this.props.imageUrl);
  }

  selectMarker(key: string) {

    this.setState({selectedMarker:key});

    this.props.markerSelected(key);
  }

  getSprite(key: string): any {

    const marker: boolean = ("marker" in this.props.sprite[key]);

    if (!marker)
        return;

    const xRatio = 36.0/this.props.sprite[key].width;
    const yRatio = 36.0/this.props.sprite[key].height;

    const ratio = (xRatio <= yRatio)?xRatio:yRatio;

    const topStyle: CSSProperties = {

        width: ''+(this.props.sprite[key].width*ratio)+'px',
        height: ''+(this.props.sprite[key].height*ratio)+'px',
        padding: '3px',
        border: (this.state.selectedMarker === key)?'1px solid aquamarine':'1px solid #282830'
    };

    const style: CSSProperties = {

        width: ''+this.props.sprite[key].width+'px',
        height: ''+this.props.sprite[key].height+'px',
        backgroundImage: "url('"+this.props.imageUrl+"')",
        backgroundPosition: ''+(-this.props.sprite[key].x)+'px '+(-this.props.sprite[key].y)+'px',
        transform: 'scale('+ratio+')',
        transformOrigin: '0 0'
    };

    const handleClick: any = () => { this.selectMarker(key) };
    
    return (<div id={key} title={key} style={topStyle} onClick={handleClick}><div style={style}></div></div>);
  }

  getSprites(): any {

    if (this.props.sprite) {

        return Object.keys(this.props.sprite).map(key => this.getSprite(key));
    }
  }
  
  render() {

    if (this.state.selectedMarker == '') {

        if (this.props.sprite) {
            this.selectMarker(Object.keys(this.props.sprite)[0]);
        }
        //console.log(this.props.sprite);
    }

    return (
      <div className="Markers">
        {this.getSprites()}
      </div>
    );
  }
}

