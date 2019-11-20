import React, { CSSProperties } from 'react';
import './Menu.css';

interface IProps {

    sprite: any;
    imageUrl: string;
}

interface IState {

}

export default class Menu extends React.Component <IProps,IState> {

  constructor(props: IProps) {

    super(props);
  }

  componentDidUpdate() {

    console.log(this.props.imageUrl);
  }

  getSprite(key: string): any {

    const marker: boolean = ("marker" in this.props.sprite[key]);

    if (!marker)
        return;

    const xRatio = 50.0/this.props.sprite[key].width;
    const yRatio = 50.0/this.props.sprite[key].height;

    const ratio = (xRatio <= yRatio)?xRatio:yRatio;

    const topStyle: CSSProperties = {

        width: ''+(this.props.sprite[key].width*ratio)+'px',
        height: ''+(this.props.sprite[key].height*ratio)+'px',
        margin: '2px',
        padding: '1px',
        border: '1px solid aquamarine'
    };

    const style: CSSProperties = {

        width: ''+this.props.sprite[key].width+'px',
        height: ''+this.props.sprite[key].height+'px',
        backgroundImage: "url('"+this.props.imageUrl+"')",
        backgroundPosition: ''+(-this.props.sprite[key].x)+'px '+(-this.props.sprite[key].y)+'px',
        transform: 'scale('+ratio+')',
        transformOrigin: '0 0'
    };
    
    return (<div title={key} style={topStyle}><div style={style}></div></div>);
  }

  getSprites(): any {

    if (this.props.sprite) {

        return Object.keys(this.props.sprite).map(key => this.getSprite(key));
    }
  }
  
  render() {
    return (
      <div className="Menu">
        {this.getSprites()}
      </div>
    );
  }
}

