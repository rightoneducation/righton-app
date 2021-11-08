import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { API, graphqlOperation } from 'aws-amplify';
import Observable from 'zen-observable-ts';
import { subscribeToGameStatusUpdates } from '../graphql/subscriptions';
import { SubscribeToGameStatusUpdatesSubscription } from '../API';
import StatusPage from './Status';

type Result = { 
    value: {
        data: SubscribeToGameStatusUpdatesSubscription 
    }
}

export default function StatusPageContainer() {
    const { gameID } = useParams<{ gameID: string | undefined }>();
    const [screenData, setScreenData] = useState<any>(null);
    useEffect(() => {
        // Subscribe to the status of this game
        const subscription = (API.graphql(graphqlOperation(subscribeToGameStatusUpdates, { gameID })) as Observable<Result>)
            .subscribe(
                {
                    next: ({ value }) => {
                        const screen = value?.data?.subscribeToGameStatusUpdates;

                        if (screen) {
                            setScreenData(screen);
                        }
                    },
                    error: error => console.warn(error)
                }
            );

        return function cleanup() {
            // Stop receiving data updates from the subscription
            subscription.unsubscribe();
        };
    }, [gameID])

    if (screenData === null) return null;

    // @ts-ignore
    return <StatusPage screen={screenData as Screen} />
}