# Paid subscription bot

Code for the simplest paid subscription bot for Telegram groups and channels. Just add [@paid_subscription_bot](https://t.me/paid_subscription_bot) to your group or channel and start charging crypto for your content!

# Installation and local launch

1. Clone this repo: `git clone https://github.com/backmeupplz/paid_subscription_bot`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn` in the root folder
5. Run `yarn develop`

And you should be good to go! Feel free to fork and submit pull requests. Thanks!

# Environment variables

- `TOKEN` — Telegram bot token
- `MONGO`— URL of the mongo database
- `WEB3_PROVIDER` - Your local/remote Ethereum node

Also, please, consider looking at `.env.sample`.

# Continuous integration

Any commit pushed to `main` gets deployed to [@paid_subscription_bot](https://t.me/paid_subscription_bot) via [CI Ninja](https://github.com/backmeupplz/ci-ninja).

# License

MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!
