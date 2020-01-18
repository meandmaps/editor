/* MIT License

Copyright (c) 2019 Benoit Baudaux

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React from 'react';
import './App.css';

import Header from './Header';
import LeftPanel from './LeftPanel';
import Map from './Map';
import Loader from './Loader';
import PoiEditor from './PoiEditor';
import Menu from './Menu';

interface IProps {

}

interface IState {

}

export default class App extends React.Component <IProps,IState> {

  constructor(props: IProps) {

    super(props);

    this.state = {

    };
  }
  
  render() {
    return (
      <div className="App">
        <Header />
        <LeftPanel />
        <Map />
        <PoiEditor />
        <Menu />
        <Loader />
      </div>
    );
  }
}

