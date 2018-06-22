import * as React from 'react';
import { Layout, Card, Radio, Divider } from 'antd';
import * as L from 'leaflet';
import NetUtils from '../../utils/NetUtils';
import ApiUtils from '../../utils/ApiUtils';

interface ITestState
{
    mapConfig? : Map<string, string[]>;
    currentTypeLevels? : string[];
}

class Test extends React.Component<{} , ITestState>
{
    public testMap : L.Map;
    public tileLayer : L.TileLayer;

    public constructor(props : any)
    {
        super(props);
        this.state = {
            mapConfig : new Map(),
        };
    }

    public config2Type = (config : string) : string =>
    {
        let result = "";
        switch(config)
        {
            case "Google_Satellite":
                result = "google-satellite";
                break;
            case "Google_Image":
                result = "google-image";
                break;
            case "Google_Terrain":
                result = "google-terrain";
                break;
            case "AMap_Satellite":
                result = "amap-satellite";
                break;
            case "AMap_Cover":
                result = "amap-cover";
                break;
            case "AMap_Image":
                result = "amap-image";
                break;
            case "TianDiTu_Satellite":
                result = "tianditu-satellite";
                break;
            case "TianDiTu_Image":
                result = "tianditu-image";
                break;
            case "TianDiTu_Cover":
                result = "tianditu-cover";
                break;
        }

        return result;
    }

    public config2TypeDes = (config : string) : string =>
    {
        let result = "";
        switch(config)
        {
            case "Google_Satellite":
                result = "Google卫星";
                break;
            case "Google_Image":
                result = "Google矢量";
                break;
            case "Google_Terrain":
                result = "Google地形";
                break;
            case "AMap_Satellite":
                result = "高德卫星";
                break;
            case "AMap_Cover":
                result = "高德标签";
                break;
            case "AMap_Image":
                result = "高德矢量";
                break;
            case "TianDiTu_Satellite":
                result = "天地图卫星";
                break;
            case "TianDiTu_Image":
                result = "天地图矢量";
                break;
            case "TianDiTu_Cover":
                result = "天地图标签";
                break;
        }

        return result;
    }

    public onRadioChange = (event : any) : void =>
    {
        console.log("onRadioChange", event.target.value);

        if(this.state.mapConfig)
        {
            this.setState({currentTypeLevels : this.state.mapConfig.get(event.target.value)});
            
            this.testMap.removeLayer(this.tileLayer);
            this.tileLayer = L.tileLayer(
                '/server/map/'+ 
                this.config2Type(event.target.value)
                +'/{x}/{y}/{z}', 
                {
                    subdomains: "1234",
                    attribution: this.config2TypeDes(event.target.value)
                });
            this.testMap.addLayer(this.tileLayer);
        }
    }

    public mapInit = (latlng : L.LatLng) =>
    {
        NetUtils.get(
            ApiUtils.SERVER_CONFIG,
            (mapConfigSrc : any) =>
            {
                let mapConfig : Map<string, string[]> = new Map();
                let initMapType : string = "";

                for(let key in mapConfigSrc.config)
                {
                    if(key as string)
                    {
                        if(initMapType === "")
                        {
                            initMapType = key;
                        }

                        let levels : string[] = [];
                        for(let level in mapConfigSrc.config[key])
                        {
                            if(level as string)
                            {
                                levels.push(level);
                            }
                        }
                        mapConfig.set(key, levels);
                    }
                }
                this.setState({ mapConfig });

                this.testMap = L.map('testMap').setView(latlng, 16);
                this.tileLayer = L.tileLayer(
                    'http://localhost:8080/server/map/'+ 
                    this.config2Type(initMapType)
                    +'/{x}/{y}/{z}', 
                    {
                        subdomains: "1234",
                        attribution: this.config2TypeDes(initMapType)
                    });
                this.tileLayer.addTo(this.testMap);
            }
        );
    }

    public locationSuccess = (position : Position) => {
        let latitude = position.coords.latitude; 
        let longitude = position.coords.longitude; 
        return this.mapInit(new L.LatLng(latitude, longitude));
    };

    public locationError = () => {
        this.mapInit(new L.LatLng(23.141716164703613,113.29651951789857));
    };

    public randerRadio = () : React.ReactNode[] =>
    {
        let radioList : React.ReactNode[] = [];

        if(this.state.mapConfig)
        {
            this.state.mapConfig.forEach((value : string[],
                 key : string , map : Map<string , string[]>) =>
                {
                    radioList.push(
                        <Radio 
                            style={{
                                display: 'block',
                                height: '30px',
                                lineHeight: '30px',
                            }} 
                            value={key}>
                            {this.config2TypeDes(key)}
                        </Radio>
                    );
                });
        }
        return radioList;
    }

    public randerCurrentLevel = () : React.ReactNode =>
    {
        let result = "";
        
        if(this.state.currentTypeLevels)
        {
            for(let level of this.state.currentTypeLevels)
            {
                result = result + "第" + level + "级 "
            }
        }
        
        return result;
    }

    public componentDidMount()
    {
        if (navigator.geolocation) 
        {
            navigator.geolocation.
                getCurrentPosition(this.locationSuccess, this.locationError);
        } 
        else 
        {
            let latlng : L.LatLng = new L.LatLng(23.141716164703613,113.29651951789857);
            this.mapInit(latlng);
        }
    }

    public render()
    {
        return (
            <Layout style={{flexDirection : "row", justifyContent : "space-between"}}>
                <div 
                    id='testMap' 
                    style={{
                        width : "70vw" , 
                        height : "85vh", 
                        margin : 10
                        }}/>
                
                <Card
                    title={<strong style={{fontSize : 20}}>地图参数</strong>}
                    style={{ width: "25vw", margin:10 }}>
                    <Radio.Group 
                        style={{margin : 5, fontSize : 15}}
                        onChange={this.onRadioChange}>
                        {this.randerRadio()}
                    </Radio.Group>
                    <Divider>当前类型拥有层级</Divider>
                    {this.randerCurrentLevel()}
                </Card>
            </Layout>
        );
    }
}

export default Test;