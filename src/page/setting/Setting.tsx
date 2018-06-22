import * as React from 'react';
import { Layout, Card, Slider, Select, notification, Modal } from 'antd';
import * as L from 'leaflet';
import NetUtils from '../../utils/NetUtils';
import ApiUtils from '../../utils/ApiUtils';

interface ISettingStatus
{
    selectRect? : IRect;
    startPointRecorded : boolean;
    startRectPoint? : L.LatLng;
    selectLevel : [number, number];
    selectType? : string[];

    // Dialog
    initVisable : boolean;
    confirmLoading : boolean;
    dialogMessage : string;
}

interface IRect
{
    left : number;
    right : number;
    top : number;
    bottom : number;
}

const mapLevelMark = {
    1 : "1级",
    3 : "3级",
    5 : "5级",
    7 : "7级",
    9 : "9级",
    11 : "11级",
    13 : "13级",
    15 : "15级",
    17 : "17级",
    18 : "18级",
}

class Setting extends React.Component<{}, ISettingStatus>
{
    public rectMap : L.Map;
    public tileLayer : L.TileLayer;
    public rectLayer : L.Layer;
    public tempLayer : L.Layer;

    public constructor(props : any)
    {
        super(props);
        this.state = {
            startPointRecorded : false,
            selectLevel: [1, 10],
            initVisable : false,
            confirmLoading : false,
            dialogMessage : '点击"确定"开始下载地图切片,待出现"完成"字样前不要关闭网页。',
        };
    }

    public onInitMapClicked = () : void =>
    {
        console.log("onInitMapClicked");
        if(!this.state.selectRect)
        {
            notification.error({
                message: '矩形选择不得为空',
                description: '地图区域矩形选择不得为空',
                placement : "bottomRight"
            });

            return;
        }
        else if(!this.state.selectType || this.state.selectType.length === 0)
        {
            notification.error({
                message: '类型选择不得为空',
                description: '地图类型选择不得为空',
                placement : "bottomRight"
            });
            
            return;
        }

        this.setState({initVisable : true});
    }

    public onDialogConfirm = () : void =>
    {
        this.setState({dialogMessage : "开始请求……", confirmLoading : true});
        this.requestInitMap(this.state.selectLevel[0], this.state.selectLevel[1], 0);
    }

    public onDialogCancel = () : void =>
    {
        this.setState({
            initVisable : false,
            dialogMessage : '点击"确定"开始下载地图切片,待出现"完成"字样前不要关闭网页。',
            confirmLoading : false
        });
    }

    public requestInitMap = (currentLevel : number, endLevel : number, typeIndex : number) : void =>
    {
        if(this.state.selectRect && this.state.selectType)
        {
            let formData = new FormData();
            formData.set("left", this.state.selectRect.left.toString());
            formData.set("right", this.state.selectRect.right.toString());
            formData.set("top", this.state.selectRect.top.toString());
            formData.set("bottom", this.state.selectRect.bottom.toString());
            formData.set("level", currentLevel.toString());
            formData.set("type", this.state.selectType[typeIndex]);

            NetUtils.post(
                ApiUtils.INIT_MAP,
                formData,
                (result : any) =>
                {
                    if(this.state.selectType)
                    {
                        let dialogMessage = this.state.selectType[typeIndex] 
                            + "类型的第" + currentLevel + "级切片请求完成";

                        this.setState({dialogMessage})
                        console.log(currentLevel, endLevel , typeIndex);
                        if(this.state.selectType.length - 1 === typeIndex)
                        {
                            if(currentLevel < endLevel)
                            {
                                // typeIndex 归零, currentLevel += 1
                                this.requestInitMap(currentLevel + 1 , endLevel , 0);
                            }
                            else
                            {
                                this.setState({
                                    dialogMessage : "切片请求完成",
                                    confirmLoading : false
                                })
                            }
                        }
                        else
                        {
                            // typeIndex + 1
                            this.requestInitMap(currentLevel , endLevel , typeIndex + 1);
                        }
                    }
                }
            )
        }
    }

    public onMapLevelChange = (levelArea : [number, number]) : void =>
    {
        this.setState({selectLevel : levelArea});
    }

    public onMapTypeChange = (selectType : string[]) : void =>
    {
        this.setState({selectType});
    }

    public mapInit = (latlng : L.LatLng) =>
    {
        this.rectMap = L.map('rectMap').setView(latlng, 16);
        this.tileLayer = L.tileLayer(
            'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', 
            {
                subdomains: "1234",
                attribution: 'AMap'
            });
        this.tileLayer.addTo(this.rectMap);

        this.rectMap.on('mouseup', (event: L.LocationEvent) => {this.onMapClick(event)});
        this.rectMap.on('mousemove', (event: L.LocationEvent) => {this.onMapMouseMove(event)});
    }

