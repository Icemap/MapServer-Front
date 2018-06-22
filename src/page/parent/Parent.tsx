import * as React from 'react';
import { Layout, Radio } from 'antd';

import Setting from '../setting/Setting';
import Test from '../test/Test';
import Qa from '../qa/Qa';

interface IParentState
{
    childPageName : string;
}

class Parent extends React.Component<{}, IParentState>
{
    public constructor(props : any)
    {
        super(props);

        this.state = 
        {
            childPageName : "setting",
        }
    }

    // --------------------- Reaction ---------------------

    public onChanged = (event : any) =>
    {
        this.setState({
            childPageName : event.target.value
        });
    }

    // --------------------- Render ---------------------

    public renderChildPage = () : React.ReactNode =>
    {
        switch(this.state.childPageName)
        {
            case "setting":
                return (<Setting/>);
            case "test":
                return (<Test/>);
            case "qa":
                return (<Qa/>);
            default:
                return (<b/>);
        }
    }

    public render()
    {
        return (
            <Layout>
                <Layout.Header>

                    <Layout
                        style={{
                            flexDirection: "row",
                            background : "#00000000",
                            alignItems : "center",
                            justifyContent: "space-between"
                            }}>
                        <h2 style={{display: "flex", margin: "5px", color : "#FFF"}}><b>地图服务</b></h2>
                        <Layout 
                            style={{
                                flexDirection: "row",
                                background : "#00000000",
                                alignItems : "center",
                                justifyContent: "flex-end"
                                }}>

                            <Radio.Group 
                                defaultValue="setting"
                                onChange={this.onChanged}>
                                <Radio.Button value="setting">设置页面</Radio.Button>
                                <Radio.Button value="test">测试页面</Radio.Button>
                                <Radio.Button value="qa">Q&amp;A</Radio.Button>
                            </Radio.Group>
                        </Layout>
                    </Layout>
                </Layout.Header>

                <Layout.Content>
                    {this.renderChildPage()}
                </Layout.Content>
            </Layout>
        );
    }
}

export default Parent;