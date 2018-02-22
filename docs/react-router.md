# [React Router v4](https://reacttraining.com/react-router/web/guides/philosophy)

refs:

1. https://github.com/tylermcginnis?tab=repositories
2. https://reacttraining.com/react-router/web/guides/philosophy

## Pass props to a component rendered by React Router: [<Route render={...}>](https://reacttraining.com/react-router/core/api/Route/render-func)

component has performance issue:

> When you use the component props, the router uses React.createElement to create a new React element from the given component.

TODO: 我觉得这是 react-router 做的不好的一点，这样接口有点冗余了。能不能优化下呢，统一使用 `render` 属性

```js
<Route
  path="/dashboard"
  component={props => <Dashboard {...props} isAuthed={true} />}
/>
```

recommended approach:

```js
<Route
  path="/dashboard"
  render={props => <Dashboard {...props} isAuthed={true} />}
/>
```

## Programmatically navigate using React Router: [<Redirect>](https://reacttraining.com/react-router/core/api/Redirect)

在有 redux action 的情况下，并没有更方便。

```js
class Register extends React.Component {
  state = {
    toDashboard: false
  };
  handleSubmit = user => {
    saveUser(user).then(() =>
      this.setState(() => ({
        toDashboard: true
      }))
    );
  };
  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div>
        <h1>Register</h1>
        <Form onSubmit={this.handleSubmit} />
      </div>
    );
  }
}
```

## Query Strings support with React Router

react-router doesn't have build in support form parsing query strings for:

> The reason for this is because, over the years, there have been many requests to support different implementations. With that, the team decided it would be best for users to decide what the implementation looks like rather than baking in a “one size fits all” solution.

TODO: 但是这样真的很难用，可以用类似插件的方式提供这个功能吗

```js
import queryString from 'query-string'

...

componentDidMount() {
  console.log(this.props.location.search) // "?filter=top&origin=im"
  const values = queryString.parse(this.props.location.search)
  console.log(values.filter) // "top"
  console.log(values.origin) // "im"
}
```

## Handling 404 pages (catch all routes) with React Router

```js
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Home = () => <h1>Home</h1>;

const WillMatch = () => <h3>Matched!</h3>;

const NoMatch = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

class App extends React.Component {
  render() {
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/will-match">Will Match</Link>
          </li>
          <li>
            <Link to="/will-not-match">Will Not Match</Link>
          </li>
          <li>
            <Link to="/also/will/not/match">Also Will Not Match</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/will-match" component={WillMatch} />
          {/** the Route has no path, and if it has no path, it will always be matched */}
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>;
  }
}

export default App;
```

## Ambiguous Matches with React Router: [<Switch>](https://reacttraining.com/react-router/web/api/Switch)

> Renders the first child <Route> or <Redirect> that matches the location.

以下两段代码，当 URL 是 `/about` 时，第一段将同时渲染 `About`, `User`, `NoMatch` 路由，第二段将仅渲染第一个匹配到的路由 `About`

```js
import { Switch, Route } from 'react-router'

<div>
  <Route exact path="/" component={Home}/>
  <Route path="/about" component={About}/>
  <Route path="/:user" component={User}/>
  <Route component={NoMatch}/>
</div>
```

```js
import { Switch, Route } from 'react-router'

<Switch>
  <Route exact path="/" component={Home}/>
  <Route path="/about" component={About}/>
  <Route path="/:user" component={User}/>
  <Route component={NoMatch}/>
</Switch>
```

## Pass props to React Router's Link component: [<Link>](https://reacttraining.com/react-router/web/api/Link)

```js
import { Link } from 'react-router-dom'

<Link to="/about">About</Link>

<Link to='/courses?sort=name'/>

// NOTE: pass any props as state
<Link to={{
  pathname: '/courses',
  search: '?sort=name',
  hash: '#the-hash',
  state: { fromDashboard: true }
}} />

// When replace is true, clicking the link will replace the current entry in the history stack instead of
// adding a new one
<Link to="/courses" replace />
```

```js
class Example extends React.Component {
  componentDidMount () {
    const { handle } = this.props.match.params
    const { fromDashboard } = this.props.location.state
    ...
  }
  render() {
    ...
  }
}
```

