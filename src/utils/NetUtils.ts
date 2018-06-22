import {notification} from 'antd';
import axios, { AxiosResponse } from 'axios';

class NetUtils 
{
    public static get(url : string, call : any) : void
    {
        axios.get(url)
        .then(
            (response : AxiosResponse) =>
            {
                call(response.data); 
            }
        )
        .catch(
            () =>
            {
                notification.error({
                    message: '请求失败',
                    description: '请重试，多次重试后仍然失败，请联系管理员。',
                    placement : "bottomRight"
                });
            }
        )
    }

    public static post(url : string, form : FormData, call : any) : void
    {
        axios.post(url, form)
        .then(
            (response : AxiosResponse) =>
            {
                call(response.data); 
            }
        )
        .catch(
            () =>
            {
                notification.error({
                    message: '请求失败',
                    description: '请重试，多次重试后仍然失败，请联系管理员。',
                    placement : "bottomRight"
                });
            }
        )
    }
}

export default NetUtils;