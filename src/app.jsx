import {
  createBrowserRouter,
  createRoutesFromElements,
  useParams,
  useNavigate,
  useLoaderData,
  useOutletContext,
  Route,
  NavLink,
  Link,
  RouterProvider,
  Outlet,
  Navigate,
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
          <li>
            <NavLink to="/map">Map</NavLink>
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

const peopleLoader = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users")
  const people = await response.json()

  return people.map((person) => ({
    id: person.id,
    name: person.name,
    address: { city: person.address.city },
    email: person.email,
    company: { catchPhrase: person.company.catchPhrase },
  }))
}

const TeamLayout = () => {
  const people = useLoaderData()
  return (
    <>
      <h1>Team</h1>
      <p>Meet our team</p>
      <Outlet context={people} />
    </>
  )
}

const People = () => {
  const people = useOutletContext()
  return (
    <div className="people">
      <ul>
        {people.map((person) => (
          <Link key={person.id} to={`/team/${person.id}`}>
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

const Person = () => {
  const params = useParams()
  const navigate = useNavigate()
  const people = useOutletContext()
  const person = people.find((person) => String(person.id) === params.id)

  const handleClickBack = () => navigate(-1)
  return (
    <div className="person">
      <h2>{person.name}</h2>
      <p>{person.email}</p>
      <p>{person.address.city}</p>
      <p>{person.company.catchPhrase}</p>
      <button onClick={handleClickBack}>&larr; Back</button>
    </div>
  )
}

const citiesLoader = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/MatheusZamo/learning-react-router/refs/heads/main/src/fake-city.json",
  )
  return response.json()
}

const MapLayout = () => {
  const cities = useLoaderData()
  return (
    <div className="map-layout">
      <h1>Mapa</h1>
      <div className="container">
        <div className="map">
          <p>Map</p>
        </div>
        <div className="sidebar">
          <ul>
            {cities.map((city) => (
              <li key={city.id}>{city.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route patch="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<HelpLayout />}>
          <Route index element={<Navigate to="faq" replace />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="team" element={<TeamLayout />} loader={peopleLoader}>
          <Route index element={<People />} />
          <Route path=":id" element={<Person />} />
        </Route>
        <Route path="map" element={<MapLayout />} loader={citiesLoader}></Route>
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  )
  return <RouterProvider router={router} />
}

export { App }