    public onMapClick = (e : L.LocationEvent) =>
    {
        console.log(e);

        // 记录起始点
        if(!this.state.startPointRecorded)
        {
            this.setState({
                startRectPoint : e.latlng,
                startPointRecorded : true
            })

            if(this.rectLayer) 
            {
                this.rectMap.removeLayer(this.rectLayer);
            }
        }
        // 绘制
        else
        {
            console.log("end-click");
            if(this.state.startRectPoint)
            {
                let points = [];
                points.push(this.state.startRectPoint);
                points.push(new L.LatLng(
                    this.state.startRectPoint.lat, 
                    e.latlng.lng));
                points.push(e.latlng);
                points.push(new L.LatLng(e.latlng.lat,
                    this.state.startRectPoint.lng));
                points.push(this.state.startRectPoint);

                this.rectLayer = new L.Polyline(points);

                this.rectMap.addLayer(this.rectLayer);
                
                let selectRect : IRect = {
                    left : e.latlng.lng < this.state.startRectPoint.lng ? 
                        e.latlng.lng : this.state.startRectPoint.lng,
                    right : e.latlng.lng > this.state.startRectPoint.lng ? 
                        e.latlng.lng : this.state.startRectPoint.lng,
                    top : e.latlng.lat > this.state.startRectPoint.lat ? 
                        e.latlng.lat : this.state.startRectPoint.lat,
                    bottom : e.latlng.lat < this.state.startRectPoint.lat ? 
                        e.latlng.lat : this.state.startRectPoint.lat,
                }
                this.setState({
                    startRectPoint : undefined,
                    startPointRecorded : false,
                    selectRect,
                })
            }
        }
    }

    public onMapMouseMove = (e : L.LocationEvent) =>
    {
        if(!this.state.startRectPoint)
        {
            return;
        }

        let points = [];
        points.push(this.state.startRectPoint);
        points.push(new L.LatLng(this.state.startRectPoint.lat, e.latlng.lng));
        points.push(e.latlng);
        points.push(new L.LatLng(e.latlng.lat, this.state.startRectPoint.lng));
        points.push(this.state.startRectPoint);

        if(this.tempLayer) 
        {
            this.rectMap.removeLayer(this.tempLayer);
        }

        this.tempLayer = new L.Polyline(points);
        this.rectMap.addLayer(this.tempLayer);
    }

    public locationSuccess = (position : Position) => {
        let latitude = position.coords.latitude; 
        let longitude = position.coords.longitude; 
        return this.mapInit(new L.LatLng(latitude, longitude));
    };

    public locationError = () => {
        this.mapInit(new L.LatLng(23.141716164703613,113.29651951789857));
    };

    // Life Cycle
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
            <Layout
                style={{
                    flexDirection : "row"
                }}>

                <Modal title="下载地图瓦片"
                    visible={this.state.initVisable}
                    onOk={this.onDialogConfirm}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.onDialogCancel}
                    >
                    <p>{this.state.dialogMessage}</p>
                </Modal>

                    <div 
                    id='rectMap' 
                    style={{
                        width : "50vw" , 
                        height : "85vh", 
                        margin : "10px"
                        }}/>

                    <Layout style={{justifyContent : "space-between"}}>
                        <Card 
                            title={<strong style={{fontSize : 20}}>地图参数</strong>}
                            extra={<a onClick={this.onInitMapClicked}>下载瓦片</a>}
                            style={{ width: "45vw", margin:10 }}>

                            <p><strong style={{margin : 5, fontSize : 15}}> 地图等级 </strong></p>
                            <Slider 
                                onChange={this.onMapLevelChange}
                                marks={mapLevelMark}
                                range={true}
                                min={1}
                                max={18} 
                                defaultValue={[1,10]}
                                />
                            
                            <p><strong style={{margin : 5, fontSize : 15}}> 地图类型 </strong></p>

                            <Select
                                mode="multiple"
                                onChange={this.onMapTypeChange}
                                style={{ width : "40vw" , alignSelf : "center"}}
                                >
                                <Select.Option key="google-satellite">Google卫星</Select.Option>
                                <Select.Option key="google-image">Google矢量</Select.Option>
                                <Select.Option key="google-terrain">Google地形</Select.Option>

                                <Select.Option key="amap-satellite">高德卫星</Select.Option>
                                <Select.Option key="amap-image">高德矢量</Select.Option>
                                <Select.Option key="amap-cover">高德标签</Select.Option>

                                <Select.Option key="tianditu-satellite">天地图卫星</Select.Option>
                                <Select.Option key="tianditu-image">天地图矢量</Select.Option>
                                <Select.Option key="tianditu-cover">天地图标签</Select.Option>
                            </Select>
                        </Card>
                        <Card 
                            title={<strong style={{fontSize : 20}}>矩形经纬度显示</strong>}
                            style={{ width: "45vw", margin: 10 }}>
                            {
                                this.state.selectRect ? 
                                (
                                    <Layout 
                                        style={{
                                            background : "#00000000",
                                            textAlign : "center"
                                        }}>
                                        <p>上：{this.state.selectRect.top}</p>
                                        <p>下：{this.state.selectRect.bottom}</p>
                                        <p>左：{this.state.selectRect.left}</p>
                                        <p>右：{this.state.selectRect.right}</p>
                                    </Layout>
                                ) :
                                (
                                    <Layout 
                                        style={{
                                            background : "#00000000",
                                            textAlign : "center"
                                        }}>
                                        <p>上：</p>
                                        <p>下：</p>
                                        <p>左：</p>
                                        <p>右：</p>
                                    </Layout>
                                )
                            }
                        </Card>
                    </Layout>
            </Layout>
        );
    }
}

export default Setting;