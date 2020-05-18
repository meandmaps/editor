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

import React, { CSSProperties } from 'react';
import { connect } from 'react-redux'

import { Poi, Photo } from './PoiReducerTypes';

import { RootState } from './RootReducer';
import { clearStyle, closeMenu } from './StyleReducerActions';
import { clearPoi, addPoi } from './PoiReducerActions';

import './Menu.css';

import mapboxgl from 'mapbox-gl';

declare var zip: any;
var XMLParser = require('react-xml-parser');

interface IProps {

}

interface StateProps {

    poiList: Poi[];
    styleName: string;
    menuOpened: boolean;
    selectedMarker: string;
}

interface DispatchProps {

    addPoi: (newPoi: Poi) => void,
    closeMenu: () => void;
    clearStyle: () => void;
    clearPoi: () => void;
}

interface IState {

    importOpened: boolean;
    confirmationNewOpened: boolean;
    confirmationPublishOpened: boolean;
    poiUrl: string;
    email: string;
}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    return {
        poiList: state.poi.poiList,
        styleName: state.style.styleName,
        menuOpened: state.style.menuOpened,
        selectedMarker: state.style.selectedMarker,
    };
}

const mapDispatchToProps = {
  
    addPoi,
    closeMenu,
    clearStyle,
    clearPoi,
  };
  
class Menu extends React.Component <Props,IState> {

