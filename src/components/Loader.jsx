import { Spin } from 'antd';
import React from 'react';

export default function Loader({ spinning }) {
    // const [spinning, setSpinning] = React.useState(sho);
    // const showLoader = () => {
    //     setSpinning(true);
    //     setTimeout(() => {
    //         setSpinning(false);
    //     }, 3000);
    return (
        <>
            {/* <Button onClick={showLoader}>Show fullscreen for 3s</Button> */}
            <Spin spinning={spinning} fullscreen />
        </>
    );
}
