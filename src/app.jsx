import {
  createBrowserRouter,
  createRoutesFromElements,
  useParams,
  useNavigate,
  useLoaderData,
  useOutletContext,
  useSearchParams,
  Route,
  NavLink,
  Link,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom"

import {
  useMapEvents,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet"

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

const ChangeCenter = ({ position }) => {
  const map = useMap()
  map.setView(position)
  return null
}

const ChangeToClickedCity = () => {
  const navigate = useNavigate()
  useMapEvents({
    click: (e) =>
      navigate(`form?latitude=${e.latlng.lat}&longitude=${e.latlng.lng}`),
  })
}

const beloHorizontePosition = {
  latitude: "-19.917622853492556",
  longitude: "-43.94031082020503",
}

const MapLayout = () => {
  const cities = useLoaderData()
  const [searchParams, setSearchParams] = useSearchParams(beloHorizontePosition)
  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")

  const handleGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setSearchParams({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      (error) =>
        alert(
          `Você precisa autorizar a obtenção da localização. \nClique no "i" na barra de endereço do navegador para autorizar. \n\n${error.message}`,
        ),
    )
  }

  return (
    <div className="map-layout">
      <h1>Mapa</h1>
      <div className="container">
        <div className="map">
          <MapContainer
            className="map-container"
            center={[latitude, longitude]}
            zoom={8}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {cities.map(({ id, position, name }) => (
              <Marker
                key={id}
                position={[position.latitude, position.longitude]}
              >
                <Popup>{name}</Popup>
              </Marker>
            ))}
            {latitude && longitude && (
              <ChangeCenter position={[latitude, longitude]} />
            )}
            <ChangeToClickedCity />
          </MapContainer>
          <button className="btn-geolocation" onClick={handleGeoLocation}>
            Usar minha localização
          </button>
        </div>
        <div className="sidebar">
          <Outlet context={cities} />
        </div>
      </div>
    </div>
  )
}

const Cities = () => {
  const cities = useOutletContext()
  return (
    <ul>
      {cities.map(({ id, position, name }) => (
        <Link
          key={id}
          to={`${id}?latitude=${position.latitude}&longitude=${position.longitude}`}
        >
          <li>{name}</li>
        </Link>
      ))}
    </ul>
  )
}

const CityDetails = () => {
  const cities = useOutletContext()
  const params = useParams()
  const navigate = useNavigate()
  const city = cities.find((city) => params.id === String(city.id))

  const handleClickBack = () => navigate(-1)

  return (
    <div className="city-details">
      <div className="row">
        <h5>City name</h5>
        <h3>{city.name}</h3>
      </div>
      <div className="row">
        <h5>Your notes</h5>
        <p>{city.notes}</p>
      </div>
      <button onClick={handleClickBack}>&larr; Back</button>
    </div>
  )
}

const cityLoader = async ({ request }) => {
  const url = new URL(request.url)
  const latitude = url.searchParams.get("latitude")
  const longitude = url.searchParams.get("longitude")
  const response = await fetch(
    `https://api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
  )
  const info = await response.json()
  return { name: info.city, country: info.countryName }
}

const FormAddCity = () => {
  const city = useLoaderData()
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/map/cities")
  }

  return (
    <form className="form-add-city" onSubmit={handleSubmit}>
      <label>
        <span>Nome da cidade</span>
        <input defaultValue={city.name} />
      </label>
      <label>
        <span>Quando você foi para {city.name}?</span>
        <input type="date" />
      </label>
      <label>
        <span>Suas anotações sobre a cidade</span>
        <textarea></textarea>
      </label>
      <div className="buttons">
        <button>&larr; Voltar</button>
        <button>Adicionar</button>
      </div>
    </form>
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
        <Route path="map" element={<MapLayout />} loader={citiesLoader}>
          <Route index element={<Navigate to="cities" replace />} />
          <Route path="cities" element={<Cities />} />
          <Route path="cities/:id" element={<CityDetails />} />
          <Route path="form" element={<FormAddCity />} loader={cityLoader} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  )
  return <RouterProvider router={router} />
}

export { App }