## Rendering a Sidebar or Breadcrumbs with React Router

Kind of hack, still need to recursively map the routes

```js
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const routes = [
  {
    path: "/",
    exact: true,
    sidebar: () => <div>home!</div>,
    main: () => <h2>Home</h2>
  },
  {
    path: "/bubblegum",
    sidebar: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>
  },
  {
    path: "/shoelaces",
    sidebar: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>
  }
];

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ display: "flex" }}>
          <div
            style={{
              padding: "10px",
              width: "40%",
              background: "#f0f0f0"
            }}
          >
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/bubblegum">Bubblegum</Link>
              </li>
              <li>
                <Link to="/shoelaces">Shoelaces</Link>
              </li>
            </ul>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                exact={route.exact}
                component={route.sidebar}
              />
            ))}
          </div>

          <div style={{ flex: 1, padding: "10px" }}>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                exact={route.exact}
                component={route.main}
              />
            ))}
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
```

## Customizing your own Link component with React Router: [<Route>](https://reacttraining.com/react-router/web/api/Route)

```js
import { BrowserRouter as Router, Route } from 'react-router-dom'

<ul>
  <ListItemLink to="/somewhere"/>
  <ListItemLink to="/somewhere-else"/>
</ul>

const ListItemLink = ({ to, ...rest }) => (
  <Route path={to} children={({ match }) => (
    <li className={match ? 'active' : ''}>
      <Link to={to} {...rest}/>
    </li>
  )}/>
)
```

## Animated Transitions with React Router

> tl;dr: Wrap your Switch component inside of both TransitionGroup and CSSTransition, pass the location’s key to CSSTransition
> and pass the location to Switch.

```js
// The goal of this post was to really dive into the why of animated transitions in React Router.
import React, { Component } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

/* you'll need this CSS somewhere
.fade-enter {
  opacity: 0;
  z-index: 1;
}
.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 250ms ease-in;
}
*/

class App extends Component {
  render() {
    return (
      <Router>
        <Route
          render={({ location }) => (
            <div style={styles.fill}>
              <Route
                exact
                path="/"
                render={() => <Redirect to="/hsl/10/90/50" />}
              />

              <ul style={styles.nav}>
                <NavLink to="/hsl/10/90/50">Red</NavLink>
                <NavLink to="/hsl/120/100/40">Green</NavLink>
                <NavLink to="/rgb/33/150/243">Blue</NavLink>
                <NavLink to="/rgb/240/98/146">Pink</NavLink>
              </ul>

              <div style={styles.content}>
                <TransitionGroup>
                  tl;dr: Wrap your Switch component inside of both
                  TransitionGroup and CSSTransition, pass the location’s key to
                  CSSTransition and pass the location to Switch.
                  <CSSTransition
                    key={location.key}
                    classNames="fade"
                    timeout={300}
                  >
                    <Switch location={location}>
                      <Route exact path="/hsl/:h/:s/:l" component={HSL} />
                      <Route exact path="/rgb/:r/:g/:b" component={RGB} />
                      <Route render={() => <div>Not Found</div>} />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              </div>
            </div>
          )}
        />
      </Router>
    );
  }
}

const NavLink = props => (
  <li style={styles.navItem}>
    <Link {...props} style={{ color: "inherit" }} />
  </li>
);

const HSL = ({ match }) => {
  const { params } = match;

  return (
    <div
      style={{
        ...styles.fill,
        ...styles.hsl,
        background: `hsl(${params.h}, ${params.s}%, ${params.l}%)`
      }}
    >
      hsl({params.h}, {params.s}%, {params.l}%)
    </div>
  );
};

const RGB = ({ match }) => {
  const { params } = match;

  return (
    <div
      style={{
        ...styles.fill,
        ...styles.rgb,
        background: `rgb(${params.r}, ${params.g}, ${params.b})`
      }}
    >
      rgb({params.r}, {params.g}, {params.b})
    </div>
  );
};

const styles = {};

styles.fill = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
};

styles.content = {
  ...styles.fill,
  top: "40px",
  textAlign: "center"
};

styles.nav = {
  padding: 0,
  margin: 0,
  position: "absolute",
  top: 0,
  height: "40px",
  width: "100%",
  display: "flex"
};

styles.navItem = {
  textAlign: "center",
  flex: 1,
  listStyleType: "none",
  padding: "10px"
};

styles.hsl = {
  ...styles.fill,
  color: "white",
  paddingTop: "20px",
  fontSize: "30px"
};

styles.rgb = {
  ...styles.fill,
  color: "white",
  paddingTop: "20px",
  fontSize: "30px"
};

export default App;
```

