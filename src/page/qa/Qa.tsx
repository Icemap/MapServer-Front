import * as React from 'react';
import { Layout, Collapse, Divider } from 'antd';
// import NetUtils from '../../utils/NetUtils';
// import ApiUtils from '../../utils/ApiUtils';

interface IQaState
{
    apiList? : string[];
}

class Qa extends React.Component<{} , IQaState>
{
    public constructor(props : any)
    {
        super(props);
        this.state = {
        };
    }

    public render()
    {
        return (
            <Layout style={{alignItems : "center", justifyContent : "flex-start"}}>
            
                <Divider>Q&amp;A</Divider>
                <Collapse style={{width: "70vw", margin: 15}} accordion={true}>
                
                    <Collapse.Panel header="有什么用？" key="1">
                        <p>这是一个直接选择地图瓦片范围，直接得到地图瓦片服务的小工具</p>
                    </Collapse.Panel>
                    <Collapse.Panel header="怎么用？" key="2">
                        <p>在<strong>设置页面</strong>选择瓦片范围、瓦片类型、瓦片等级，确认后即可得到服务</p>
                    </Collapse.Panel>
                    <Collapse.Panel header="切片丢失？" key="3">
                        <p>Google地图服务器在并发请求下，不会每个瓦片都正常返回。遇到这种情况，
                            只需重新对该等级请求一次即可，已经获取到的瓦片不会被再次请求</p>
                    </Collapse.Panel>
                </Collapse>

                <Divider dashed={true}>API</Divider>
                <Collapse style={{width: "70vw", margin: 15}} accordion={true}>
                    
                    <Collapse.Panel header="瓦片类型参数说明" key="1">
                        <p style={{marginLeft: 20}}>瓦片类型需在如下参数中选择:</p>
                        <p style={{marginLeft: 20}}>Google卫星: google-satellite </p>
                        <p style={{marginLeft: 20}}>Google矢量: google-image</p>
                        <p style={{marginLeft: 20}}>Google地形: google-image</p>
                        <p style={{marginLeft: 20}}>高德卫星: amap-satellite </p>
                        <p style={{marginLeft: 20}}>高德矢量: amap-image </p>
                        <p style={{marginLeft: 20}}>高德覆盖层: amap-cover </p>
                        <p style={{marginLeft: 20}}>天地图卫星: tianditu-satellite </p>
                        <p style={{marginLeft: 20}}>天地图矢量: tianditu-image </p>
                        <p style={{marginLeft: 20}}>天地图覆盖层: tianditu-cover </p>

                    </Collapse.Panel>

                    <Collapse.Panel header="瓦片等级参数说明" key="2">
                        <p>瓦片等级仅允许在1-18内。</p>
                    </Collapse.Panel>

                    <Collapse.Panel header="初始化地图API" key="3">
                        <p><strong>/init/initMap <div color="#FA0">POST</div>, 参数为：</strong></p>
                        <p style={{marginLeft: 20}}>left : 类型：double, 单位：经纬度, 含义：请求瓦片的左边界</p>
                        <p style={{marginLeft: 20}}>right : 类型：double, 单位：经纬度, 含义：请求瓦片的右边界</p>
                        <p style={{marginLeft: 20}}>top : 类型：double, 单位：经纬度, 含义：请求瓦片的上边界</p>
                        <p style={{marginLeft: 20}}>bottom : 类型：double, 单位：经纬度, 含义：请求瓦片的下边界</p>
                        <p style={{marginLeft: 20}}>type : 类型：string, 单位：瓦片类型, 含义：请求瓦片的类型，说明见<strong>瓦片类型参数说明</strong></p>
                        <p style={{marginLeft: 20}}>level : 类型：int, 单位：瓦片等级, 含义：请求瓦片的等级，说明见<strong>瓦片等级参数说明</strong></p>
                    </Collapse.Panel>

                    <Collapse.Panel header="获取拥有的地图类型、等级、范围" key="4">
                        <p><strong>server/config <div color="#FA0">GET</div>, 参数为空</strong></p>
                    </Collapse.Panel>

                    <Collapse.Panel header="地图服务" key="5">
                        <p><strong>{"server/map/{type}/{x}/{y}/{z}"} <div color="#FA0">GET</div>, 参数为URL参数，放在请求的路径中:</strong></p>
                        <p style={{marginLeft: 20}}>type : 类型：string, 单位：瓦片类型, 含义：请求瓦片的类型，说明见<strong>瓦片类型参数说明</strong></p>
                        <p style={{marginLeft: 20}}>{"x : 类型：int, 单位：/, 含义：标准TMS(瓦片地图服务)的x参数"}</p>
                        <p style={{marginLeft: 20}}>{"y : 类型：int, 单位：/, 含义：标准TMS(瓦片地图服务)的y参数"}</p>
                        <p style={{marginLeft: 20}}>{"z : 类型：int, 单位：/, 含义：标准TMS(瓦片地图服务)的z参数"}</p>
                    </Collapse.Panel>
                </Collapse>
            </Layout>
        );
    }
}

export default Qa;