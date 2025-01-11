import {
  Route,
  NavLink,
  Link,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
  useLoaderData,
} from "react-router-dom"

const Home = () => <h1>Page Home</h1>
const About = () => <h1>Page About</h1>

const AppLayout = () => (
  <>
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/help">Help</NavLink>
          </li>
          <li>
            <NavLink to="/team">Team</NavLink>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <Outlet />
    </main>

    <footer>Rodape</footer>
  </>
)

const HelpLayout = () => (
  <div className="help-layout">
    <h1>Help</h1>
    <p>
      Need help? You can check out our FAQ for common questions or get in touch.
    </p>

    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="faq">FAQ</NavLink>
            <NavLink to="contact">Contact</NavLink>
          </li>
        </ul>
      </nav>
    </header>

    <Outlet />
  </div>
)

const Faq = () => (
  <div className="faq">
    <h2>Questions and Answers</h2>

    <div className="question">
      <h3>What is React Router used for?</h3>
      <p>
        React Router is used to manage navigation and routing in React
        applications, allowing users to switch between pages without reloading
        the browser.
      </p>
    </div>
    <div className="question">
      <h3>What is a route in React Router?</h3>
      <p>
        A route is a rule that tells the app which component to display based on
        the URL in the browser.
      </p>
    </div>
    <div className="question">
      <h3>What are nested routes in React Router?</h3>
      <p>
        Nested routes are routes defined within a parent route, allowing the app
        to show multiple levels of content based on the URL.
      </p>
    </div>
  </div>
)

const Contact = () => (
  <div className="contact">
    <h2>Contact-us</h2>

    <form>
      <label>
        <span>Your Email:</span>
        <input type="email" />
      </label>
      <label>
        <span>Your Message:</span>
        <textarea></textarea>
      </label>
      <button>Submit</button>
    </form>
  </div>
)

const NotFound = () => (
  <>
    <h1>Page Not Found =/</h1>
    <p>
      But you can go back to the <Link patch="/">home page</Link>{" "}
    </p>
  </>
)

const TeamLayout = () => (
  <>
    <h1>Team</h1>
    <p>Meet our team</p>
    <Outlet />
  </>
)

const peopleLoader = async () => {
  const people = await fetch("https://jsonplaceholder.typicode.com/users")
  return people.json()
}

const People = () => {
  const people = useLoaderData()
  return (
    <div className="people">
      <ul>
        {people.map((person) => (
          <Link key={person.id}>
            <li>
              <h3>{person.name}</h3>
              <p>This is in {person.address.city}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route patch="/" element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<HelpLayout />}>
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="team" element={<TeamLayout />}>
        <Route index element={<People />} loader={peopleLoader} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
)

const App = () => <RouterProvider router={router} />

export { App }