  private inputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props) {

    super(props);

    this.onClose = this.onClose.bind(this);
    this.onNew = this.onNew.bind(this);
    this.onExportGeojson = this.onExportGeojson.bind(this);
    this.onExportKml = this.onExportKml.bind(this);
    this.onImport = this.onImport.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onLocalLoad = this.onLocalLoad.bind(this);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.loadKml = this.loadKml.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onConfirmYes = this.onConfirmYes.bind(this);
    this.onConfirmNo = this.onConfirmNo.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPublish = this.onPublish.bind(this);
    this.onConfirmPublish = this.onConfirmPublish.bind(this);

    this.state = {
      importOpened: false,
      confirmationNewOpened: false,
      confirmationPublishOpened: false,
      poiUrl: "",
      email: "",
    };
  }

  componentDidUpdate() {
      
  }

  onClose() {

    this.setState({ confirmationNewOpened: false });
    this.setState({ confirmationPublishOpened: false });

    this.props.closeMenu();
  }

  onNew(e: any) {

    e.stopPropagation();

    this.setState({ confirmationNewOpened: true });
  }

  onConfirmYes() {

    this.props.clearStyle();
    this.props.clearPoi();

    this.onClose();
  }

  onConfirmNo() {

    this.onClose();
  }

  createGeojson() {

    let geojson: any = {
        type: 'FeatureCollection',
        features: new Array()
    };

    for (let poi of this.props.poiList) {

        let feature: any = {

            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [poi.lngLat.lng,poi.lngLat.lat]
            },
            'properties': {
                'icon': poi.symbol,
                'icon-size': poi.symbolSize,
                'ref': poi.ref,
                'photos': poi.photos,
                'metadata': poi.metadata,
            }
        };
        
        geojson.features.push(feature);
    }
    
    return geojson;
  }

  onEmailChange(e: any) {

    this.setState({email: e.target.value});
  }

  onPublish(e: any) {

    e.stopPropagation();

    this.setState({ confirmationPublishOpened: true });
  }

  onConfirmPublish() {

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.open("post", "publish.php?email="+encodeURIComponent(this.state.email)+"&map="+encodeURIComponent(this.props.styleName), true);

    xmlhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");

    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

          console.log("Publish request sent");
        }
    };

    xmlhttp.send(JSON.stringify(this.createGeojson()));

    this.onClose();
  }

  onExportGeojson() {

    this.download(this.props.styleName+' POI.geojson',JSON.stringify(this.createGeojson()));
  }

  onExportKml() {

    let kml: string = "";

    kml += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    kml += "<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n";
    kml += "<Document>\n";
    kml += "<name>"+this.props.styleName+"</name>\n";

    for (let poi of this.props.poiList) {

      kml += "<Placemark>\n";
      kml += "\t<name>"+poi.metadata[0].title+"</name>\n";
      kml += "\t<description>"+poi.metadata[0].desc+"</description>\n";
      kml += "\t<Point>\n";
      kml += "\t\t<coordinates>"+poi.lngLat.lng+","+poi.lngLat.lat+",0</coordinates>\n";
      kml += "\t</Point>\n";
      kml += "</Placemark>\n";
    }

    kml += "</Document>\n";
    kml += "</kml>";

    this.download(this.props.styleName+' POI.kml',kml);
  }

  onImport(e: any) {

    e.stopPropagation();

    this.setState({ importOpened: !this.state.importOpened });
  }

  onChange(e: any) {

    this.setState({poiUrl: e.target.value});
  }

  validURL(str: string) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  loadFile(src: string, type: string, callback: (data: string) => void) {

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.open("get", src, true);

    if (type == 'blob')
      xmlhttp.responseType = 'blob';

    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

          if (type == 'text') {
            callback(this.responseText);
          }
          else if (type == 'blob') {

            callback(this.response);
          }
        }
    };

    xmlhttp.send();
  }

  onKeyUp(e: any) {

    if (e.keyCode === 13) {
      
      e.preventDefault();

      if (1/*this.validURL(this.state.poiUrl)*/) {

        const _this = this;

        if (this.state.poiUrl.indexOf(".geojson") > 0) {

          this.loadFile(this.state.poiUrl, 'text', function(file) {

            const geojson = JSON.parse(file);
            
            _this.loadGeojson(geojson);

            _this.onClose();

          });
        }
        else if (this.state.poiUrl.indexOf(".kml") > 0) {

          this.loadFile(this.state.poiUrl, 'text', function(file) {

            _this.loadKml(file);

            _this.onClose();

          });
        }
        else if (this.state.poiUrl.indexOf(".kmz") > 0) {

          this.loadFile(this.state.poiUrl, 'blob', function(file) {
          
            // use a BlobReader to read the zip from a Blob object
            zip.createReader(new zip.BlobReader(file), function(reader: any) {

              // get all entries from the zip
              reader.getEntries(function(entries: any) {

                for (const entry of entries) {

                  if (entry.filename.indexOf(".kml") > 0) {

                    //console.log(entry);

                    // get first entry content as text
                    entry.getData(new zip.TextWriter(), function(text: string) {
                      
                      // text contains the entry data as a String
                      //console.log(text);
                      _this.loadKml(text);

                      // close the zip reader
                      reader.close(function() {
                        // onclose callback
                      });

                    }, function(current: any, total: any) {
                      // onprogress callback
                    });
                  }
                }

                _this.onClose();

              });
            }, function(error: any) {
              // onerror callback

              console.log('onerror: '+error);

            });
          });
        }
      }
    }
  }

  loadGeojson(geojson: any) {

    let ref: number;
    let _ref: number = Date.now();

    for (let feature of geojson.features) {

      let metadata = [];
      let icon: string;
      let icon_size: number;
      let photos: Array<Photo>;

      if ("#Style" in feature.properties) {

        _ref += 1;
        ref = _ref;

        metadata.push({lang:"fr", title:feature.properties["#Name"], desc:"", link: "", linkLabel: ""});

        icon = feature.properties["#Style"];

        const regex1 = /\s/g;

        icon = icon.replace(regex1, '_').toLowerCase();
        icon = icon.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        icon_size = 0.5;

        photos = new Array<Photo>();
      }
      else {

        icon = feature.properties["icon"];
        icon_size = feature.properties["icon-size"];

        metadata = Object.assign([], feature.properties["metadata"]);

        ref = feature.properties["ref"];

        photos = Object.assign([], feature.properties["photos"]);
      }

      const poi: Poi = {
          ref: ref,
          metadata: metadata,
          photos: photos,
          lngLat: new mapboxgl.LngLat(feature.geometry.coordinates[0],feature.geometry.coordinates[1]),
          symbol: icon,
          symbolSize: icon_size,
      };

      this.props.addPoi(poi);
    }
  }

  loadKml(kml: string) {

    const regex = /CDATA/g; //<![CDATA[<h3>$[name]</h3>]]>
    const coordRegex = new RegExp("([.0-9-]+),([.0-9-]+),(.*)");

    const kml2 = kml.replace(regex, ' ');

    var xml = new XMLParser().parseFromString(kml2);

    let ref: number = Date.now();

    for (const place of xml.getElementsByTagName('Placemark')) {

      let name: string = "";
      let description: string = "";

      let names = place.getElementsByTagName('name');

      if (names  && (names.length > 0))
        name =  names[0].value;

      let descriptions = place.getElementsByTagName('description');

      if (descriptions  && (descriptions.length > 0))
        description =  descriptions[0].value;

      let coordinates = place.getElementsByTagName('coordinates');

      if (coordinates  && (coordinates.length > 0)) {

        let res = coordinates[0].value.match(coordRegex);

        if (res && (res.length > 2)) {

          ref += 1;

          const poi: Poi = {
              ref:ref,
              metadata: [{lang: "fr", title: name, desc: description, link: "", linkLabel: ""}],
              photos: [],
              lngLat: new mapboxgl.LngLat(parseFloat(res[1]),parseFloat(res[2])),
              symbol: this.props.selectedMarker,
              symbolSize: 0.5
          };

          this.props.addPoi(poi);
        }
      }
    }
  }

  onFileSelected(e: any) {

    let file = e.target.files[0];

    if (!file) {

      return;
    }

    const _this = this;

    if (e.target.files[0].name.indexOf(".geojson") > 0) {

      var reader = new FileReader();

      reader.onload = function(event: any) {

        if (event && event.target) {

          const geojson = JSON.parse(event.target.result);
        
          _this.loadGeojson(geojson);

          _this.onClose();
        }
      };

      reader.readAsText(file);
    }
    else if (e.target.files[0].name.indexOf(".kml") > 0) {

      var reader = new FileReader();

      reader.onload = function(event: any) {

        if (event && event.target) {

          _this.loadKml(event.target.result);

          _this.onClose();
        }
      };

      reader.readAsText(file);
    }
    else if (e.target.files[0].name.indexOf(".kmz") > 0) {

      const _this = this;
      
      // use a BlobReader to read the zip from a Blob object
      zip.createReader(new zip.BlobReader(e.target.files[0]), function(reader: any) {

        // get all entries from the zip
        reader.getEntries(function(entries: any) {

          for (const entry of entries) {

            if (entry.filename.indexOf(".kml") > 0) {

              //console.log(entry);

              // get first entry content as text
              entry.getData(new zip.TextWriter(), function(text: string) {
                
                // text contains the entry data as a String
                //console.log(text);
                _this.loadKml(text);

                // close the zip reader
                reader.close(function() {
                  // onclose callback
                });

              }, function(current: any, total: any) {
                // onprogress callback
              });
            }
          }

          _this.onClose();

        });
      }, function(error: any) {
        // onerror callback

        console.log('onerror: '+error);

      });
    }
  }

  onLocalLoad(e: any) {

    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.click();

      this.inputRef.current.addEventListener('change', this.onFileSelected, false);
    }
  }

  importMenu() {

    if (this.state.importOpened) {

      return (<div id="importBox"><input id="poiUrl" type="text" placeholder="Type url and press the <Enter> key" value={this.state.poiUrl} onChange={this.onChange} onClick={e => {e.stopPropagation()}} onKeyUp={this.onKeyUp} ></input><div>OR</div><button onClick={this.onLocalLoad}>Load local file</button><input ref={this.inputRef} id="fileInput" accept=".geojson, .kmz, .kml" type="file" name="name"/></div>);
    }
  }

  download(filename: string, filecontent: string) {
    
    let element = document.createElement('a');

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(filecontent));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  render() {

    if (this.props.menuOpened == false)
        return null;

    if (this.state.confirmationNewOpened) {

      return (
        <div className="Menu" onClick={this.onClose}>

          <div onClick={(e) => {e.stopPropagation();}}>

            <div id="confirmation">

              <span style={{position: 'absolute', left: 'calc(50% - 50px)', fontWeight: 'bold', fontSize: '20px'}}>Warning !</span><br/><br/><br/>
              <span>The editor only stores locally (in browser's data) one map at a time. So its content will be deleted.</span><br/>
              <span>You can save it on your PC using the export feature before creating a new map.</span><br/><br/><br/>
              <span>Do you confirm you want to create a new map ? </span><br/>
              <div>
                <button onClick={this.onConfirmYes}>Yes</button>
                <button onClick={this.onConfirmNo}>No</button>
              </div>
            </div>

          </div>

        </div>

      );
    }
    else if (this.state.confirmationPublishOpened) {

      return (
        <div className="Menu" onClick={this.onClose}>

          <div onClick={(e) => {e.stopPropagation();}}>

            <div id="confirmation">

              <span style={{position: 'absolute', left: 'calc(50% - 50px)', fontWeight: 'bold', fontSize: '20px'}}>Publish</span><br/><br/><br/>
              <span>Enter your email for publishing this map:</span><br/><br/>
              <input id="email" type="text" placeholder="email" value={this.state.email} onChange={this.onEmailChange}></input>
              <div>
                <button onClick={this.onConfirmPublish}>Publish</button>
              </div>
            </div>
          </div>

        </div>

      );

    }
    else {

      return (

        <div className="Menu" onClick={this.onClose}>

          <div onClick={(e) => {e.stopPropagation();}}>
            <div>
              <div className="MenuItem" onClick={this.onImport}>Import Geojson/KMZ/KML{this.importMenu()}</div>
              <div className="MenuItem" onClick={this.onExportGeojson}>Export Geojson</div>
              <div className="MenuItem" onClick={this.onExportKml}>Export KML</div>
              <br/>
              <div className="MenuItem" onClick={this.onPublish}>Publish map</div>
            </div>
            <div>
              <div className="MenuItem" onClick={this.onNew}>New map</div>
            </div>
          </div>
          
        </div>
      );
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Menu)