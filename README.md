# CRYPTOSTATS - web based crypto trading simulator

#### Video Demo:
[![Video](https://img.youtube.com/vi/5mUimHa_A_w/maxresdefault.jpg)](https://www.youtube.com/watch?v=5mUimHa_A_w)

#### Description:
Cryptostats is a simple and easy to use Crypto trading simulator built with React and uses the coingecko-api.
On login you get $1000 virtual cash to practice your trading skills.

## Usage

- Register for free using your username, email and password.
- Login with your email and password.
- Click the "Buy" button to buy the cryptocurrency in "Buy" tab
- Click the "Sell" button to sell the cryptocurrency
- Check your transaction history in the "History" tab.
- Track your portfolio performance in the "Home" tab.
- Visualize market trends in the "Trending" tab.
- Search for a coin in the search bar to see price chart and market stats.

## Tech stack

- [React](https://reactjs.org/) - Frontend framework
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Supabase](https://supabase.com/) - For database and authentication
- [CoinGecko](https://www.coingecko.com/api/documentation) - Crypto api

## Contributing

We welcome contributions to Cryptostats. If you find a bug or have a feature request, please create an issue on the GitHub repository

#### Local Development Setup

- Installation

    Clone the repository and install the dependencies.

    ```bash
    git clone https://github.com/vimalsaraswat/cryptostats.git
    cd cryptostats
    npm install
    ```

- Create a `.env` file in the root directory of the project. Copy the contents of `.env.example` into the `.env` file and fill in the values for the variables.

    Example:
    ```
    SUPABASE_URL="YOUR SUPABASE URL"
    SUPABASE_KEY="YOUR SUPABASE KEY"
    ```

- To start the development server, run the command below:

    ```bash
    $ npm run dev
    ```
    Open http://localhost:3000 with your browser to see the result.

## License

[MIT](https://choosealicense.com/licenses/mit/)
