import React from 'react';
import { IonRow, IonCol, IonBadge } from "@ionic/react";
import Card from "material-table-ui/components/Card/Card.jsx";
import CardBody from "material-table-ui/components/Card/CardBody.jsx";
import PieGraph from "../charts/pieGraph.jsx";


const PieGraphCards = (props) => {
    return (
        <React.Fragment>
            <IonCol>
                <Card className="card-container-ah">
                    <CardBody className="card-body-pie">
                        <ion-grid>
                            {
                                props.isBadge ? (
                                    <IonRow>
                                        <IonCol size="8">
                                            <h6 className="card-title-ah">{props.title}</h6>
                                        </IonCol>
                                        <IonCol size="4">
                                            <IonBadge className="card-badge" color="primary">{`Avg: ${props.avgTime} ${props.payload.unit}`} </IonBadge>
                                        </IonCol>
                                    </IonRow>
                                ) : (
                                    <IonRow>
                                        <IonCol>
                                            <h6 className="card-title-ah">{props.title}</h6>
                                        </IonCol>
                                    </IonRow>
                                )
                            }
                            <IonRow>
                                <IonCol className="ion-justify-content-center pie-container">
                                    <PieGraph
                                        datakey='value'
                                        data={props.payload.data}
                                        labelslist={props.payload.labelslist}
                                    />
                                </IonCol>
                            </IonRow>
                        </ion-grid>
                    </CardBody>
                </Card>
            </IonCol>
        </React.Fragment>
    );
}

export default PieGraphCards;
