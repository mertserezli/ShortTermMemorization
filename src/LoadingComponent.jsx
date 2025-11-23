import React from 'react';

import "./Loading.css"

export default function Loading({show}) {
    return(
        (show?
        <div className="lds-ring">
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
        :
        <></>
        )
    )
}