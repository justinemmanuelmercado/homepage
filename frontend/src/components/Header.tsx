import React from "react";
import { IconType } from "react-icons";
import { saveCredentials, logout } from "../lib/api";
import { AuthContext } from "../App";

interface HeaderProps {
  setSelected: (selected: string) => void;
  selected: string;
  pages: { id: string; icon: IconType }[];
}

export const Header = (props: HeaderProps): React.ReactElement => {
  const { selected, pages, setSelected } = props;
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const { loggedIn, setLoggedIn } = React.useContext(AuthContext);

  const login = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    saveCredentials(username, password);
    setLoggedIn(true);
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "1rem"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          {pages.map(
            (page): React.ReactElement => {
              const { icon: Icon, id } = page;
              const className = id === selected ? "is-active" : "";
              return (
                <span
                  key={id}
                  className={`navbar-item ${className}`}
                  onClick={(): void => setSelected(id)}
                >
                  <span className="tabs-link">
                    <span className="icon">
                      <Icon />
                    </span>
                    <span>
                      {id[0].toUpperCase()}
                      {id.substring(1)}
                    </span>
                  </span>
                </span>
              );
            }
          )}
        </div>
        {loggedIn && (
          <button onClick={handleLogout} className="button is-small">
            Log Out
          </button>
        )}
        {!loggedIn && (
          <form onSubmit={login}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <input
                className="input is-small"
                type="text"
                onChange={evt => setUsername(evt.currentTarget.value)}
                placeholder="Username"
                value={username}
              />
              <input
                className="input is-small"
                type="password"
                onChange={evt => setPassword(evt.currentTarget.value)}
                placeholder="Password"
                value={password}
              />
              <button className="button is-small" type="submit">
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </nav>
  );
};
