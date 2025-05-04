# Country Explorer

A modern React application that allows users to explore countries around the world using the REST Countries API.

## Features

- View a list of all countries with their basic information
- Search for countries by name
- Filter countries by region
- View detailed information about each country
- Responsive design that works on all devices
- Modern UI with Material-UI and Tailwind CSS

## Technologies Used

- React 18
- Material-UI (MUI)
- Tailwind CSS
- React Router
- Axios
- REST Countries API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- pnpm (v7 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd country-explorer
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.jsx
│   └── countries/
│       ├── CountryCard.jsx
│       ├── CountryList.jsx
│       └── SearchAndFilter.jsx
├── pages/
│   ├── Home.jsx
│   └── CountryDetail.jsx
├── services/
│   └── countryApi.js
├── App.jsx
└── main.jsx
```

## API Integration

The application uses the following endpoints from the REST Countries API:

- `GET /all` - Get all countries
- `GET /name/{name}` - Search country by name
- `GET /region/{region}` - Get countries by region
- `GET /alpha/{code}` - Get country by code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [REST Countries API](https://restcountries.com/) for providing the country data
- [Material-UI](https://mui.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
