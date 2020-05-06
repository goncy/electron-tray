import React from "react";

import "./styles.css";

interface State {
  title: string;
  hours: number;
  minutes: number;
}

const sound = new Audio("http://www.sonidosmp3gratis.com/sounds/nudge-nudge-msn.mp3");
const hours = new Date().getHours();
const minutes = new Date().getMinutes();

function notify(message?: string) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted" && message) {
    new Notification("Tucu notifier", {body: message});
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      if (permission === "granted" && message) {
        new Notification("Tucu notifier", {body: message});
      }
    });
  }
}

const App: React.FC = () => {
  const [values, update] = React.useReducer(
    (prev: State, next: Partial<State>) => ({...prev, ...next}),
    {
      title: "",
      hours: minutes > 30 ? (hours === 23 ? 0 : hours + 1) : hours,
      minutes: minutes > 30 ? 0 : 30,
    },
  );

  function remind(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    notify(values.title);

    sound.play();
  }

  React.useEffect(() => {
    notify();
  }, []);

  return (
    <form onSubmit={remind}>
      <input
        autoFocus
        id="title"
        placeholder="Stop being a Tucu"
        type="text"
        value={values["title"]}
        onChange={(e) => update({title: e.target.value})}
      />
      <input
        id="hours"
        max={24}
        min={0}
        placeholder="17"
        type="number"
        value={values["hours"]}
        onChange={(e) => update({hours: Number(e.target.value)})}
      />
      <input
        id="minutes"
        max={59}
        min={0}
        placeholder="45"
        type="number"
        value={values["minutes"]}
        onChange={(e) => update({minutes: Number(e.target.value)})}
      />
      <button id="submit" type="submit">
        Remind
      </button>
    </form>
  );
};

export default App;
