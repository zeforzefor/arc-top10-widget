# Arc Top 10 widget

A small, read-only card that shows the Arc Top 10 by real buyers, as ranked by
[Zeus Trending](https://t.me/ZeusTrending). Drop it into any web page with two lines of code.

- No dependencies, no build step, under 8 KB
- Fits its container (phone, sidebar or full width)
- Follows the visitor's light or dark mode, or one you pick
- Refreshes every 60 seconds; pauses while the tab is hidden
- No cookies, no tracking; every value is set as text, never as HTML

## Embed

```html
<div data-zeus-top10></div>
<script src="https://zeustools.app/widget.js" async></script>
```

Each row links to the token's chart. The footer links to [zeustools.app](https://zeustools.app), or with `data-ref`
to Zeus on Telegram with your referral link.

To host the script yourself, copy `widget.js` to your site and point the `src` at your copy. It still reads
the public API below.

## Options

Set these on the `div`:

| Attribute | Values | Default |
|---|---|---|
| `data-theme` | `dark` or `light` | the visitor's own setting |
| `data-link` | `dex`: rows open DexScreener | the Zeus chart |
| `data-api` | another URL that serves the same JSON | `https://zeustools.app/api/top10` |
| `data-ref` | your referral code: the footer opens Zeus with your link | none: the footer opens zeustools.app |

Pages that load cards after the script runs can call `window.ZeusTop10.mount(element)`.

If your site sets a Content Security Policy, allow `https://zeustools.app` in `script-src` and
`connect-src`, and inline styles in `style-src` (the widget adds one `<style>` element).

### Your referral link

Get your code with `/referral` in [@TheZeusBuybot](https://t.me/TheZeusBuybot). It is the part after `r_` in your link
(`https://t.me/TheZeusBuybot?start=r_abc1234` → `abc1234`), 4 to 16 letters and digits. Anything else is ignored.

```html
<div data-zeus-top10 data-ref="abc1234"></div>
<script src="https://zeustools.app/widget.js" async></script>
```

The footer then opens `https://t.me/TheZeusBuybot?start=r_abc1234`, so people who open Zeus from your card count as
yours. The rows still open each token's chart. [zeustools.app/widget](https://zeustools.app/widget) writes this code for you.

## The API

`GET https://zeustools.app/api/top10`

JSON, open to any origin (CORS `*`), cached 60 seconds at the edge, no key needed. It only reads.

| Field | Meaning |
|---|---|
| `ok` | `true` when the answer is good |
| `at` | when the board was built (ms since 1970, UTC), or `null` when there is no live board |
| `windowMinutes` | the window for `buyers` (60) |
| `board` | up to 10 rows, best first (empty when nothing is trending) |
| `house` | the Zeus token's own line, shown unranked under the board, or `null` |

Each row in `board`:

| Field | Meaning |
|---|---|
| `rank` | 1 to 10 |
| `symbol` | the token's ticker |
| `name` | the token's name, or `null` |
| `token` | the token's contract address on Arc |
| `price` | price in USD, or `null` |
| `change24h` | 24h price change in %, from the deepest USDC pool on DexScreener, or `null` |
| `mc` | market cap in USD (price × total supply), or `null` |
| `buyers` | real buyers in the last `windowMinutes` |
| `ad` | `true` for a paid ad spot |
| `booked` | `true` for a booked (paid) spot |
| `chart` | the token's chart on GMGN, via Zeus |
| `dex` | the token's main pool on DexScreener |

No wallet addresses are ever included.

Example:

```json
{
  "ok": true,
  "at": 1791360000000,
  "windowMinutes": 60,
  "board": [
    {
      "rank": 1,
      "symbol": "EXAMPLE",
      "name": "Example Token",
      "token": "0x0000000000000000000000000000000000000001",
      "price": 0.00001234,
      "change24h": 12.3,
      "mc": 12340,
      "buyers": 14,
      "ad": false,
      "booked": false,
      "chart": "https://gmgn.ai/arc/token/...",
      "dex": "https://dexscreener.com/arc/..."
    }
  ],
  "house": null
}
```

## Real buyers

A real buyer is a wallet with $10 or more of net buying (bought minus sold) in the window. Bot trades are not
counted, and a wallet that sells what it bought nets nothing. Zeus Trending ranks tokens by these buyers and
their net buying, with brand-new wallets and wallets that buy many tokens at once counting for less. Paid spots
are labelled AD or Booked. More at [zeustools.app/trending](https://zeustools.app/trending).

Nothing in the widget or the API is financial advice.

## Try it

Open `example.html` in a browser. It loads the local `widget.js` in each theme.

## License

MIT. See [LICENSE](LICENSE). Made by [Zeus Tools](https://zeustools.app).
