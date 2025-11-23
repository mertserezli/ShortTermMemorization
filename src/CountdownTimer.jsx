import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer"

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
        return <div className="timer">Preparing card</div>;
    }

    return (
        <div className="timer">
            <div className="text">Remaining</div>
            <div className="value">{remainingTime}</div>
            <div className="text">seconds</div>
        </div>
    );
};

export default function CountdownTimer({duration}) {
    return (
        <CountdownCircleTimer
            isPlaying
            duration={duration}
            colors={"#004777"}
            onComplete={() => [true, 1000]}
        >
            {renderTime}
        </CountdownCircleTimer>
    );
}