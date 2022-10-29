import React from 'react';
import { IonCol } from "@ionic/react";
import BarGraph from "../charts/barGraph.jsx";


const BarGraphCards = (props) => {
    return (
        <React.Fragment>
            <IonCol>
                <div className="bar-container">
                    <BarGraph
                        Xdatakey='day_fetched'
                        data={props.payload.data}
                        labelslist={props.payload.labelslist}
                    />
                </div>
            </IonCol>
        </React.Fragment>
    );
}

export default BarGraphCards;