## Code Splitting with React Router: [dynamic import(stage 3)](https://github.com/tc39/proposal-dynamic-import)

Another simpler solution: [react-loadable](https://github.com/jamiebuilds/react-loadable)

* edge cases
* Customizing rendering
* Preloading
* Server-Side Rendering

```js
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class DynamicImport extends Component {
  state = {
    component: null
  };
  componentDidMount() {
    this.props.load().then(component => {
      this.setState(() => ({
        component: component.default ? component.default : component
      }));
    });
  }
  render() {
    return this.props.children(this.state.component);
  }
}

const Home = props => (
  <DynamicImport load={() => import("./Home")}>
    {Component =>
      Component === null ? <p>Loading</p> : <Component {...props} />
    }
  </DynamicImport>
);

const Topics = props => (
  <DynamicImport load={() => import("./Topics")}>
    {Component =>
      Component === null ? <p>Loading</p> : <Component {...props} />
    }
  </DynamicImport>
);

const Settings = props => (
  <DynamicImport load={() => import("./Settings")}>
    {Component =>
      Component === null ? <p>Loading</p> : <Component {...props} />
    }
  </DynamicImport>
);

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/topics">Topics</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={Home} />
          <Route path="/topics" component={Topics} />
          <Route path="/settings" component={Settings} />
        </div>
      </Router>
    );
  }
}

export default App;
```

## Protected routes and authentication/authorization with React Router

[withRouter](https://reacttraining.com/react-router/web/api/withRouter)

> You can get access to the history object’s properties and the closest <Route>'s match via the withRouter higher-order component.
> withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.

```js
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

// A simple component that shows the pathname of the current location
class ShowTheLocation extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const { match, location, history } = this.props;

    return <div>You are now at {location.pathname}</div>;
  }
}

// Create a new component that is "connected" (to borrow redux
// terminology) to the router.
const ShowTheLocationWithRouter = withRouter(ShowTheLocation);
```

```js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const Public = () => <h3>Public</h3>;
const Protected = () => <h3>Protected</h3>;

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }));
    });
  };
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const AuthButton = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
);

export default function AuthExample() {
  return (
    <Router>
      <div>
        <AuthButton />
        <ul>
          <li>
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/protected">Protected Page</Link>
          </li>
        </ul>
        <Route path="/public" component={Public} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/protected" component={Protected} />
      </div>
    </Router>
  );
}
```

这里用 `<Route render={...}>` 实现的动态渲染，记得还有一个 `onEnter` 属性，为什么没有用呢？

## Preventing transitions with React Router: [Prompt](https://reacttraining.com/react-router/core/api/Prompt)

```js
import { Prompt } from 'react-router'

<Prompt
  // when: bool
  when={formIsHalfFilledOut}
  // message: string
  message="Are you sure you want to leave?"
  // message: func
  // message={location => (
  //   `Are you sure you want to go to ${location.pathname}?`
  // )
/>
```

```js
class Form extends React.Component {
  state = {
    isBlocking: false
  };
  render() {
    const { isBlocking } = this.state;

    return (
      <form
        onSubmit={event => {
          this.setState(() => ({
            isBlocking: false
          }));
        }}
      >
        <Prompt
          when={isBlocking}
          message={location =>
            `Are you sure you want to go to ${location.pathname}`
          }
        />
        <input
          size="50"
          placeholder="type something to block transitions"
          onChange={event =>
            this.setState(() => ({
              isBlocking: event.target.value.length > 0
            }))
          }
        />
        <button type="submit">Submit to stop blocking</button>
      </form>
    );
  }
}
```

## ~~Recursive paths with React Router~~

## Route Config with React Router

```js
// Question: what about deeper `central route`?
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Sandwiches = () => <h2>Sandwiches</h2>;

const Tacos = ({ routes }) => (
  <div>
    <h2>Tacos</h2>
    <ul>
      <li>
        <Link to="/tacos/bus">Bus</Link>
      </li>
      <li>
        <Link to="/tacos/cart">Cart</Link>
      </li>
    </ul>

    {routes.map(route => <RouteWithSubRoutes key={route.path} {...route} />)}
  </div>
);

const Bus = () => <h3>Bus</h3>;
const Cart = () => <h3>Cart</h3>;

const routes = [
  {
    path: "/sandwiches",
    component: Sandwiches
  },
  {
    path: "/tacos",
    component: Tacos,
    routes: [
      {
        path: "/tacos/bus",
        component: Bus
      },
      {
        path: "/tacos/cart",
        component: Cart
      }
    ]
  }
];

const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    render={props => <route.component {...props} routes={route.routes} />}
  />
);

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/tacos">Tacos</Link>
            </li>
            <li>
              <Link to="/sandwiches">Sandwiches</Link>
            </li>
          </ul>

          {routes.map(route => (
            <RouteWithSubRoutes key={route.path} {...route} />
          ))}
        </div>
      </Router>
    );
  }
}
```

## Server Rendering with React and React Router

## Fixing the "cannot GET _url_" error in React Router

In the **old days**, things were simple. If you wanted to get the contents of `/dashboard`, the browser would make a GET request to your server, by inspecting the path portion of the URL the server would figure out that the user was requesting the /dashboard page. It would then grab that page and send back to the browser as a response. Then these things called `client side routers (CSR)` came into the picture. With a CSR (like React Router), you’re no longer making requests to your server every time you change routes. Instead, your CSR is just handling that for you locally on the browser. So when you go to `/dashboard`, instead of making a GET request to your server, **your CSR is using a browser API called `history.pushState` to manually change the URL and then it renders the View for that specific route - all without causing a page refresh.**

Here’s an example. Say you are really proud of the app you’ve been working on and you want to share it with your Mom. The app is Tic Tac Toe and has three routes, /, /play, and leaderboard. You send your Mom the link https://tictactyler.com/play since you want to play with her. When she enters that URL into her browser and hits enter, what happens? At this point she has no JavaScript, no React, and no React Router. The browser makes a GET request to /play and, since you’re relying on React Router to handle all the routing logic (but she has no React Router yet), the app crashes and she gets Cannot GET /play.

### Solutions

#### Hash History

> TBH, this one is kind of a hack. Have you ever seen those URLs with # in them? They’re using Hash History. The idea is by appending a # to the end of the root of your URL, anything after that # won’t be sent to the server. So if the URL was https://tm.io/#/courses, the browser would make a GET request to https://tm.io, get back all the JavaScript, React Router would then load, see /courses, and show the proper view for that route. React Router provides a HashRouter component you could use that will get you hash based routing, **but honestly unless you REALLY need it, there are better options**.

##### Catch-all

> redirect all of your server requests to /index.html

Express:

```js
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "path/to/your/index.html"), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});
```

nginx .conf:

```bash
location / {
  if (!-e $request_filename){
    rewrite ^(.*)$ /index.html break;
  }
}
```

### _No Server_

Firebase:

> Configure as a single-page app (rewrite all urls to /index.html)?

Netlify:

```bash
/_redirects

/*  /index.html  200
```

### Webpack / Development

webpack-dev-server:

```js
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./app/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index_bundle.js",
    // publicPath allows you to specify the base path for all the assets within your application.
    publicPath: "/"
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  devServer: {
    // historyAPIFallback will redirect 404s to /index.html.
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.html"
    })
  ]
};
```

总结：

* 之前的一些疑惑得到了答案

  * 为什么刷新后就 404 了
  * 如何设置跳转提示／⚠️
  * 为什么 react-router@v4 默认不带 parse query 功能
  * Switch 组件，exact 属性究竟为什么要存在

* 有些可以着手做的事情
  * 以插件的形式封装 query-string 到 react-router 中
  * 优化／统一 `render` 和 `component` 参数
